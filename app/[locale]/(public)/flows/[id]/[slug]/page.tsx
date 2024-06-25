import { headers } from 'next/headers';
import cookie from 'cookie';
import { ComplainModal } from '@/components/common/complain-modal';
import { CopyButton } from '@/components/common/copy-button';
import { ReportModal } from '@/components/common/report-modal';
import BackButton from '@/components/home/back-button';
import { FlowImageGallery } from '@/components/home/flow/flow-image-gallery';
import { UpvoteCard } from '@/components/home/flow/upvote-card';
import MessageForm from '@/components/home/messsage-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import authOptions from '@/lib/authOptions';
import getRoomId from '@/lib/server/chat/getRoomId';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { BiSolidCategory } from 'react-icons/bi';
import { FaExclamation, FaTelegramPlane } from 'react-icons/fa';
import { FaRubleSign } from 'react-icons/fa6';
import { IoEyeSharp, IoFlagOutline } from 'react-icons/io5';
import { MdOutlineHouseSiding, MdFavoriteBorder, MdOutlineFavorite } from 'react-icons/md';
import { RxCopy } from 'react-icons/rx';
import { CiStreamOn, CiStreamOff } from 'react-icons/ci';

interface BlogDetails {
  id: number;
  title: string;
  description: string;
  streaming: string[];
  content: string;
  review: {
    views: number;
    upvotes: number;
    downvotes: number;
  };
  vote: number;
  gallery: {
    original: string;
    thumbnail: string;
  }[];
  author: {
    username: string;
    userId: string;
    avatar: string;
    bio: string;
    telegram: string;
    bot: boolean;
  };
  price: number;
  link: string;
  hashtags: string[];
  categories: string[];
  cities: string[];
  countrycode: string;
  me: boolean;
}

interface FlowPageProps {
  params: { id: string; slug: string; locale: string };
  searchParams: { [key: string]: string | undefined | null };
}

interface Favorite {
  ID: number;
  UserID: string;
  BlogID: number;
}

async function getData(locale: string, id: string, slug: string, userId: string | null) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/blog/${slug}?language=${locale}`,
      {
        headers: {
          name: id || '',
        },
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const blogData = await res.json();

    const voteRes = await fetch(
      `${process.env.API_URL}/api/blog/allvotes/${blogData.data[0].id}`
    );

    if (!voteRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const voteData = await voteRes.json();

    if (voteData.status !== 'success') {
      throw new Error('Failed to fetch data');
    }

    const headersList = headers();
    const cookiesHeader = headersList.get('cookie');
    const cookiesParsed = cookiesHeader ? cookie.parse(cookiesHeader) : {};
    const token = cookiesParsed['access_token'];
    const favoriteRes = await fetch(`${process.env.API_URL}/api/blog/getFav`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then((response) => {
      if (response.ok) {
        console.log(response);
      } else {
        console.error('err:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('err:', error);
    });

    // console.log(favoriteRes)
    // if (favoriteRes.status !== 'success') {
    //   throw new Error('Failed to fetch data');
    // }

    // const favoriteData = await favoriteRes.json();
    // console.log(favoriteData)

    // const isFavorite = favoriteData.data.some((fav: Favorite) => fav.BlogID === blogData.data[0].id);


    const blog = {
      id: blogData.data[0].id,
      streaming: blogData?.data[0]?.userProfile?.streaming?.[0]?.RoomID || null,
      title:
        blogData.data[0].multilangtitle[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      description:
        blogData.data[0].multilangdescr[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      content:
        blogData.data[0].multilangcontent[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
      review: {
        views: blogData.data[0].views,
        upvotes: voteData.votes.filter((item: any) => item?.IsUP).length || 0,
        downvotes:
          voteData.votes.filter((item: any) => !item?.IsUP).length || 0,
      },
      vote: voteData.votes.find(
        (item: any) => item?.UserID === userId
      )?.IsUP
        ? 1
        : voteData.votes.find((item: any) => item?.UserID === userId)
              ?.IsUP === false
          ? -1
          : 0,
      gallery: blogData.data[0].photos[0].files.map((file: any) => {
        return {
          original: `https://proxy.myru.online/400/https://img.myru.online/${file.path}`,
          thumbnail: `https://proxy.myru.online/50/https://img.myru.online/${file.path}`,
        };
      }),
      author: {
        username: blogData.data[0].user.name,
        userId: blogData.data[0].user.userID,
        avatar: `https://proxy.myru.online/100/https://img.myru.online/${blogData.data[0].user.photo}`,
        bio: blogData.data[0].userProfile.multilangtitle[
          locale.charAt(0).toUpperCase() + locale.slice(1)
        ],
        telegram: blogData.data[0].user.telegramactivated
          ? blogData.data[0].user.telegramname
          : '',
        bot: blogData.data[0].user.is_bot,
      },
      price: blogData.data[0].total,
      link: `/${blogData.data[0].uniqId}/${blogData.data[0].slug}`,
      hashtags: blogData.data[0].hashtags,
      categories: blogData.data[0].catygory.map(
        (catygory: any) => catygory.name
      ),
      cities: blogData.data[0].city.map((city: any) => city.name),
      countrycode: blogData.data[0].lang,
      me: userId === blogData.data[0].user.userID,
      // isFavorite: isFavorite,

    };

    return blog;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: FlowPageProps): Promise<Metadata> {
  const headersList = headers();
  const cookiesHeader = headersList.get('cookie');
  const cookiesParsed = cookiesHeader ? cookie.parse(cookiesHeader) : {};
  const userIdCookie = cookiesParsed['UserID'];
  const token = cookiesParsed['access_token'];
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || userIdCookie || null;
  

  const blogDetails: BlogDetails | null = await getData(
    params.locale,
    params.id,
    params.slug,
    userId
  );

  return {
    title: blogDetails?.title || '',
    description: blogDetails?.description || '',
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || ''),
    openGraph: {
      title: blogDetails?.title || '',
      description: blogDetails?.description || '',
      images: blogDetails?.gallery.map((item: any) => item.original) || [],
    },
  };
}

