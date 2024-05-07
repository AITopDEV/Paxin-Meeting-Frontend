import { DataPacket_Kind, Participant } from 'livekit-client';
import { toast } from 'react-toastify';

import { IConnectLivekit } from './types';
import { store } from '../../store';
import {
  updateAzureTokenInfo,
  updatePlayAudioNotification,
} from '../../store/slices/roomSettingsSlice';
import {
  DataMessage,
  DataMsgBody,
  DataMsgBodyType,
  DataMsgType,
} from '../proto/plugnmeet_datamessage_pb';
import { GenerateAzureTokenRes } from '../proto/plugnmeet_speech_services_pb';

export default class HandleDataMessages {
  private that: IConnectLivekit;
  private requestedParticipant: Participant | undefined;

  constructor(that: IConnectLivekit) {
    this.that = that;
  }

  public dataReceived = async (
    payload: Uint8Array,
    participant?: Participant,
    kind?: DataPacket_Kind
  ) => {
    this.requestedParticipant = participant;
    let data: DataMessage;
    try {
      data = DataMessage.fromBinary(new Uint8Array(payload));
    } catch (error) {
      console.error(error);
      return;
    }

    if (kind === DataPacket_Kind.RELIABLE) {
      if (data.type === DataMsgType.SYSTEM) {
        if (!store.getState().session.currentUser?.isRecorder) {
          if (data.body) {
            await this.handleSystemTypeData(data.body);
          }
        }
      }
    }
  };

  private handleSystemTypeData = async (body: DataMsgBody) => {
    switch (body.type) {
      case DataMsgBodyType.RAISE_HAND:
      case DataMsgBodyType.INFO:
        toast(body.msg as any, {
          type: 'info',
        });
        this.playNotification(body.type);
        break;

      case DataMsgBodyType.ALERT:
        toast(this.that.intl(body.msg as any), {
          type: 'error',
        });
        this.playNotification(body.type);
        break;

      case DataMsgBodyType.AZURE_COGNITIVE_SERVICE_SPEECH_TOKEN:
        const res = GenerateAzureTokenRes.fromJsonString(body.msg);
        if (res.status && res.token && res.keyId && res.serviceRegion) {
          store.dispatch(
            updateAzureTokenInfo({
              token: res.token,
              keyId: res.keyId,
              serviceRegion: res.serviceRegion,
            })
          );
        } else {
          toast(
            this.that.intl('speech-services.token-generation-failed', {
              error: res.msg,
            }),
            {
              type: 'error',
            }
          );
        }
        break;
      case DataMsgBodyType.UPDATE_ROOM_METADATA:
        await this.that.setRoomMetadata(body.msg);
        break;
    }
  };

  private playNotification = (type: DataMsgBodyType) => {
    if (type === DataMsgBodyType.RAISE_HAND || type === DataMsgBodyType.ALERT) {
      store.dispatch(updatePlayAudioNotification(true));
    }
  };
}
