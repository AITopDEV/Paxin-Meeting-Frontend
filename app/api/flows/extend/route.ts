import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import cookie from 'cookie'; 

export async function POST(req: NextRequest) {
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
    const isArchive = req.nextUrl.searchParams.get('isArchive');
    const { id, days, price } = await req.json();
    const res = await fetch(
      `${process.env.API_URL}/api/blog/addblogtime${isArchive ? '?isArchive=true' : ''}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, days, price }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
