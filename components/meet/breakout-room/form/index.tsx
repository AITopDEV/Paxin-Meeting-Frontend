import React, { useEffect, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { RoomType, UserType } from './types';
import { participantsSelector } from '@/store/slices/participantSlice';
import useStorePreviousInt from '@/helpers/hooks/useStorePreviousInt';
import { updateBreakoutRoomDroppedUser } from '@/store/slices/breakoutRoomSlice';
import { useCreateBreakoutRoomsMutation } from '@/store/services/breakoutRoomApi';
import { updateShowManageBreakoutRoomModal } from '@/store/slices/bottomIconsActivitySlice';
import { RoomBox } from './roomBox';
import {
  CreateBreakoutRoomsReq,
  BreakoutRoom,
} from '@/helpers/proto/plugnmeet_breakout_room_pb';
import { useTranslations } from 'next-intl';

const droppedUserSelector = createSelector(
  (state: RootState) => state.breakoutRoom,
  (breakoutRoom) => breakoutRoom.droppedUser
);

const FromElems = () => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();
  const participants = useAppSelector(participantsSelector.selectAll);
  const droppedUser = useAppSelector(droppedUserSelector);

  const [totalRooms, setTotalRooms] = useState<number>(1);
  const preTotalRooms = useStorePreviousInt(totalRooms);
  const [roomDuration, setRoomDuration] = useState<number>(15);
  const [welcomeMsg, setWelcomeMsg] = useState<string>(
    store.getState().session.currentRoom.metadata?.welcome_message ?? ''
  );
  const [rooms, setRooms] = useState<Array<RoomType>>();
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [createBreakoutRoom, { isLoading, data }] =
    useCreateBreakoutRoomsMutation();

  // we'll clean during unmount
  useEffect(() => {
    return () => {
      dispatch(
        updateBreakoutRoomDroppedUser({
          id: '',
          roomId: 0,
        })
      );
    };
  }, [dispatch]);

  useEffect(() => {
    // if length same this mean no changes
    if (users.length === participants.length) {
      return;
    }

    const tmp: Array<UserType> = [];
    participants.forEach((p) => {
      const has = users.filter((u) => u.id === p.userId);
      if (has.length) {
        tmp.push(has[0]);
      } else {
        tmp.push({
          id: p.userId,
          name: p.name,
          roomId: 0,
          joined: false,
        });
      }
    });

    setUsers(tmp);
  }, [participants, users]);

  // if room number decrease then we'll reset otherwise user will be missing
  useEffect(() => {
    // @ts-ignore
    if (totalRooms === preTotalRooms || totalRooms > preTotalRooms) {
      return;
    }
    const users: Array<UserType> = [];
    participants.forEach((p) => {
      users.push({
        id: p.userId,
        name: p.name,
        roomId: 0,
        joined: false,
      });
    });
    setUsers(users);
  }, [participants, totalRooms, preTotalRooms]);

  useEffect(() => {
    const rooms: Array<RoomType> = [
      {
        id: 0,
        name: t('breakout-room.main-room'),
      },
    ];
    for (let i = 0; i < totalRooms; i++) {
      rooms.push({
        id: i + 1,
        name: t('breakout-room.new-room', { num: i + 1 }),
      });
    }
    setRooms(rooms);
    //eslint-disable-next-line
  }, [totalRooms]);

  useEffect(() => {
    if (droppedUser.id === '') {
      return;
    }
    const newUsers = users.map((user) => {
      if (user.id === droppedUser.id) {
        user.roomId = droppedUser.roomId;
      }
      return user;
    });

    setUsers(newUsers);
    //eslint-disable-next-line
  }, [droppedUser]);

  useEffect(() => {
    if (!isLoading && data) {
      if (data.status) {
        toast(t('breakout-room.rooms-created'), {
          type: 'info',
        });
        dispatch(updateShowManageBreakoutRoomModal(false));
      } else {
        //@ts-ignore
        toast(t(data.msg), {
          type: 'error',
        });
      }
    }
    //eslint-disable-next-line
  }, [isLoading, data]);

  const renderBreakoutRoomNumbers = () => {
    const max =
      store.getState().session.currentRoom.metadata?.room_features
        ?.breakout_room_features?.allowed_number_rooms ?? 6;

    const options: Array<JSX.Element> = [];
    for (let i = 0; i < max; i++) {
      options.push(
        <option key={i} value={i + 1}>
          {i + 1}
        </option>
      );
    }

    return (
      <div className='numbers-of-room mb-4 w-full sm:w-56 sm:ltr:mr-10 sm:rtl:ml-10'>
        <label
          className='mb-1 block text-base text-black dark:text-darkText'
          htmlFor='breakout-room-number'
        >
          {t('breakout-room.num-rooms')}
        </label>
        <select
          className='block h-9 w-full rounded border border-solid bg-transparent p-1 outline-none dark:border-darkText dark:text-darkText'
          id='breakout-room-number'
          onChange={(e) => setTotalRooms(Number(e.currentTarget.value))}
        >
          {options}
        </select>
      </div>
    );
  };

  const randomSelection = () => {
    if (!users || !rooms) {
      return;
    }
    const tmp = [...users];
    const tmpRooms = [...rooms];
    tmpRooms.shift();

    for (let i = 0; i < tmp.length; i++) {
      const r = Math.floor(Math.random() * tmpRooms.length);
      tmp[i].roomId = tmpRooms[r].id;
    }

    setUsers(tmp);
  };

  const startBreakoutRooms = () => {
    const tmp: Array<BreakoutRoom> = [];
    rooms?.forEach((r) => {
      if (r.id !== 0) {
        const u = users.filter((u) => u.roomId === r.id);
        if (u.length) {
          const room = new BreakoutRoom({
            id: `${r.id}`,
            title: r.name,
            users: u,
            duration: BigInt(roomDuration),
            started: false,
            created: BigInt(Date.now()),
          });
          tmp.push(room);
        }
      }
    });

    if (!tmp.length) {
      toast(t('breakout-room.need-one-user'), {
        type: 'error',
      });
      return;
    }

    const req = new CreateBreakoutRoomsReq({
      duration: BigInt(roomDuration),
      welcomeMsg: welcomeMsg,
      rooms: tmp,
    });
    createBreakoutRoom(req);
  };

  return (
    <div className='break-out-room-main-area'>
      <div className='row flex flex-wrap items-end justify-start'>
        {renderBreakoutRoomNumbers()}
        <div className='room-durations mb-4 w-full sm:w-56'>
          <label
            className='mb-1 block text-base text-black dark:text-darkText'
            htmlFor='breakout-room-duration'
          >
            {t('breakout-room.duration')}
          </label>
          <input
            className='block h-9 w-full rounded border border-solid bg-transparent p-1 outline-none dark:border-darkText dark:text-darkText'
            id='breakout-room-duration'
            type='number'
            value={roomDuration}
            onChange={(e) => setRoomDuration(Number(e.currentTarget.value))}
          />
        </div>
      </div>
      <div className='row flex flex-wrap items-end justify-between'>
        <div className='room-welcome-messages mb-4 w-full sm:max-w-[30.5rem] sm:ltr:mr-10 sm:rtl:ml-10'>
          <label
            className='mb-1 block text-base text-black dark:text-darkText'
            htmlFor='breakout-room-welcome'
          >
            {t('breakout-room.welcome-msg')}
          </label>
          <textarea
            className='block min-h-[60px] w-full rounded border border-solid bg-transparent p-2 outline-none dark:border-darkText dark:text-white/90'
            id='breakout-room-welcome'
            onChange={(e) => setWelcomeMsg(e.currentTarget.value)}
            value={welcomeMsg}
          ></textarea>
        </div>
        <div className='random-room-select mb-4 ltr:mr-6 rtl:ml-6'>
          <button
            className='text-base text-primaryColor dark:text-secondaryColor'
            onClick={randomSelection}
          >
            {t('breakout-room.random-selection')}
          </button>
        </div>
      </div>
      <div className='draggable-room-area clear-both flex flex-wrap overflow-hidden'>
        {rooms?.map((room) => {
          return (
            <div
              className='room-box-wrap m-[3px] w-[calc(50%-6px)] sm:m-0 sm:w-auto'
              key={room.id}
            >
              <RoomBox
                roomId={room.id}
                name={room.name}
                users={users.filter((user) => user.roomId === room.id)}
              />
            </div>
          );
        })}
      </div>
      <div className='mt-4 bg-gray-50 pb-3 pt-4 text-right dark:bg-transparent'>
        <button
          className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondaryColor focus:bg-secondaryColor focus:outline-none focus:ring-2 focus:ring-offset-2'
          onClick={startBreakoutRooms}
        >
          {t('breakout-room.start')}
        </button>
      </div>
    </div>
  );
};

export default FromElems;
