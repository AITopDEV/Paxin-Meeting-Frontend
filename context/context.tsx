import { createContext, useContext } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  plan: string;
  city: {
    id: number;
    name: string;
  }[];
  category: {
    id: number;
    name: string;
  }[];
  hashtags: string[];
  role: string;
  balance: number;
  storage: number;
  limitStorage: number;
  followers: number;
  followings: number;
  onlinehours: {
    hour: number;
    minutes: number;
    seconds: number;
  };
  totalposts: number;
}

export interface AdditionalData {
  name: string;
  total: string;
  msg: string;
}

export type GlobalContent = {
  user: User | null;
  postMode: string;
  currentPlan: string;
  lastCommand: string;
  additionalData: AdditionalData[]; 
  socket: WebSocket | null;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setUser: (user: User | null) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  userMutate: () => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setPostMode: (value: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setCurrentPlan: (value: string) => void;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setSocket: (value: WebSocket | null) => void;
  setAdditionalData: (data: AdditionalData[]) => void; 
};
export const PaxContext = createContext<GlobalContent>({
  user: null,
  setUser: () => {},
  userMutate: () => {},
  postMode: 'all',
  currentPlan: 'BASIC',
  lastCommand: '',
  additionalData: [],
  socket: null,
  setPostMode: () => {},
  setCurrentPlan: () => {},
  setSocket: () => {},
  setAdditionalData: () => {}, 
});
export const usePaxContext = () => useContext(PaxContext);
