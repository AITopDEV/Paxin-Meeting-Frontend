import { LiveKitRoom } from '@livekit/components-react';
import React, { useEffect, useState } from 'react';
import StreamWrapper from '@/components/stream/stream-wrapper';

type SmallWatchProps = {
  token: string;
  roomId: string;
}

async function getTradingData(roomId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAXTRADE_API_URL}room/get/${roomId}`
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}

export default function SmallWatch({
  token,
  roomId
}: SmallWatchProps) {
  const [publisher, setPublisher] = useState<string>('');

  useEffect(() => {
    const fetchTradingData = async () => {
      if (token !== '') {
        try {
          const tradingData = await getTradingData(roomId);
          if (tradingData && tradingData.data && tradingData.data.publisher) {
            setPublisher(tradingData.data.publisher.userID);
            console.log(tradingData.data.publisher.userID)
          }
        } catch (error) {
          console.error("Error fetching trading data:", error);
        }
      }
    };

    fetchTradingData();
  }, [token, roomId]);

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className='relative flex h-[calc(100vh-81px)] flex-col'
    >
      <StreamWrapper streamerIdentity={publisher} />
    </LiveKitRoom>
  );
}
