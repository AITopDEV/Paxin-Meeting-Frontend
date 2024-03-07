import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import authOptions from '@/lib/authOptions';

export async function POST(req: NextRequest) {
    try {
        const mode = req.nextUrl.searchParams.get('mode')
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requestBody = await req.json();

        // console.log(`${process.env.API_URL}/api/newreq/post?mode=${mode}`, requestBody)

        const res = await fetch(
            `${process.env.API_URL}/api/newreq/post?mode=${mode}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );
        
        if (!res.ok) {
            throw new Error('Failed to create new item');
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}
