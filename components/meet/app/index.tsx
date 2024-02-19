'use client';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
// import { useTranslation } from 'react-i18next';
import { createSelector } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import ErrorPage from '../extra-pages/Error';
import Loading from '../extra-pages/Loading';
import Footer from '../footer';
// import Header from '../header';
import MainArea from '../main-area';

import sendAPIRequest from '@/helpers/api/plugNmeetAPI';
import { RootState, store, useAppDispatch, useAppSelector } from '@/store';
import {
  addServerVersion,
  addToken,
  // clearToken,
} from '@/store/slices/sessionSlice';
import StartupJoinModal from './joinModal';
import useLivekitConnect, {
  LivekitInfo,
} from '@/helpers/livekit/hooks/useLivekitConnect';
import AudioNotification from './audioNotification';
import useBodyPix from '../virtual-background/hooks/useBodyPix';
import useKeyboardShortcuts from '@/helpers/hooks/useKeyboardShortcuts';
import useDesignCustomization from '@/helpers/hooks/useDesignCustomization';
import useWatchWindowSize from '@/helpers/hooks/useWatchWindowSize';
import useWatchVisibilityChange from '@/helpers/hooks/useWatchVisibilityChange';
import WaitingRoomPage from '../waiting-room/room-page';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
// import useThemeSettings from '@/helpers/hooks/useThemeSettings';
import {
  VerifyTokenReq,
  VerifyTokenRes,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { IConnectLivekit } from '@/helpers/livekit/types';
import { clearAccessToken, getAccessToken } from '@/helpers/utils';
import { useLocale, useTranslations } from 'next-intl';

import '@/styles/meet/index.scss';
import { getDirectionBasedOnLocale } from '@/helpers/languages';
import type { Locale } from '@/helpers/languages';

// declare const IS_PRODUCTION: boolean;
const waitingForApprovalSelector = createSelector(
  (state: RootState) => state.session.currentUser?.metadata,
  (metadata) => metadata?.wait_for_approval
);
const isStartupSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.isStartup
);
const Meet = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const locale = useLocale();
  document.dir = getDirectionBasedOnLocale(locale as Locale);
  // // make sure we're using correct body dir
  // // document.dir = i18n.dir();

  const toastId = useRef<string>(null);

  const [loading, setLoading] = useState<boolean>(true);
  // // it could be recorder or RTMP bot
  const [isRecorder, setIsRecorder] = useState<boolean>(false);
  const [userTypeClass, setUserTypeClass] = useState('participant');
  const [livekitInfo, setLivekitInfo] = useState<LivekitInfo>();
  const [currentConnection, setCurrentConnection] = useState<IConnectLivekit>();
  const waitForApproval = useAppSelector(waitingForApprovalSelector);

  // // we'll require making ready virtual background
  // // elements as early as possible.
  useBodyPix();
  const isStartup = useAppSelector(isStartupSelector);
  // // some custom hooks
  const {
    error,
    setError,
    roomConnectionStatus,
    setRoomConnectionStatus,
    startLivekitConnection,
  } = useLivekitConnect();

  useKeyboardShortcuts(currentConnection?.room);
  useDesignCustomization();
  useWatchVisibilityChange();
  const { deviceClass, orientationClass, screenHeight } = useWatchWindowSize(
    currentConnection?.room
  );
  // function clearStoreToken() {
  //   dispatch(clearToken());
  // }
  useEffect(() => {
    return () => {
      // dispatch(clearToken());
    };
  });
  // useThemeSettings();

  useEffect(() => {
    const accessToken = getAccessToken();
    console.log(accessToken);
    let timeout: any;
    if (!accessToken) {
      // window.location.href = '/login.html';
      setLoading(false);
      setError({
        title: t('app.token-missing-title'),
        text: t('app.token-missing-des'),
      });
    } else if (
      window.location.protocol === 'http:' &&
      window.location.hostname !== 'localhost'
    ) {
      setLoading(false);
      setError({
        title: t('app.require-ssl-title'),
        text: t('app.require-ssl-des'),
      });
    } else {
      const verifyToken = async () => {
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
          console.log(123, reqObj);
          const r = await sendAPIRequest(
            'verifyToken',
            reqObj.toBinary(),
            false,
            'application/protobuf',
            'arraybuffer'
          );
          res = VerifyTokenRes.fromBinary(new Uint8Array(r));
        } catch (error: any) {
          console.error(error);

          setRoomConnectionStatus('ready');
          setLoading(false);
          setError({
            title: t('app.verification-failed-title'),
            text: t('app.token-not-valid'),
          });
          clearAccessToken();
          return;
        }

        setRoomConnectionStatus('ready');
        setLoading(false);
        if (res.status && res.livekitHost && res.token) {
          // we'll store token that we received from URL
          dispatch(addToken(accessToken));
          dispatch(addServerVersion(res.serverVersion ?? ''));

          // for livekit need to use generated token & host
          setLivekitInfo({
            livekit_host: res.livekitHost,
            token: res.token,
            enabledE2EE: res.enabledE2ee,
          });
        } else {
          setError({
            title: t('app.verification-failed-title'),
            //@ts-ignore
            text: t(res.msg),
          });
        }
      };

      if (!currentConnection) {
        setRoomConnectionStatus('checking');
        timeout = setTimeout(() => {
          verifyToken();
        }, 300);
      }
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [t, dispatch, currentConnection, setError, setRoomConnectionStatus]);

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
    console.log('Meet rendered');
    return () => console.log('Meet unmounted');
  }, []);
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

  const renderMainApp = useCallback(() => {
    if (currentConnection) {
      return (
        <div className='plugNmeet-app flex h-full flex-col justify-between  overflow-hidden'>
          {/* {!isRecorder ? <Header currentRoom={currentConnection.room} /> : null} */}
          <MainArea
            isRecorder={isRecorder}
            currentConnection={currentConnection}
          />
          <Footer
            currentRoom={currentConnection.room}
            isRecorder={isRecorder}
          />
          <AudioNotification />
        </div>
      );
    }
    return null;
  }, [isRecorder, currentConnection]);

  const onCloseStartupModal = async () => {
    if (livekitInfo) {
      const currentConnection = startLivekitConnection(
        livekitInfo,
        //@ts-ignore
        (e: string) => t(e) as string
      );
      setCurrentConnection(currentConnection);
    }
  };

  const renderElms = useMemo(() => {
    if (loading) {
      // @ts-ignore
      return <Loading text={t('app.' + roomConnectionStatus)} />;
    } else if (error && !loading) {
      return <ErrorPage title={error.title} text={error.text} />;
    } else if (
      roomConnectionStatus === 'connected' ||
      roomConnectionStatus === 're-connecting'
    ) {
      if (waitForApproval) {
        return <WaitingRoomPage />;
      }
      return renderMainApp();
    } else if (roomConnectionStatus === 'ready') {
      return <StartupJoinModal onCloseModal={onCloseStartupModal} />;
    } else {
      return null;
    }
    //eslint-disable-next-line
  }, [loading, error, roomConnectionStatus, waitForApproval, renderMainApp]);
  console.log('[Status]', roomConnectionStatus, isStartup);
  return (
    <div
      className={`${orientationClass} ${deviceClass} ${userTypeClass} h-[calc(100vh-80px)] dark:bg-darkPrimary/70`}
      // style={{ height: screenHeight }}
    >
      {renderElms}
    </div>
  );
};

export default Meet;