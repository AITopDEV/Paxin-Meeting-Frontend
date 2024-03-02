import ReconnectingWebSocket from 'reconnecting-websocket';
import { toast } from 'react-toastify';

import { updateIsChatServiceReady } from '../../store/slices/sessionSlice';
import { handleSystemTypeData } from './handleSystemType';
import { handleUserTypeData } from './handleUserType';
import { handleWhiteboardMsg } from './handleWhiteboardType';
import { onAfterOpenConnection } from './handleAfterOpenConnection';
import {
  DataMessage,
  DataMsgBodyType,
  DataMsgType,
} from '../proto/plugnmeet_datamessage_pb';
import {
  AnalyticsDataMsg,
  AnalyticsEvents,
  AnalyticsEventType,
} from '../proto/plugnmeet_analytics_pb';
import { store } from '@/store';
// import i18n from '../i18n';

let isConnected = false,
  normallyClosed = false,
  isReconnecting = false,
  isFirstTime = true;
let ws: ReconnectingWebSocket;
const toastId = 'websocketStatus';

const createWS = (intl: (e: any) => string) => {
  const session = store.getState().session;
  ws = new ReconnectingWebSocket(
    () => getURL(session.token, session.currentUser, session.currentRoom),
    [],
    {
      minReconnectionDelay: 2000,
      maxRetries: 20,
    }
  );
  ws.binaryType = 'arraybuffer';

  ws.onopen = () => {
    isConnected = true;
    isFirstTime = false;
    onAfterOpenConnection(intl);
    store.dispatch(updateIsChatServiceReady(true));

    if (isReconnecting) {
      isReconnecting = false;
      toast.dismiss(toastId);
    }
  };

  ws.onclose = () => {
    isConnected = false;
    store.dispatch(updateIsChatServiceReady(false));

    if (!normallyClosed) {
      toast.loading(intl('notifications.websocket-disconnected'), {
        type: toast.TYPE.ERROR,
        autoClose: false,
        toastId: toastId,
        closeButton: true,
      });
      isReconnecting = true;
    }
  };

  ws.onerror = () => {
    toast(intl('notifications.websocket-error'), {
      type: toast.TYPE.ERROR,
      autoClose: 5000,
      toastId: toastId,
    });
  };

  ws.onmessage = (event: any) => {
    onMessage(event, intl);
  };
};

const onMessage = (event: any, intl: (...e: any[]) => string) => {
  if (event.data) {
    let data: DataMessage;
    try {
      data = DataMessage.fromBinary(new Uint8Array(event.data));
    } catch (e) {
      console.error(e);
      return;
    }

    if (data.type === DataMsgType.USER && data.body) {
      handleUserTypeData(data.body, data.messageId, data.to);
    } else if (data.type === DataMsgType.SYSTEM) {
      handleSystemTypeData(data, intl);
    } else if (data.type === DataMsgType.WHITEBOARD) {
      if (data.body) {
        handleWhiteboardMsg(data.body);
      }
    }
  }
};

const getURL = (token: string, currentUser: any, currentRoom: any) => {
  const url = new URL(process.env.NEXT_PUBLIC_PAXMEET_SERVER_URL || '');

  let webSocketUrl: string;
  let protocol = 'ws://';

  if (url.protocol === 'https:') {
    protocol = 'wss://';
  }
  webSocketUrl = protocol + url.host;

  if (url.pathname !== '/') {
    webSocketUrl = webSocketUrl + url.pathname;
  }

  webSocketUrl =
    webSocketUrl +
    '/ws?token=' +
    token +
    '&roomSid=' +
    currentRoom.sid +
    '&userSid=' +
    currentUser?.sid +
    '&roomId=' +
    currentRoom.room_id +
    '&userId=' +
    currentUser?.userId;

  return webSocketUrl;
};

export const openWebsocketConnection = (intl: (...e: any[]) => string) => {
  createWS(intl);
};

export const isSocketConnected = () => isConnected;

//☢️ Replace intl
export const sendWebsocketMessage = (
  msg: any,
  intl: (...e: any[]) => string
) => {
  if (!isFirstTime && !isConnected && !normallyClosed) {
    toast(intl('notifications.websocket-not-connected'), {
      type: 'error',
      toastId: 'websocket-notify',
      autoClose: 2000,
    });
  }
  ws?.send(msg);
};

export const sendAnalyticsByWebsocket = (
  intl: (...e: any[]) => string,
  event_name: AnalyticsEvents,
  event_type: AnalyticsEventType = AnalyticsEventType.USER,
  hset_value?: string,
  event_value_string?: string,
  event_value_integer?: bigint
) => {
  const session = store.getState().session;

  const analyticsMsg = new AnalyticsDataMsg({
    eventType: event_type,
    eventName: event_name,
    roomId: session.currentRoom.room_id,
    userId: session.currentUser?.userId,
    hsetValue: hset_value,
    eventValueString: event_value_string,
    eventValueInteger: event_value_integer,
  });

  const dataMsg = new DataMessage({
    type: DataMsgType.SYSTEM,
    roomSid: session.currentRoom.sid,
    roomId: session.currentRoom.room_id,
    body: {
      type: DataMsgBodyType.ANALYTICS_DATA,
      from: {
        sid: session.currentUser?.sid ?? '',
        userId: session.currentUser?.userId ?? '',
      },
      msg: analyticsMsg.toJsonString(),
    },
  });
  sendWebsocketMessage(dataMsg.toBinary(), intl);
};

export const closeWebsocketConnection = () => {
  if (isConnected) {
    normallyClosed = true;
    ws?.close();
  }
};
