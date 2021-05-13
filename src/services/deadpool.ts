import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_DEADPOOL_URL,
  headers: {
    Authorization: "token",
  },
});

export const getChatsService = async (
  params?: AxiosRequestConfig["params"],
): Promise<any> => {
  return api.get(`/chat`, {
    params,
  });
};

export const getChatService = async (
  id: string,
  params?: AxiosRequestConfig["params"],
): Promise<any> => {
  return api.get(`/chat/${id}`, {
    params,
  });
};

export const createChatService = async (chatPayload: any): Promise<any> => {
  return api.post("/chat", chatPayload);
};

export const createMessageService = async (
  messagePayload: any,
): Promise<any> => {
  return api.post("/message", messagePayload);
};

export const escalateToTicketService = async (
  id: string,
  params?: AxiosRequestConfig["params"],
): Promise<any> => {
  return api.post(`/chat/${id}/scale`, null, {
    params,
  });
};

export const closeChatService = async (
  id: string,
  params?: AxiosRequestConfig["params"],
): Promise<any> => {
  return api.delete(`/chat/${id}`, {
    params,
  });
};

export const readNotificationService = async (id: string): Promise<any> => {
  return api.post(`/notification/${id}/read`);
};
