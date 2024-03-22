import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Room } from 'livekit-client';
import { createSelector } from '@reduxjs/toolkit';

import { RootState, store } from '@/store';
import { useAppSelector } from '@/store/hook';
import {
  isSocketConnected,
  sendAnalyticsByWebsocket,
  sendWebsocketMessage,
} from '@/helpers/websocket';
import useResumableFilesUpload from '@/helpers/hooks/useResumableFilesUpload';
import {
  DataMessage,
  DataMsgBodyType,
  DataMsgType,
} from '@/helpers/proto/plugnmeet_datamessage_pb';
import {
  AnalyticsEvents,
  AnalyticsEventType,
} from '@/helpers/proto/plugnmeet_analytics_pb';
import { useTranslations } from 'next-intl';

interface IFileSendProps {
  isChatServiceReady: boolean;
  lockSendFile: boolean;
  currentRoom: Room;
}

const selectedChatOptionSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.selectedChatOption
);

const FileSend = ({
  isChatServiceReady,
  lockSendFile,
  currentRoom,
}: IFileSendProps) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const t = useTranslations('meet');
  const [files, setFiles] = useState<Array<File>>();
  const selectedChatOption = useAppSelector(selectedChatOptionSelector);

  const chat_features =
    store.getState().session.currentRoom.metadata?.room_features.chat_features;
  const accept =
    chat_features?.allowed_file_types?.map((type) => '.' + type).join(',') ??
    '*';
  const maxFileSize = chat_features?.max_file_size
    ? chat_features?.max_file_size
    : undefined;

  const { isUploading, result } = useResumableFilesUpload({
    allowedFileTypes: chat_features?.allowed_file_types ?? [],
    maxFileSize,
    files,
  });

  useEffect(() => {
    if (result && result.filePath && result.fileName) {
      publishToChat(result.filePath, result.fileName);
      toast(t('right-panel.file-upload-success'), {
        type: toast.TYPE.SUCCESS,
      });
    }
    //eslint-disable-next-line
  }, [result]);

  const openFileBrowser = () => {
    if (!isUploading) {
      inputFile.current?.click();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) {
      return;
    }
    setFiles([...files]);
  };

  const publishToChat = async (filePath: string, fileName: string) => {
    if (!isSocketConnected()) {
      return;
    }

    const message = `<span class="download"> <i class="pnm-download"></i> <a href="${
      process.env.NEXT_PUBLIC_PAXMEET_SERVER_URL +
      '/download/uploadedFile/' +
      filePath
    }" target="_blank">${fileName}</a></span>`;

    let sid = await currentRoom.getSid();

    const dataMsg = new DataMessage({
      type: DataMsgType.USER,
      roomSid: sid,
      roomId: currentRoom.name,
      to: selectedChatOption !== 'public' ? selectedChatOption : '',
      body: {
        type: DataMsgBodyType.CHAT,
        isPrivate: selectedChatOption !== 'public' ? 1 : 0,
        from: {
          sid: currentRoom.localParticipant.sid,
          userId: currentRoom.localParticipant.identity,
          name: currentRoom.localParticipant.name,
        },
        msg: message,
      },
    });

    sendWebsocketMessage(dataMsg.toBinary(), t);
    // send analytics
    sendAnalyticsByWebsocket(
      t,
      AnalyticsEvents.ANALYTICS_EVENT_USER_CHAT_FILES,
      AnalyticsEventType.USER,
      fileName
    );
  };

  const render = () => {
    return (
      <>
        <input
          type='file'
          id='chat-file'
          ref={inputFile}
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => onChange(e)}
        />
        <button
          disabled={!isChatServiceReady || lockSendFile || isUploading}
          onClick={() => openFileBrowser()}
          className='h-6 w-4 px-2'
        >
          <i className='pnm-attachment primaryColor text-[20px] opacity-50 dark:text-secondaryColor' />
        </button>
      </>
    );
  };

  return <>{render()}</>;
};

export default FileSend;
