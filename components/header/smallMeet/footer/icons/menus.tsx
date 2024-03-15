import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { createSelector } from '@reduxjs/toolkit';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import LockSettingsModal from '../modals/lockSettingsModal';
import {
  updateDisplayExternalLinkRoomModal,
  updateDisplaySpeechSettingsModal,
  updateIsActiveSharedNotePad,
  updateShowExternalMediaPlayerModal,
  updateShowLockSettingsModal,
  updateShowManageBreakoutRoomModal,
  updateShowManageWaitingRoomModal,
  updateShowRtmpModal,
} from '@/store/slices/bottomIconsActivitySlice';
import RtmpModal from '../modals/rtmpModal';
import ExternalMediaPlayerModal from '../modals/externalMediaPlayer';
import ManageWaitingRoom from '../../waiting-room';
import BreakoutRoom from '../../breakout-room';
import DisplayExternalLinkModal from '../modals/displayExternalLinkModal';
import {
  ChangeEtherpadStatusReq,
  CommonResponse,
  CreateEtherpadSessionRes,
  ExternalDisplayLinkReq,
  ExternalDisplayLinkTask,
  ExternalMediaPlayerReq,
  ExternalMediaPlayerTask,
  MuteUnMuteTrackReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import SpeechServiceSettingsModal from '../../speech-to-text-service/speech-service-settings-modal';
import { useTranslations } from 'next-intl';

const showLockSettingsModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showLockSettingsModal
);
const isActiveRtmpBroadcastingSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.isActiveRtmpBroadcasting
);
const showRtmpModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showRtmpModal
);
const sharedNotepadStatusSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features.shared_note_pad_features,
  (shared_note_pad_features) => shared_note_pad_features?.is_active
);
const isActiveExternalMediaPlayerSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features
      .external_media_player_features,
  (external_media_player_features) => external_media_player_features?.is_active
);
const showExternalMediaPlayerModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showExternalMediaPlayerModal
);
const showManageWaitingRoomModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showManageWaitingRoomModal
);
const showManageBreakoutRoomModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showManageBreakoutRoomModal
);
const isActiveDisplayExternalLinkSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features
      .display_external_link_features,
  (display_external_link_features) => display_external_link_features?.is_active
);
const showDisplayExternalLinkModalModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showDisplayExternalLinkModal
);
const showSpeechSettingsModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showSpeechSettingsModal
);

