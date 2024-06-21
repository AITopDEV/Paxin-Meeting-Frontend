import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import cookie from 'cookie'; 

export async function POST(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  const session = await getServerSession(authOptions);

  let accessToken = session?.accessToken;
  if (!accessToken) {
    const cookies = headers().get('cookie') || '';
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
  }
  
  if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { vote } = await req.json();
    const res = await fetch(`${process.env.API_URL}/api/blog/addvote/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ IsUP: vote }),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    let upvotes = 0;
    let downvotes = 0;

    const voteRes = await fetch(
      `${process.env.API_URL}/api/blog/allvotes/${id}`
    );

    if (voteRes.ok) {
      const data = await voteRes.json();

      data.votes.forEach((vote: any) => {
        if (vote.IsUP) {
          upvotes++;
        } else {
          downvotes++;
        }
      });
    }

    return NextResponse.json({ success: true, upvotes, downvotes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