export default async function FlowPage({
  params,
  searchParams,
}: FlowPageProps) {
  const t = await getTranslations('main');
  const headersList = headers();
  const cookiesHeader = headersList.get('cookie');
  const cookiesParsed = cookiesHeader ? cookie.parse(cookiesHeader) : {};
  const userIdCookie = cookiesParsed['UserID'];
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || userIdCookie || null;

  const blogDetails: BlogDetails | null = await getData(
    params.locale,
    params.id,
    params.slug,
    userId
  );

  const roomId = await getRoomId(blogDetails?.author?.userId || '');

  return blogDetails ? (
    <section className='container px-4 py-4 md:px-8'>
      <div className='flex justify-between'>
        <BackButton callback={searchParams['callback']} />
      </div>
      <div className='font-satoshi'>
        <div className='flex gap-3 pb-2 text-xl font-semibold text-secondary-foreground'>
          {blogDetails?.title}
        </div>
        <div className='mb-4 text-sm text-muted-foreground'>
          {blogDetails?.description}
        </div>
      </div>

      <div className='my-4 grid gap-4 md:grid-cols-3 xl:grid-cols-3'>
        <div className='md:col-span-2 xl:col-span-2'>
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            <div className='col-span-2 grid grid-cols-2 gap-2 xl:col-span-3'>
              <div>
                <div className='flex items-center gap-2 '>
                  <MdOutlineHouseSiding className='size-5' />
                  {t('city')}
                </div>
                <div className='flex gap-2' style={{ overflowWrap: 'anywhere' }}>
                  {blogDetails.cities &&
                    blogDetails.cities.map((city: string) => (
                      <Link
                        className='w-full'
                        href={`/home?mode=flow&city=${city}`}
                        key={city}
                      >
                        <Badge
                          variant='outline'
                          className='max-w-full rounded-full bg-primary/10 px-4 text-primary hover:border-primary'
                        >
                          {city}
                        </Badge>
                      </Link>
                    ))}
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2 overflow-hidden'>
                  <BiSolidCategory className='size-4' />
                  {t('category')}
                </div>
                <div className='flex gap-2' style={{ overflowWrap: 'anywhere' }}>
                  {blogDetails.categories &&
                    blogDetails.categories.map((category: string) => (
                      <Link
                        className='w-full'
                        href={`/home?mode=flow&category=${category}`}
                        key={category}
                      >
                        <Badge
                          variant='outline'
                          className='max-w-full rounded-full bg-primary/10 px-4 text-primary hover:border-primary'
                        >
                          {category}
                        </Badge>
                      </Link>
                    ))}
                </div>
              </div>
              {blogDetails.price !== 0 && (
                <div>
                  <div className='flex items-center gap-2'>
                    <FaRubleSign className='size-4' />
                    {t('price')}
                  </div>
                  <div className='flex gap-2'>
                    <Link
                      className='w-full'
                      href={`/home?mode=flow&money=${blogDetails.price}`}
                      key={blogDetails.price}
                    >
                      <Badge
                        variant='outline'
                        className='max-w-full rounded-full bg-primary/10 px-4 text-primary hover:border-primary'
                      >
                        {blogDetails.price?.toLocaleString('ru-RU', {
                          style: 'currency',
                          currency: 'RUB',
                          maximumFractionDigits: 0,
                        })}
                      </Badge>
                    </Link>
                  </div>
                </div>
              )}
              <div className={blogDetails.price === 0 ? 'col-span-2' : ''}>
                <div className='flex items-center gap-2'>
                  <IoEyeSharp className='size-4' />
                  {t('views')}
                </div>
                <div className='flex gap-2'>
                  <Badge
                    variant='outline'
                    className='max-w-full rounded-full bg-primary/10 px-4 text-primary hover:border-primary'
                  >
                    {blogDetails.review?.views}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <Separator className='my-4' />
          <div className='block md:hidden'>
          <div className='absolute z-10'>
          {blogDetails?.streaming?.length > 0 ? (
            <Link href={`/stream/${blogDetails.streaming}`} className='stream-item'>
              <div className='flex items-center justify-start  bg-red-500 px-2 text-white'>
                <CiStreamOn className='mr-2' />
                <span>В эфире</span>
              </div>
            </Link>
          ) : (
            <div className='flex items-center justify-start bg-black/50 px-2 text-white'>
              <CiStreamOff className='mr-2' />
              <span>Вне эфира</span>
            </div>
          )}
          </div>
            <FlowImageGallery images={blogDetails?.gallery || []} />
          </div>
          <div>
            <Label className='text-xl font-semibold '>
              {t('description')}:
            </Label>
            <div
              className='mt-2 text-muted-foreground'
              dangerouslySetInnerHTML={{ __html: blogDetails.content }}
            />
          </div>
        </div>
        <div className='mx-auto w-full space-y-4'>
          <div className='hidden md:block'>
          <div className='absolute z-10'>
          {blogDetails?.streaming?.length > 0 ? (
            <Link href={`/stream/${blogDetails.streaming}`} className='stream-item'>
              <div className='flex items-center justify-start  bg-red-500 px-2 text-white'>
                <CiStreamOn className='mr-2' />
                <span>В эфире</span>
              </div>
            </Link>
          ) : (
            <div className='flex items-center justify-start bg-black/50 px-2 text-white'>
              <CiStreamOff className='mr-2' />
              <span>Вне эфира</span>
            </div>
          )}
          </div>
            <Card>
              <FlowImageGallery images={blogDetails?.gallery || []} />
            </Card>
          </div>

          <Card className='mx-auto w-full'>
            <CardContent className='space-y-8 px-6 py-8 font-satoshi'>
              <div>
                <div className='text-center text-lg font-semibold'>
                  {t('anything_wrong_with_the_post')}
                </div>
                <div className='text-center text-xs text-muted-foreground'>
                  {t('make_a_complaining_about_the_post')}
                </div>
              </div>
              <ComplainModal>
                <Button
                  variant='outline'
                  className='w-full !border-primary dark:text-primary text-white'
                >
                  <IoFlagOutline className='mr-2 size-4' />
                  {t('complain')}
                </Button>
              </ComplainModal>
            </CardContent>
          </Card>
          <Card className='mx-auto w-full'>
            <CardContent className='px-6 pt-4 font-satoshi'>
              <div className='flex flex-col items-center'>
                <UpvoteCard
                  id={blogDetails.id}
                  vote={blogDetails.vote}
                  upvotes={blogDetails.review?.upvotes}
                  downvotes={blogDetails.review?.downvotes}
                  me={blogDetails.me}
                />
              </div>
            </CardContent>
          </Card>
          <Card className='mx-auto w-full'>
            <CardHeader className='items-center gap-2'>
              <div className='relative h-28  overflow-hidden rounded-lg'>
                <Image
                  src={blogDetails.author?.avatar}
                  className='rounded-full'
                  alt=''
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <Link
                  href={`/profiles/${blogDetails.author?.username}`}
                  className='underline'
                >
                  <div className='w-full max-w-full truncate text-center font-semibold'>
                    @{blogDetails.author?.username}
                  </div>
                </Link>
                <div className='line-clamp-2 break-all text-center text-sm'>
                  {blogDetails.author?.bio}
                </div>
              </div>
            </CardHeader>
            <CardFooter className='flex justify-around gap-2'>
              <div className='flex gap-2'>
                <ReportModal>
                  <Button
                    variant='outline'
                    className='rounded-full'
                    size='icon'
                  >
                    <FaExclamation className='size-4' />
                  </Button>
                </ReportModal>
                <CopyButton
                  variant='outline'
                  className='rounded-full'
                  size='icon'
                  text={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/profiles/${blogDetails.author.username}`}
                >
                  <RxCopy className='size-4' />
                </CopyButton>
                {blogDetails.author?.telegram && (
                  <Button
                    variant='outline'
                    className='rounded-full'
                    size='icon'
                    asChild
                  >
                    <Link
                      href={`tg://resolve?domain=${blogDetails.author?.telegram}`}
                      target='_blank'
                    >
                      <FaTelegramPlane className='size-4' />
                    </Link>
                  </Button>
                )}
              </div>
            </CardFooter>
            <div className='flex flex-col gap-4 text-center pb-4 pr-2 px-2'>
              <Button className='btn w-full !rounded-md' asChild>
                <Link href={`/profiles/${blogDetails.author?.username}`}>
                  {t('visit_profile')}
                </Link>
              </Button>
              {userId ? (
                <MessageForm
                  user={{
                    username: blogDetails.author?.username,
                    userId: blogDetails.author?.userId,
                    bot: blogDetails.author?.bot,
                  }}
                >
                  <Button className='btn w-full !rounded-md'>
                    {roomId === '' ? t('start_chat') : t('send_message')}
                  </Button>
                </MessageForm>
              ) : (
                <Button className='btn w-full !rounded-md' asChild>
                  <Link
                    href={`/auth/signin?callbackUrl=/flows/${params.id}/${params.slug}`}
                  >
                    {t('start_chat')}
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  ) : (
    <div></div>
  );
}
