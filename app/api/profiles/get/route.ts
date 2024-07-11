import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.toString();

  const locale = req.nextUrl.searchParams.get('language') || 'en';

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/profiles/get${query ? `?${query}` : ''}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const profiles = data.data.map((item: any) => {
      return {
        username: item.User.Name,
        bio: item.MultilangDescr[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
        avatar:
          item.photos?.length > 0 && item.photos[0].files?.length > 0
            ? `https://proxy.myru.online/300/https://img.myru.online/${item.photos[0].files[0].path}`
            : '',
        tags: item.Hashtags.map((tag: any) => tag.Hashtag),
        cities: item.City.map((city: any) => city.Translations[0].Name),
        categories: item.Guilds.map((guild: any) => guild.Translations[0].Name),
        qrcode: item.User.Name,
        countrycode: item.Lang,
        totalfollowers: item.User.TotalFollowers,
        review: {
          totaltime: item.User.TotalOnlineHours[0],
          monthtime: item.User.OnlineHours[0],
          totalposts: item.User.TotalBlogs,
        },
        streaming: item.streaming?.length > 0
        ? item.streaming?.map((stream: any) => ({
            roomID: stream.RoomID,
            title: stream.Title,
            userID: stream.UserID,
            createdAt: stream.CreatedAt,
          }))
        : [],
      };
    });

    return NextResponse.json({ data: profiles, meta: data.meta });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
