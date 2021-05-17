import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import socketIOClient from "socket.io-client";
import { getNotificationsService } from "../services/deadpool";

interface IChatState {
  notifications: Array<any>;
  user: any;
  company: any;
  isExternal: boolean;
  createChat: boolean;
  chat: any;

  setKeyData(key: string, value: any): void;
}

export interface IChatContextData {
  notifications: Array<any>;
  user: any;
  company: any;
  isExternal: boolean;
  createChat: boolean;
  chat: any;

  setKeyData(key: string, value: any): void;
}

export const ChatContext = createContext<IChatContextData>(
  {} as IChatContextData,
);

export const ChatProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IChatState>({} as IChatState);

  useEffect(() => {
    async function getNotifications() {
      const { data } = await getNotificationsService();

      setData(_data => ({
        ..._data,
        notifications: data,
      }));
    }

    getNotifications();
  }, []);

  useEffect(() => {
    const script = document.querySelector("#user_data");

    const username = script?.getAttribute("username");
    const email = script?.getAttribute("email");
    const uuid = script?.getAttribute("uuid");
    const is_partner = script?.getAttribute("is_partner") === "true";
    const is_external = script?.getAttribute("is_external") === "true";
    const _company = script?.getAttribute("company");

    if (_company)
      setData(_data => ({
        ..._data,
        company: _company,
      }));

    if (username && email && uuid && is_partner !== null)
      setData(_data => ({
        ..._data,
        user: {
          username,
          email,
          uuid,
          is_partner,
        },
      }));

    setData(_data => ({
      ..._data,
      isExternal: is_external,
    }));

    if (is_external)
      setData(_data => ({
        ..._data,
        createChat: is_external,
      }));
  }, []);

  useMemo(() => {
    if (data.user) {
      const socket = socketIOClient(
        `${process.env.REACT_APP_DEADPOOL_URL}notification`,
        {
          query: {
            uuid: data.user.uuid,
          },
          auth: {
            token: "oi",
          },
        },
      );

      socket?.on("new message", data => {
        setData(_data => ({
          ..._data,
          notifications: [...(_data.notifications as Array<any>), data],
        }));
      });

      return socket;
    }

    return null;
  }, [data.user]);

  const setKeyData = useCallback((key: string, value: any) => {
    setData(_data => ({
      ..._data,
      [key]: value,
    }));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        notifications: data.notifications,
        isExternal: data.isExternal,
        company: data.company,
        user: data.user,
        createChat: data.createChat,
        chat: data.chat,

        setKeyData,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default {
  ChatProvider,
};
