import React, { useState, useEffect, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { useAppDispatch, useAppStore } from '@/store/hook';
import { addServerVersion, addToken } from '@/store/slices/sessionSlice';
import useBodyPix from '@/components/meet/virtual-background/hooks/useBodyPix';
import useKeyboardShortcuts from '@/helpers/hooks/useKeyboardShortcuts';
import useDesignCustomization from '@/helpers/hooks/useDesignCustomization';
import useWatchWindowSize from '@/helpers/hooks/useWatchWindowSize';
import useWatchVisibilityChange from '@/helpers/hooks/useWatchVisibilityChange';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
import {
  VerifyTokenReq,
  VerifyTokenRes,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { clearAccessToken, getAccessToken } from '@/helpers/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useAppSelector } from '@/store/hook';
import { RTCContext } from '@/provider/webRTCProvider';
import { TiVideo } from 'react-icons/ti';
import Draggable, { DraggableHandle } from '../ui/draggable.tsx';
import { FullscreenIcon, Minimize2Icon, MoveIcon } from 'lucide-react';
import {
  participantSelector,
  waitingForApprovalSelector,
  isStartupSelector,
} from './meetwrapper';
import Meet from './meet';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

const roomIdSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.currentRoom.room_id
);

export default function SmallMeet() {
  const [isActive, setActive] = useState<boolean>(false);
  const participants = useAppSelector(participantSelector);
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const locale = useLocale();
  const toastId = useRef<string>(null);
  const store = useAppStore();
  const roomId = useAppSelector(roomIdSelector);
  const [loading, setLoading] = useState<boolean>(true);
  // // it could be recorder or RTMP bot
  const [isRecorder, setIsRecorder] = useState<boolean>(false);
  const [userTypeClass, setUserTypeClass] = useState('participant');
  const [accessTokenLocal, setAccessTokenLocal] = useState('');
  const [accessTokenLoaded, setAccessTokenLoaded] = useState(false);
  // const [livekitInfo, setLivekitInfo] = useState<LivekitInfo>();
  const {
    livekitInfo,
    setLivekitInfo,
    currentConnection,
    setCurrentConnection,
    error,
    setError,
    roomConnectionStatus,
    setRoomConnectionStatus,
    startLivekitConnection,
  } = useContext(RTCContext);
  const waitForApproval = useAppSelector(waitingForApprovalSelector);

  // console.log('[App Store]: ', debugStore);
  // // we'll require making ready virtual background
  // // elements as early as possible.
  useBodyPix();
  const isStartup = useAppSelector(isStartupSelector);
  // // some custom hooks
  useKeyboardShortcuts(currentConnection?.room);
  useDesignCustomization();
  useWatchVisibilityChange();
  const { deviceClass, orientationClass } = useWatchWindowSize(
    currentConnection?.room
  );

  const verifyToken = async () => {
    console.log('HEADER/VerifyToken');
    let res: VerifyTokenRes;
    try {
      const isProductionStr = process.env.NEXT_PUBLIC_IS_PRODUCTION;
      const isProduction: boolean | undefined =
        isProductionStr === 'true'
          ? true
          : isProductionStr === 'false'
            ? false
            : undefined;
      const reqObj = new VerifyTokenReq({
        isProduction,
      });
      const r = await sendAPIRequest(
        'verifyToken',
        reqObj.toBinary(),
        false,
        'application/protobuf',
        'arraybuffer'
      );
      res = VerifyTokenRes.fromBinary(new Uint8Array(r));
    } catch (error: any) {
      clearAccessToken();
      setAccessTokenLoaded(false);
      // console.error(error);
      // setRoomConnectionStatus('ready');
      // setLoading(false);
      // setError({
      //   title: t('app.verification-failed-title'),
      //   text: t('app.token-not-valid'),
      // });
      // clearAccessToken();
      return;
    }

    setRoomConnectionStatus('ready');
    setLoading(false);
    if (res.status && res.livekitHost && res.token) {
      // we'll store token that we received from URL
      dispatch(addToken(accessTokenLocal));
      dispatch(addServerVersion(res.serverVersion ?? ''));

      // for livekit need to use generated token & host
      setLivekitInfo({
        livekit_host: res.livekitHost,
        token: res.token,
        enabledE2EE: res.enabledE2ee,
      });
    } else {
      clearAccessToken();
      setAccessTokenLoaded(false);
      // setError({
      //   title: t('app.verification-failed-title'),
      //   //@ts-ignore
      //   text: t(res.msg),
      // });
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      setError({
        title: t('app.token-missing-title'),
        text: t('app.token-missing-des'),
      });
    } else {
      setAccessTokenLocal(token || ''), setAccessTokenLoaded(true);
    }
  }, []);

  // useEffect(() => {
  //   if (accessTokenLoaded && !accessTokenLocal) {
  //     setLoading(false);
  //     setError({
  //       title: t('app.token-missing-title'),
  //       text: t('app.token-missing-des'),
  //     });
  //   }
  // }, [accessTokenLocal, accessTokenLoaded]);
  useEffect(() => {
    if (
      window.location.protocol === 'http:' &&
      window.location.hostname !== 'localhost'
    ) {
      setLoading(false);
      setError({
        title: t('app.require-ssl-title'),
        text: t('app.require-ssl-des'),
      });
    }
  }, []);

  useEffect(() => {
    if (accessTokenLoaded && accessTokenLocal) {
      let timeout: any;

      if (!currentConnection && roomConnectionStatus !== 'connected') {
        setRoomConnectionStatus('checking');
        timeout = setTimeout(() => {
          verifyToken();
        }, 300);
      }
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [
    accessTokenLocal,
    accessTokenLoaded,
    currentConnection,
    setRoomConnectionStatus,
  ]);

  useEffect(() => {
    if (
      roomConnectionStatus === 'connecting' ||
      roomConnectionStatus === 'checking'
    ) {
      setLoading(true);
    } else if (roomConnectionStatus === 're-connecting') {
      //eslint-disable-next-line
      // @ts-ignore
      toastId.current = toast.loading(
        t('notifications.room-disconnected-reconnecting'),
        {
          type: toast.TYPE.WARNING,
          closeButton: false,
          autoClose: false,
        }
      );
    } else {
      setLoading(false);
      if (toastId.current) {
        toast.dismiss(toastId.current);
      }
    }
    //eslint-disable-next-line
  }, [roomConnectionStatus]);

  useEffect(() => {
    if (roomConnectionStatus === 'connected') {
      if (
        currentConnection?.room.localParticipant.identity === 'RECORDER_BOT' ||
        currentConnection?.room.localParticipant.identity === 'RTMP_BOT'
      ) {
        setIsRecorder(true);
        dispatch(updateIsActiveChatPanel(false));
      }

      if (store.getState().session.currentUser?.metadata?.is_admin) {
        setUserTypeClass('admin');
      }
    }
    //eslint-disable-next-line
  }, [roomConnectionStatus]);

  useEffect(() => {
    if (livekitInfo) {
      // @ts-ignore
      console.log('HEADER/StartLivConnection');
      const currentConnection = startLivekitConnection(livekitInfo, t);
      setCurrentConnection(currentConnection);
    }
  }, [livekitInfo]);
  return true ? (
    <>
      <button onClick={() => setActive((e) => true)}>
        <div className='flex items-center justify-center'>
          <span className='relative -top-2 left-12 rounded-full bg-card-gradient-menu px-2 text-center text-xs'>
            {participants.length && participants.length}
          </span>
          <TiVideo size={32} />
        </div>
      </button>

      {/* <Meet currentConnection={currentConnection} />; */}
      {isActive && (
        <div className='fixed left-[calc(10vw)] mx-auto'>
          {/* @ts-ignore */}
          <Draggable
            axis='both'
            header='handle'
            handle='.handle'
            defaultPosition={{ x: 0, y: 0 }}
            //   position={null}
            scale={1}
          >
            <div className='absolute w-[calc(80vw)] bg-red-900 sm:w-[calc(50vw)] md:w-[calc(30vw)]'>
              <div className='flex justify-between'>
                <span>Meeting id:{roomId}</span>
                <div className='flex'>
                  <DraggableHandle>
                    <MoveIcon size={32} />
                  </DraggableHandle>
                  <FullscreenIcon size={32} />
                  <Minimize2Icon size={32} onClick={() => setActive(false)} />
                </div>
              </div>

              {currentConnection && (
                <Meet currentConnection={currentConnection} />
              )}
            </div>
          </Draggable>
        </div>
      )}
    </>
  ) : null;
}
