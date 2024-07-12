import React, { useEffect, useRef, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { createLocalVideoTrack, Room, Track } from 'livekit-client';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import {
  updateIsActiveWebcam,
  updateShowVideoShareModal,
  updateVirtualBackground,
} from '@/store/slices/bottomIconsActivitySlice';
import ShareWebcamModal from '../modals/webcam/shareWebcam';
import WebcamMenu from './webcam-menu';
import { participantsSelector } from '@/store/slices/participantSlice';
import { updateSelectedVideoDevice } from '@/store/slices/roomSettingsSlice';
import VirtualBackground from '../../virtual-background/virtualBackground';
import { SourcePlayback } from '../../virtual-background/helpers/sourceHelper';
import { getWebcamResolution } from '@/helpers/utils';
import { useTranslations } from 'next-intl';

interface IWebcamIconProps {
  currentRoom: Room;
}

const isActiveWebcamPanelSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.isActiveWebcam
);
const showVideoShareModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showVideoShareModal
);
const isWebcamLockSelector = createSelector(
  (state: RootState) => state.session.currentUser?.metadata?.lock_settings,
  (lock_settings) => lock_settings?.lock_webcam
);
const virtualBackgroundSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.virtualBackground
);
const selectedVideoDeviceSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.selectedVideoDevice
);

