import React, { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { toast } from 'react-toastify';

import { store } from '@/store';
import { useAppSelector } from '@/store/hook';
import { participantsSelector } from '@/store/slices/participantSlice';
import { sendWebsocketMessage } from '@/helpers/websocket';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import {
  DataMessage,
  DataMsgBodyType,
  DataMsgType,
} from '@/helpers/proto/plugnmeet_datamessage_pb';
import {
  CommonResponse,
  MuteUnMuteTrackReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

interface IMicMenuItemProps {
  userId: string;
}
const MicMenuItem = ({ userId }: IMicMenuItemProps) => {
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, userId)
  );
  const session = store.getState().session;
  const [text, setText] = useState<string>('Ask to share Microphone');
  const [task, setTask] = useState<string>('');
  const t = useTranslations('meet');
  useEffect(() => {
    if (participant?.audioTracks === 0) {
      setText(t('left-panel.menus.items.ask-to-share-microphone').toString());
      setTask('left-panel.menus.items.share-microphone');
    } else if (participant?.isMuted) {
      setText(t('left-panel.menus.items.ask-to-unmute-mic').toString());
      setTask('left-panel.menus.items.unmute-mic');
    } else if (participant?.audioTracks) {
      setText(t('left-panel.menus.items.mute-mic').toString());
      setTask('mute');
    }
  }, [t, participant?.isMuted, participant?.audioTracks]);

  const onClick = () => {
    if (task === 'mute') {
      muteAudio();
      return;
    }

    const dataMsg = new DataMessage({
      type: DataMsgType.SYSTEM,
      roomSid: session.currentRoom.sid,
      roomId: session.currentRoom.room_id,
      to: userId,
      body: {
        type: DataMsgBodyType.INFO,
        from: {
          sid: session.currentUser?.sid ?? '',
          userId: session.currentUser?.userId ?? '',
        },
        msg:
          t('left-panel.menus.notice.asked-you-to', {
            name: session.currentUser?.name,
            // @ts-ignore
          }) + t(task),
      },
    });

    sendWebsocketMessage(dataMsg.toBinary(), t);

    toast(
      t('left-panel.menus.notice.you-have-asked', {
        name: participant?.name,
        // @ts-ignore
      }) + t(task),
      {
        toastId: 'asked-status',
        type: 'info',
      }
    );
  };

  const muteAudio = async () => {
    const session = store.getState().session;

    const body = new MuteUnMuteTrackReq({
      sid: session.currentRoom.sid,
      roomId: session.currentRoom.room_id,
      userId: participant?.userId,
      muted: true,
    });
    const r = await sendAPIRequest(
      'muteUnmuteTrack',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (res.status) {
      toast(
        t('left-panel.menus.notice.you-have-muted-to', {
          name: participant?.name,
        }),
        {
          toastId: 'asked-status',
          type: 'info',
        }
      );
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        toastId: 'asked-status',
        type: 'error',
      });
    }
  };

  const render = () => {
    return (
      <div className='' role='none'>
        <Menu.Item>
          {() => (
            <button
              className='group flex w-full items-center rounded-md px-2 py-[0.4rem] text-left text-xs text-gray-900 transition ease-in hover:bg-primaryColor hover:text-white dark:text-darkText lg:text-sm'
              onClick={() => onClick()}
            >
              {text}
            </button>
          )}
        </Menu.Item>
      </div>
    );
  };
  return (
    <>{session.currentUser?.userId !== participant?.userId ? render() : null}</>
  );
};

export default MicMenuItem;
