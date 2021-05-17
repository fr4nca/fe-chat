/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useCallback, useMemo } from "react";
import md5 from "md5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import "./app.scss";
import CreateChat from "./components/CreateChat";
import Chat from "./components/Chat";
import ChatList from "./components/ChatList";
import { ChatProvider } from "./context/chat";
import { useChat } from "./hooks/chat";

const App: React.FC = () => {
  const { company, isExternal, createChat, user, notifications, chat } =
    useChat();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  // {
  //     id: "9a0a38c3-8c2c-46f9-b361-14253bf35cc4",
  //     summary: "Novo chat",
  //     owner_uuid: "371aa7d7-7b32-4b1e-ba59-ecb4b6e720fc",
  //     owner_email: "adgmadgm@asfhafh.com",
  //     owner_name: "basefb",
  //     company_uuid: "fc0baac5-92af-4d80-87c8-04abf3013d17",
  //     team: null,
  //     resource_id: null,
  //     resource_type: null,
  //     updatedAt: "2021-05-12T20:13:00.589Z",
  //     createdAt: "2021-05-12T20:13:00.589Z",
  //     responsible_uuid: null,
  //     open: true,
  // }

  const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  const avatar = useMemo(() => {
    if (chat) {
      const hash = md5(chat.owner_email);
      return `https://www.gravatar.com/avatar/${hash}?d=mp`;
    }
  }, [chat]);

  const render = useMemo(() => {
    if (chat) {
      return <Chat />;
    }
    if (createChat) {
      return <CreateChat />;
    }
    if (!isExternal) {
      return <ChatList />;
    }
  }, [createChat, isExternal, chat, user, company, notifications]);

  const hasNot = useMemo(() => {
    return notifications?.find(
      not => not.status === 0 && not.user_uuid === user?.uuid,
    );
  }, [notifications, user]);

  return (
    <div className={`app ${isOpen ? "open" : "close"}`}>
      {isOpen ? (
        <>
          <header className="header">
            <div>
              {false ? (
                <>
                  <img src={avatar} alt="avatar" />
                  {chat.owner_name}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCommentAlt} />
                  Novo chat
                </>
              )}
            </div>
            <FontAwesomeIcon icon={faChevronDown} onClick={toggleOpen} />
          </header>

          {render}
        </>
      ) : (
        <>
          {hasNot && <span className="notification" />}
          <FontAwesomeIcon icon={faCommentAlt} onClick={toggleOpen} />
        </>
      )}
    </div>
  );
};

export default (props: any) => (
  <ChatProvider>
    <App {...props} />
  </ChatProvider>
);
