import React, { useEffect, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Room } from 'livekit-client';

import { RootState, store } from '@/store';
import { useAppSelector } from '@/store/hook';
import { IRoomMetadata } from '@/store/slices/interfaces/session';
import RecordingModal from './recording/recordingModal';
import { RecordingEvent, RecordingType } from './recording/IRecording';
import useLocalRecording from './recording/useLocalRecording';
import useCloudRecording from './recording/useCloudRecording';
import { useTranslations } from 'next-intl';

interface IRecordingIconProps {
  currentRoom: Room;
}

const isRecordingSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.isActiveRecording
);
const RecordingIcon = ({ currentRoom }: IRecordingIconProps) => {
  const showTooltip = store.getState().session.userDeviceType === 'desktop';

  const {
    hasError: localRecordingError,
    recordingEvent: localRecordingEvent,
    startRecording: startLocalRecording,
    stopRecording: stopLocalRecording,
    resetError: resetLocalRecordingError,
  } = useLocalRecording(currentRoom.localParticipant, currentRoom.name);

  const {
    hasError: hasCloudRecordingError,
    resetError: resetCloudRecordingError,
    startRecording: startCloudRecording,
    stopRecording: stopCloudRecording,
  } = useCloudRecording(currentRoom);

  const t = useTranslations('meet');
  const roomMetadata = store.getState().session.currentRoom
    .metadata as IRoomMetadata;
  const isAllowRecording =
    roomMetadata.room_features.recording_features.is_allow;
  const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;
  const isPresenter =
    store.getState().session.currentUser?.metadata?.is_presenter;

  const isRunningCloudRecording = useAppSelector(isRecordingSelector);
  const [disable, setDisable] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [allowRecording, setAllowRecording] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingType, setRecordingType] = useState<RecordingType>(
    RecordingType.RECORDING_TYPE_NONE
  );
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [checkedAutoRecording, setCheckedAutoRecording] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      isRunningCloudRecording &&
      recordingType !== RecordingType.RECORDING_TYPE_CLOUD
    ) {
      if (recordingType === RecordingType.RECORDING_TYPE_LOCAL && isRecording) {
        stopLocalRecording();
      }

      setRecordingType(RecordingType.RECORDING_TYPE_CLOUD);
      clearTimeout(timer);
      setDisable(false);
      setIsRecording(true);
    } else if (
      isRunningCloudRecording &&
      recordingType === RecordingType.RECORDING_TYPE_CLOUD &&
      !isRecording
    ) {
      clearTimeout(timer);
      setDisable(false);
      setIsRecording(true);
    } else if (
      !isRunningCloudRecording &&
      recordingType === RecordingType.RECORDING_TYPE_CLOUD &&
      isRecording
    ) {
      clearTimeout(timer);
      setDisable(false);
      setIsRecording(false);
      setRecordingType(RecordingType.RECORDING_TYPE_NONE);
    }
    //eslint-disable-next-line
  }, [isRunningCloudRecording, recordingType, isRecording, timer]);

  useEffect(() => {
    if (!isAllowRecording) {
      setAllowRecording(false);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  useEffect(() => {
    if (localRecordingEvent === RecordingEvent.STARTED_RECORDING) {
      setDisable(false);
      setIsRecording(true);
    } else if (localRecordingEvent === RecordingEvent.STOPPED_RECORDING) {
      setDisable(false);
      setIsRecording(false);
    }
  }, [localRecordingEvent]);

  useEffect(() => {
    const reset = () => {
      setDisable(false);
      setIsRecording(false);
      if (timer) {
        clearTimeout(timer);
      }
    };

    if (hasCloudRecordingError) {
      reset();
      resetCloudRecordingError();
    }
    if (localRecordingError) {
      reset();
      resetLocalRecordingError();
    }
    //eslint-disable-next-line
  }, [hasCloudRecordingError, localRecordingError]);

  const onClickRecordingBtn = async () => {
    if (!isRecording) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
      setDisable(true);

      if (recordingType === RecordingType.RECORDING_TYPE_LOCAL) {
        stopLocalRecording();
      } else if (recordingType === RecordingType.RECORDING_TYPE_CLOUD) {
        await stopCloudRecording();

        const timer = setTimeout(() => {
          setDisable(false);
          toast(t('footer.notice.recording-did-not-stop'), {
            toastId: 'recording-status',
            type: 'error',
          });
        }, 30000);
        setTimer(timer);
      }
    }
  };

  const startRecording = async (recordingType: RecordingType) => {
    if (recordingType === RecordingType.RECORDING_TYPE_LOCAL) {
      setDisable(true);
      setRecordingType(recordingType);
      startLocalRecording();
    } else if (recordingType === RecordingType.RECORDING_TYPE_CLOUD) {
      setDisable(true);
      setRecordingType(recordingType);
      await startCloudRecording();

      const timer = setTimeout(() => {
        setDisable(false);
        toast(t('footer.notice.recording-not-start'), {
          toastId: 'recording-status',
          type: 'error',
        });
      }, 30000);
      setTimer(timer);
    }
  };

  const onCloseModal = async (recordingType: RecordingType) => {
    setOpenModal(false);
    startRecording(recordingType);
  };

  // for auto cloud recording
  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined;
    if (
      isAllowRecording &&
      isAdmin &&
      isPresenter &&
      !isRunningCloudRecording &&
      !checkedAutoRecording &&
      roomMetadata.room_features.recording_features.enable_auto_cloud_recording
    ) {
      timeout = setTimeout(async () => {
        await startRecording(RecordingType.RECORDING_TYPE_CLOUD);
      }, 1000);
    }
    setCheckedAutoRecording(true);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
    //eslint-disable-next-line
  }, [isRunningCloudRecording]);

  const render = () => {
    return (
      <>
        {openModal ? (
          <RecordingModal
            showModal={openModal}
            recordingFeatures={roomMetadata.room_features.recording_features}
            onCloseModal={(recordingType) => onCloseModal(recordingType)}
          />
        ) : null}
        <button
          className={`${
            isRecording ? 'record' : ''
          } footer-icon flex h-[35px] w-[35px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] dark:bg-darkSecondary2 lg:h-[40px] lg:w-[40px] ltr:mr-3 lg:ltr:mr-6 rtl:ml-3 lg:rtl:ml-6 ${
            showTooltip ? 'has-tooltip' : ''
          }`}
          onClick={() => onClickRecordingBtn()}
          disabled={disable}
        >
          <span className='tooltip !bottom-[62px]'>
            {isRecording
              ? t('footer.icons.stop-recording')
              : t('footer.icons.start-recording')}
          </span>
          <i className="pnm-rec primaryColor font-['Nunito Sans'] text-[11px] font-bold dark:text-darkText lg:text-[12px]" />
        </button>
      </>
    );
  };

  return <>{allowRecording && isAdmin ? render() : null}</>;
};

export default RecordingIcon;
