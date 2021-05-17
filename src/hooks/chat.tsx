import { useContext } from "react";
import { ChatContext, IChatContextData } from "../context/chat";

export function useChat(): IChatContextData {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within an ChatProvider");
  }

  return context;
}
