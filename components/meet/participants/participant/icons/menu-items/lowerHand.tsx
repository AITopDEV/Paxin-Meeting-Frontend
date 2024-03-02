import React from 'react';
import { Menu } from '@headlessui/react';

import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { participantsSelector } from '@/store/slices/participantSlice';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { updateIsActiveRaisehand } from '@/store/slices/bottomIconsActivitySlice';
import { toast } from 'react-toastify';
import {
  CommonResponse,
  DataMessageReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { DataMsgBodyType } from '@/helpers/proto/plugnmeet_datamessage_pb';
import { useTranslations } from 'next-intl';

interface ILowerHandMenuItemProps {
  userId: string;
}

const LowerHandMenuItem = ({ userId }: ILowerHandMenuItemProps) => {
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, userId)
  );
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const onClick = async () => {
    const session = store.getState().session;
    const body = new DataMessageReq({
      roomSid: session.currentRoom.sid,
      roomId: session.currentRoom.room_id,
      msgBodyType: DataMsgBodyType.OTHER_USER_LOWER_HAND,
      msg: participant?.userId,
    });

    const r = await sendAPIRequest(
      'dataMessage',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (res.status) {
      dispatch(updateIsActiveRaisehand(false));
    } else {
      // @ts-ignore
      toast(t(res.msg), {
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
              {t('footer.icons.lower-hand')}
            </button>
          )}
        </Menu.Item>
      </div>
    );
  };

  return <>{participant?.metadata.raised_hand ? render() : null}</>;
};

export default LowerHandMenuItem;