const MenusIcon = () => {
  const session = store.getState().session;
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const showLockSettingsModal = useAppSelector(showLockSettingsModalSelector);
  const sharedNotepadStatus = useAppSelector(sharedNotepadStatusSelector);
  const showRtmpModal = useAppSelector(showRtmpModalSelector);
  const isActiveRtmpBroadcasting = useAppSelector(
    isActiveRtmpBroadcastingSelector
  );
  const isActiveExternalMediaPlayer = useAppSelector(
    isActiveExternalMediaPlayerSelector
  );
  const showExternalMediaPlayerModal = useAppSelector(
    showExternalMediaPlayerModalSelector
  );
  const showManageWaitingRoomModal = useAppSelector(
    showManageWaitingRoomModalSelector
  );
  const showManageBreakoutRoomModal = useAppSelector(
    showManageBreakoutRoomModalSelector
  );
  const isActiveDisplayExternalLink = useAppSelector(
    isActiveDisplayExternalLinkSelector
  );
  const showDisplayExternalLinkModal = useAppSelector(
    showDisplayExternalLinkModalModalSelector
  );
  const showSpeechSettingsModal = useAppSelector(
    showSpeechSettingsModalSelector
  );
  const roomFeatures =
    store.getState().session.currentRoom?.metadata?.room_features;

  const muteAllUsers = async () => {
    const body = new MuteUnMuteTrackReq({
      sid: session.currentRoom.sid,
      roomId: session.currentRoom.room_id,
      userId: 'all',
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
      toast(t('footer.notice.muted-all-microphone'), {
        toastId: 'asked-status',
        type: 'info',
      });
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        toastId: 'asked-status',
        type: 'error',
      });
    }
  };

  const toggleSharedNotepad = async () => {
    const host =
      store.getState().session.currentRoom.metadata?.room_features
        .shared_note_pad_features.host;

    if (!host && !sharedNotepadStatus) {
      const r = await sendAPIRequest(
        'etherpad/create',
        {},
        false,
        'application/protobuf',
        'arraybuffer'
      );
      const res = CreateEtherpadSessionRes.fromBinary(new Uint8Array(r));
      if (res.status) {
        dispatch(updateIsActiveSharedNotePad(true));
      } else {
        // @ts-ignore
        toast(t(res.msg), {
          type: 'error',
        });
      }
    } else if (host && !sharedNotepadStatus) {
      const body = new ChangeEtherpadStatusReq({
        roomId: store.getState().session.currentRoom.room_id,
        isActive: true,
      });
      const r = await sendAPIRequest(
        'etherpad/changeStatus',
        body.toBinary(),
        false,
        'application/protobuf',
        'arraybuffer'
      );
      const res = CreateEtherpadSessionRes.fromBinary(new Uint8Array(r));
      if (res.status) {
        dispatch(updateIsActiveSharedNotePad(true));
      } else {
        // @ts-ignore
        toast(t(res.msg), {
          type: 'error',
        });
      }
    } else if (host && sharedNotepadStatus) {
      const body = new ChangeEtherpadStatusReq({
        roomId: store.getState().session.currentRoom.room_id,
        isActive: false,
      });
      const r = await sendAPIRequest(
        'etherpad/changeStatus',
        body.toBinary(),
        false,
        'application/protobuf',
        'arraybuffer'
      );
      const res = CreateEtherpadSessionRes.fromBinary(new Uint8Array(r));
      if (res.status) {
        dispatch(updateIsActiveSharedNotePad(false));
      } else {
        // @ts-ignore
        toast(t(res.msg), {
          type: 'error',
        });
      }
    }
  };

  const toggleExternalMediaPlayer = async () => {
    if (!isActiveExternalMediaPlayer) {
      if (isActiveDisplayExternalLink) {
        toast(t('notifications.need-to-disable-display-external-link'), {
          type: 'error',
        });
      } else {
        dispatch(updateShowExternalMediaPlayerModal(true));
      }
      return;
    }

    const id = toast.loading(t('please-wait'), {
      type: 'info',
    });

    const body = new ExternalMediaPlayerReq({
      task: ExternalMediaPlayerTask.END_PLAYBACK,
    });
    const r = await sendAPIRequest(
      'externalMediaPlayer',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (!res.status) {
      toast.update(id, {
        // @ts-ignore
        render: t(res.msg),
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.dismiss(id);
    }
  };

  const toggleDisplayExternalLinkModal = async () => {
    if (!isActiveDisplayExternalLink) {
      if (isActiveExternalMediaPlayer) {
        toast(t('notifications.need-to-disable-external-media-player'), {
          type: 'error',
        });
      } else {
        dispatch(updateDisplayExternalLinkRoomModal(true));
      }
      return;
    }
    const body = new ExternalDisplayLinkReq({
      task: ExternalDisplayLinkTask.STOP_EXTERNAL_LINK,
    });

    const id = toast.loading(t('please-wait'), {
      type: 'info',
    });

    const r = await sendAPIRequest(
      'externalDisplayLink',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (!res.status) {
      toast.update(id, {
        // @ts-ignore
        render: t(res.msg),
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.dismiss(id);
    }
  };

  const openLockSettingsModal = () => {
    dispatch(updateShowLockSettingsModal(true));
  };

  const openRtmpModal = () => {
    dispatch(updateShowRtmpModal(true));
  };

  const openManageWaitingRoomModal = () => {
    dispatch(updateShowManageWaitingRoomModal(true));
  };

  const openSpeechServiceSettingsModal = () => {
    dispatch(updateDisplaySpeechSettingsModal(true));
  };

  const openManageBreakoutRoomModal = () => {
    dispatch(updateShowManageBreakoutRoomModal(true));
  };

  const render = () => {
    return (
      <div className='menu relative'>
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button className='footer-icon flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] dark:bg-darkSecondary2 lg:h-[40px] lg:w-[40px]'>
                <i className='pnm-menu-horizontal primaryColor text-[5px] dark:text-darkText lg:text-[5px]' />
              </Menu.Button>

              {/* Use the Transition component. */}
              <Transition
                show={open}
                enter='transition duration-100 ease-out'
                enterFrom='transform scale-95 opacity-0'
                enterTo='transform scale-100 opacity-100'
                leave='transition duration-75 ease-out'
                leaveFrom='transform scale-100 opacity-100'
                leaveTo='transform scale-95 opacity-0'
              >
                {/* Mark this component as `static` */}
                <Menu.Items
                  static
                  className='absolute bottom-[48px] right-0 z-[9999] mt-2 w-60 origin-bottom-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-secondaryColor dark:bg-darkPrimary dark:ring-secondaryColor sm:-left-20 sm:right-auto lg:-left-28 lg:w-72'
                >
                  {roomFeatures?.allow_rtmp ? (
                    <div className='py-1' role='none'>
                      <Menu.Item>
                        <button
                          className='footer-podcast-button group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                          onClick={() => openRtmpModal()}
                        >
                          {isActiveRtmpBroadcasting ? (
                            <div className='lds-ripple'>
                              <div className='border-secondaryColor'></div>
                              <div className='border-secondaryColor'></div>
                            </div>
                          ) : null}
                          <i className='pnm-broadcasting text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                          {isActiveRtmpBroadcasting
                            ? t('footer.icons.stop-rtmp-broadcasting')
                            : t('footer.icons.start-rtmp-broadcasting')}
                        </button>
                      </Menu.Item>
                    </div>
                  ) : null}
                  <div className='py-1' role='none'>
                    <Menu.Item>
                      <button
                        className='group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                        onClick={() => muteAllUsers()}
                      >
                        <i className='pnm-mic-mute text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                        {t('footer.menus.mute-all-users')}
                      </button>
                    </Menu.Item>
                  </div>
                  {roomFeatures?.shared_note_pad_features
                    .allowed_shared_note_pad ? (
                    <div className='py-1' role='none'>
                      <Menu.Item>
                        <button
                          className='group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                          onClick={() => toggleSharedNotepad()}
                        >
                          <i className='pnm-notepad text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                          {sharedNotepadStatus
                            ? t('footer.menus.disable-shared-notepad')
                            : t('footer.menus.enable-shared-notepad')}
                        </button>
                      </Menu.Item>
                    </div>
                  ) : null}
                  {roomFeatures?.external_media_player_features
                    .allowed_external_media_player ? (
                    <div className='py-1' role='none'>
                      <Menu.Item>
                        <button
                          className='group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                          onClick={() => toggleExternalMediaPlayer()}
                        >
                          <i className='pnm-file-play text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                          {isActiveExternalMediaPlayer
                            ? t('footer.menus.stop-external-media-player')
                            : t('footer.menus.start-external-media-player')}
                        </button>
                      </Menu.Item>
                    </div>
                  ) : null}
                  {roomFeatures?.display_external_link_features.is_allow ? (
                    <div className='py-1' role='none'>
                      <Menu.Item>
                        <button
                          className='group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                          onClick={() => toggleDisplayExternalLinkModal()}
                        >
                          <i className='pnm-display text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                          {isActiveDisplayExternalLink
                            ? t('footer.menus.stop-display-external-link')
                            : t('footer.menus.start-display-external-link')}
                        </button>
                      </Menu.Item>
                    </div>
                  ) : null}
                  {roomFeatures?.waiting_room_features.is_active ? (
                    <div className='py-1' role='none'>
                      <Menu.Item>
                        <button
                          className='group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                          onClick={() => openManageWaitingRoomModal()}
                        >
                          <i className='pnm-waiting-room text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                          {t('footer.menus.manage-waiting-room')}
                        </button>
                      </Menu.Item>
                    </div>
                  ) : null}
                  {roomFeatures?.speech_to_text_translation_features
                    .is_allow ? (
                    <div className='py-1' role='none'>
                      <Menu.Item>
                        <button
                          className='group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                          onClick={() => openSpeechServiceSettingsModal()}
                        >
                          <i className='pnm-closed-captioning text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                          {t('footer.menus.speech-to-text-settings')}
                        </button>
                      </Menu.Item>
                    </div>
                  ) : null}
                  {roomFeatures?.breakout_room_features.is_allow ? (
                    <div className='py-1' role='none'>
                      <Menu.Item>
                        <button
                          className='group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                          onClick={() => openManageBreakoutRoomModal()}
                        >
                          <i className='pnm-breakout-room text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                          {t('footer.menus.manage-breakout-room')}
                        </button>
                      </Menu.Item>
                    </div>
                  ) : null}
                  <div className='py-1' role='none'>
                    <Menu.Item>
                      <button
                        className='group flex w-full items-center rounded px-4 py-1 text-xs text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText hover:dark:text-secondaryColor lg:py-2 lg:text-sm ltr:text-left rtl:text-right'
                        onClick={() => openLockSettingsModal()}
                      >
                        <i className='pnm-lock text-primaryColor transition ease-in group-hover:text-secondaryColor ltr:mr-2 rtl:ml-2' />
                        {t('footer.menus.room-lock-settings')}
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    );
  };

  return (
    <>
      {render()}
      {showLockSettingsModal ? <LockSettingsModal /> : null}
      {showRtmpModal ? <RtmpModal /> : null}
      {showExternalMediaPlayerModal ? <ExternalMediaPlayerModal /> : null}
      {showManageWaitingRoomModal ? <ManageWaitingRoom /> : null}
      {showManageBreakoutRoomModal ? <BreakoutRoom /> : null}
      {showDisplayExternalLinkModal ? <DisplayExternalLinkModal /> : null}
      {showSpeechSettingsModal ? <SpeechServiceSettingsModal /> : null}
    </>
  );
};

export default MenusIcon;
