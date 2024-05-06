import { Room, Track } from 'livekit-client';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppStore } from '@/store/hook';
import {
  updateIsActiveChatPanel,
  updateIsActiveMicrophone,
  updateIsActiveParticipantsPanel,
  updateIsActiveRaisehand,
  updateIsActiveWebcam,
  updateIsActiveWhiteboard,
  updateIsMicMuted,
  updateShowLockSettingsModal,
  updateShowMicrophoneModal,
  updateShowVideoShareModal,
  updateVirtualBackground,
} from '@/store/slices/bottomIconsActivitySlice';
import {
  updateSelectedAudioDevice,
  updateSelectedVideoDevice,
  updateShowRoomSettingsModal,
} from '@/store/slices/roomSettingsSlice';
import { SystemMsgType } from '@/store/slices/interfaces/dataMessages';
import sendAPIRequest from '../api/paxMeetAPI';
import {
  CommonResponse,
  DataMessageReq,
} from '../proto/plugnmeet_common_api_pb';
import { DataMsgBodyType } from '../proto/plugnmeet_datamessage_pb';
import { useTranslations } from 'next-intl';

const useKeyboardShortcuts = (currentRoom?: Room) => {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  // muteUnmute start (ctrl+option+m)
  const muteUnmute = (currentRoom: Room) => {
    if (currentRoom) {
      currentRoom.localParticipant.audioTrackPublications.forEach(async (publication) => {
        if (
          publication.track &&
          publication.track.source === Track.Source.Microphone
        ) {
          if (publication.isMuted) {
            await publication.track.unmute();
            dispatch(updateIsMicMuted(false));
          } else {
            await publication.track.mute();
            dispatch(updateIsMicMuted(true));
          }
        }
      });
    }
  };

  useHotkeys(
    'ctrl+alt+m',
    () => {
      if (currentRoom) {
        muteUnmute(currentRoom);
      }
    },
    [currentRoom]
  );
  // muteUnmute end (ctrl+option+m)

  // start audio (ctrl+alt+a)
  useHotkeys('ctrl+alt+a', () => {
    const bottomIconsActivity = store.getState().bottomIconsActivity;
    if (
      !bottomIconsActivity.isActiveMicrophone &&
      !bottomIconsActivity.showMicrophoneModal
    ) {
      dispatch(updateShowMicrophoneModal(true));
    }
  });

  // leaveMic start (ctrl+alt+o)
  const leaveMic = (currentRoom: Room) => {
    currentRoom.localParticipant.audioTrackPublications.forEach(async (publication) => {
      if (publication.track && publication.kind === Track.Kind.Audio) {
        currentRoom.localParticipant.unpublishTrack(publication.track, true);
      }
    });
    dispatch(updateIsActiveMicrophone(false));
    dispatch(updateIsMicMuted(false));
    dispatch(updateSelectedAudioDevice(''));
  };

  useHotkeys(
    'ctrl+alt+o',
    () => {
      if (currentRoom) {
        leaveMic(currentRoom);
      }
    },
    [currentRoom]
  );
  // leaveMic end (ctrl+alt+o)

  // start video (ctrl+alt+v)
  useHotkeys('ctrl+alt+v', () => {
    const bottomIconsActivity = store.getState().bottomIconsActivity;
    if (
      !bottomIconsActivity.isActiveWebcam &&
      !bottomIconsActivity.showVideoShareModal
    ) {
      dispatch(updateShowVideoShareModal(true));
    }
  });

  // start close video (ctrl+alt+x)
  const leaveWebcam = (currentRoom: Room) => {
    currentRoom.localParticipant.videoTrackPublications.forEach(async (publication) => {
      if (
        publication.track &&
        publication.track.source === Track.Source.Camera
      ) {
        currentRoom.localParticipant.unpublishTrack(publication.track, true);
      }
    });
    dispatch(updateIsActiveWebcam(false));
    dispatch(updateSelectedVideoDevice(''));
    dispatch(
      updateVirtualBackground({
        type: 'none',
      })
    );
  };

  useHotkeys(
    'ctrl+alt+x',
    () => {
      if (currentRoom) {
        const isActiveWebcam =
          store.getState().bottomIconsActivity.isActiveWebcam;
        if (isActiveWebcam) {
          leaveWebcam(currentRoom);
        }
      }
    },
    [currentRoom]
  );
  // close video (ctrl+alt+x) end

  // toggle users' list (ctrl+alt+u)
  useHotkeys('ctrl+alt+u', () => {
    const isActiveParticipantsPanel =
      store.getState().bottomIconsActivity.isActiveParticipantsPanel;
    dispatch(updateIsActiveParticipantsPanel(!isActiveParticipantsPanel));
  });

  // toggle chat (ctrl+alt+c)
  useHotkeys('ctrl+alt+c', () => {
    const isActiveChatPanel =
      store.getState().bottomIconsActivity.isActiveChatPanel;
    dispatch(updateIsActiveChatPanel(!isActiveChatPanel));
  });

  // toggle locks options (ctrl+alt+l)
  useHotkeys('ctrl+alt+l', () => {
    const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;
    if (!isAdmin) {
      return;
    }
    const showLockSettingsModal =
      store.getState().bottomIconsActivity.showLockSettingsModal;
    dispatch(updateShowLockSettingsModal(!showLockSettingsModal));
  });

  // toggle settings (ctrl+alt+s)
  useHotkeys('ctrl+alt+s', () => {
    const isShowRoomSettingsModal =
      store.getState().roomSettings.isShowRoomSettingsModal;
    dispatch(updateShowRoomSettingsModal(!isShowRoomSettingsModal));
  });

  // toggle whiteboard (ctrl+alt+w)
  useHotkeys('ctrl+alt+w', () => {
    const isActiveWhiteboard =
      store.getState().bottomIconsActivity.isActiveWhiteboard;
    dispatch(updateIsActiveWhiteboard(!isActiveWhiteboard));
  });

  // toggle raise hand (ctrl+alt+r) start
  const toggleRaiseHand = async (
    isActiveRaisehand: boolean,
    currentRoom: Room
  ) => {
    let sid = await currentRoom.getSid();
    if (!isActiveRaisehand) {
      const body = new DataMessageReq({
        roomSid: sid,
        roomId: currentRoom.name,
        msgBodyType: DataMsgBodyType.RAISE_HAND,
        msg: t('footer.notice.has-raised-hand', {
          user: currentRoom.localParticipant.name,
        }).toString(),
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
        dispatch(updateIsActiveRaisehand(true));

        toast(t('footer.notice.you-raised-hand'), {
          type: 'info',
        });
      } else {
        toast(res.msg, {
          type: 'error',
        });
      }
    } else {
      const body = new DataMessageReq({
        roomSid: sid,
        roomId: currentRoom.name,
        msgBodyType: DataMsgBodyType.LOWER_HAND,
        msg: SystemMsgType.LOWER_HAND,
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
        toast(res.msg, {
          type: 'error',
        });
      }
    }
  };

  useHotkeys(
    'ctrl+alt+r',
    async () => {
      if (currentRoom) {
        const isActiveRaisehand =
          store.getState().bottomIconsActivity.isActiveRaisehand;
        await toggleRaiseHand(isActiveRaisehand, currentRoom);
      }
    },
    [currentRoom]
  );
  // toggle raise hand (ctrl+alt+r) end
};

export default useKeyboardShortcuts;