const WebcamIcon = ({ currentRoom }: IWebcamIconProps) => {
  const dispatch = useAppDispatch();
  const showTooltip = store.getState().session.userDeviceType === 'desktop';

  const showVideoShareModal = useAppSelector(showVideoShareModalSelector);
  const isActiveWebcam = useAppSelector(isActiveWebcamPanelSelector);
  const isWebcamLock = useAppSelector(isWebcamLockSelector);
  const virtualBackground = useAppSelector(virtualBackgroundSelector);
  const selectedVideoDevice = useAppSelector(selectedVideoDeviceSelector);
  const t = useTranslations('meet');

  const [lockWebcam, setLockWebcam] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>();
  const [sourcePlayback, setSourcePlayback] = useState<SourcePlayback>();
  const [virtualBgLocalTrack, setVirtualBgLocalTrack] = useState<MediaStream>();
  const virtualBgVideoPlayer = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const closeMicOnLock = async () => {
      for (const [
        ,
        publication,
      ] of currentRoom?.localParticipant.videoTrackPublications.entries()) {
        if (publication.track && publication.source === Track.Source.Camera) {
          await currentRoom.localParticipant.unpublishTrack(
            publication.track,
            true
          );
        }
      }
      dispatch(updateIsActiveWebcam(false));
    };

    if (isWebcamLock) {
      setLockWebcam(true);
      const currentUser = participantsSelector.selectById(
        store.getState(),
        currentRoom.localParticipant.identity
      );
      if (currentUser?.videoTracks) {
        closeMicOnLock();
      }
    } else {
      setLockWebcam(false);
    }
  }, [isWebcamLock, currentRoom, dispatch]);

  useEffect(() => {
    const isLock =
      store.getState().session.currentRoom.metadata?.default_lock_settings
        ?.lock_webcam;
    const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;

    if (isLock && !isAdmin) {
      if (isWebcamLock !== false) {
        setLockWebcam(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isActiveWebcam && virtualBgLocalTrack && !selectedVideoDevice) {
      virtualBgLocalTrack.getTracks().forEach((t) => t.stop());
    }
    if (!isActiveWebcam && !selectedVideoDevice && deviceId) {
      setDeviceId(undefined);
    }
  }, [selectedVideoDevice]);

  useEffect(() => {
    if (!selectedVideoDevice || !deviceId) {
      return;
    }
    if (selectedVideoDevice === deviceId) {
      return;
    }

    const changeDevice = async (deviceId: string) => {
      await currentRoom.switchActiveDevice('videoinput', deviceId);
    };
    const changeDeviceWithVB = async (deviceId: string) => {
      await createDeviceStream(deviceId);
    };

    if (virtualBackground.type === 'none') {
      changeDevice(selectedVideoDevice);
    } else {
      changeDeviceWithVB(selectedVideoDevice);
    }

    setDeviceId(selectedVideoDevice);
  }, [selectedVideoDevice]);

  useEffect(() => {
    if (virtualBgLocalTrack && virtualBgVideoPlayer) {
      const el = virtualBgVideoPlayer.current;
      if (el) {
        el.srcObject = virtualBgLocalTrack;
      }
    }
    return () => {
      if (virtualBgLocalTrack) {
        virtualBgLocalTrack.getTracks().forEach((t) => t.stop());
      }
    };
  }, [virtualBgLocalTrack]);

  const handleVirtualBgVideoOnLoad = () => {
    const el = virtualBgVideoPlayer.current;
    if (el) {
      setSourcePlayback({
        htmlElement: el,
        width: el.videoWidth ?? 320,
        height: el.videoHeight ?? 180,
      });
    }
  };

  const toggleWebcam = async () => {
    if (lockWebcam) {
      return;
    }

    if (!isActiveWebcam) {
      dispatch(updateShowVideoShareModal(!isActiveWebcam));
    } else if (isActiveWebcam) {
      for (const [
        ,
        publication,
      ] of currentRoom.localParticipant.videoTrackPublications.entries()) {
        if (
          publication.track &&
          publication.track.source === Track.Source.Camera
        ) {
          await currentRoom.localParticipant.unpublishTrack(
            publication.track,
            true
          );
        }
      }
      dispatch(updateIsActiveWebcam(false));
      dispatch(updateSelectedVideoDevice(''));
      dispatch(
        updateVirtualBackground({
          type: 'none',
        })
      );
    }
  };

  const createDeviceStream = async (deviceId: string) => {
    if (virtualBackground.type === 'none') {
      const resolution = getWebcamResolution();
      const track = await createLocalVideoTrack({
        deviceId: {
          exact: deviceId,
          ideal: deviceId,
        },
        resolution,
      });

      await currentRoom.localParticipant.publishTrack(track);
      dispatch(updateIsActiveWebcam(true));
    } else {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: {
            exact: deviceId,
            ideal: deviceId,
          },
        },
      };
      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      setVirtualBgLocalTrack(mediaStream);
    }
    return;
  };

  const onSelectedDevice = async (deviceId: string) => {
    setDeviceId(deviceId);
    await createDeviceStream(deviceId);
    dispatch(updateSelectedVideoDevice(deviceId));
  };

  const onCanvasRef = (
    canvasRef: React.MutableRefObject<HTMLCanvasElement>
  ) => {
    const stream = canvasRef.current.captureStream(25);
    stream.getTracks().forEach(async (track) => {
      if (track.kind === Track.Kind.Video) {
        await currentRoom.localParticipant.publishTrack(track, {
          source: Track.Source.Camera,
          name: 'canvas',
        });
        dispatch(updateIsActiveWebcam(true));
      }
    });
  };

  const shouldShow = () => {
    const session = store.getState().session;
    const room_features = session.currentRoom.metadata?.room_features;
    const currentUser = session.currentUser;

    if (!room_features?.allow_webcams) {
      return false;
    } else if (
      room_features?.admin_only_webcams &&
      !currentUser?.metadata?.is_admin
    ) {
      return false;
    }

    return true;
  };

  const getTooltipText = () => {
    if (!isActiveWebcam && !isWebcamLock) {
      return t('footer.icons.start-webcam');
    } else if (!isActiveWebcam && isWebcamLock) {
      return t('footer.icons.webcam-locked');
    } else if (isActiveWebcam) {
      return t('footer.icons.leave-webcam');
    }
  };

  const showButtons = () => {
    return (
      <div className='relative z-10'>
        <div
          className={`camera footer-icon relative flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] dark:bg-darkSecondary2 lg:h-[40px] lg:w-[40px] ltr:mr-3 lg:ltr:mr-6 rtl:ml-3 lg:rtl:ml-6 ${
            showTooltip ? 'has-tooltip' : ''
          }`}
          onClick={() => toggleWebcam()}
        >
          <span className='tooltip tooltip-left !-left-3'>
            {getTooltipText()}
          </span>

          {!isActiveWebcam ? (
            <i className='pnm-webcam primaryColor text-[12px] dark:text-darkText lg:text-[14px]' />
          ) : null}
          {lockWebcam ? (
            <div className='arrow-down absolute -bottom-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-white dark:bg-darkSecondary3'>
              <i className='pnm-lock primaryColor' />
            </div>
          ) : null}

          {isActiveWebcam ? (
            <i className='pnm-webcam secondaryColor text-[12px] lg:text-[14px]' />
          ) : null}
        </div>

        {isActiveWebcam ? <WebcamMenu currentRoom={currentRoom} /> : null}
      </div>
    );
  };

  const render = () => {
    return (
      <>
        {showButtons()}

        {showVideoShareModal ? (
          <ShareWebcamModal
            onSelectedDevice={onSelectedDevice}
            isOpen={showVideoShareModal}
            onClose={() => dispatch(updateShowVideoShareModal(false))}
          />
        ) : null}

        {sourcePlayback && deviceId && virtualBackground.type !== 'none' ? (
          <div style={{ display: 'none' }}>
            <VirtualBackground
              sourcePlayback={sourcePlayback}
              id={deviceId}
              backgroundConfig={virtualBackground}
              onCanvasRef={onCanvasRef}
            />
          </div>
        ) : null}
        {virtualBgLocalTrack ? (
          <div style={{ display: 'none' }}>
            <video
              ref={virtualBgVideoPlayer}
              autoPlay
              onLoadedData={handleVirtualBgVideoOnLoad}
            />
          </div>
        ) : null}
      </>
    );
  };

  return <>{shouldShow() ? render() : null}</>;
};

export default WebcamIcon;
