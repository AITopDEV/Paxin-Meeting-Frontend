'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const pageSize = 10

const getAllMessages = async (roomId: string, page: number = 1) => {
  try {
    const accessToken = await getAccessToken();
    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/message/${roomId}?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    if (res.status !== 'success') {
      return {
        success: false,
        messages: [],
        total: 0,
        pageSize: 10,
        page: 1
      };
    }

    const _messages = [];

    for (const item of res.data.messages) {
      _messages.push({
        id: `${item.ID}`,
        parentMessageId: item.ParentMessageID ? `${item.ParentMessageID}`: undefined,
        messageType: `${item.MsgType}` as '0' | '1' | '2',
        message: item.Content,
        customData: item.MsgType > 0 ? JSON.parse(item.JsonData) : undefined,
        owner: {
          id: item.UserID,
          name: item.User.Name,
          avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${item.User.Photo}`,
        },
        timestamp: item.CreatedAt,
        isDeleted: item.IsDeleted,
        isEdited: item.IsEdited,
      });
    }

    _messages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return {
      success: true,
      messages: _messages,
      total: 0,
      pageSize: 10,
      page: page
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      messages: [],
      total: 0,
      pageSize: 10,
      page: page
    };
  }
};

export default getAllMessages;
