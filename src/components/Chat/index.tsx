import { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPaperclip,
  faPaperPlane,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import socketIOClient from "socket.io-client";
import { IUser } from "../../types/types";
import "./styles.scss";
import { createMessageService, getChatService } from "../../services/deadpool";
import Message from "./Message";

interface IChatProps {
  user?: IUser;
  chat?: any;
  isExternal?: boolean;
  setSelectedChat(e: any): void;
  setCreateChat(e: any): void;
}

const Chat: React.FC<IChatProps> = ({
  user,
  chat: { id },
  isExternal,
  setSelectedChat,
  setCreateChat,
}) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Array<any>>([]);
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Array<any>>([]);

  const socket = useMemo(() => {
    const socket = socketIOClient(`${process.env.REACT_APP_DEADPOOL_URL}chat`, {
      query: {
        chat: id,
      },
      auth: {
        token: user?.uuid,
      },
      forceNew: true,
    });

    socket?.on("message", msg => {
      setMessages(data => [...(data as Array<any>), msg.message]);
    });

    socket?.on("typing", data => {
      setTypingUsers(_users => {
        if (_users.find(u => data.user === u.user)) {
          return _users.map(u => (u.user === data.user ? data : u));
        }
        return [..._users, data];
      });
    });

    return socket;
  }, [id, user]);

  useEffect(() => {
    const _getChat = async () => {
      try {
        const { data } = await getChatService(id);

        setMessages(data.messages);
        setChat(data);
      } catch (e) {
        console.log(e);
      }
    };

    _getChat();
  }, [id, socket]);

  const sendMessage = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    if (chat && user && textRef?.current)
      try {
        const messagePayload = new FormData();

        messagePayload.append("chat_id", chat?.id);
        messagePayload.append("text", textRef.current.value);
        messagePayload.append("author_uuid", user.uuid);
        messagePayload.append("author_email", user.email);
        messagePayload.append("author_name", user.username);

        if (fileInput?.current?.files) {
          if (fileInput.current?.files?.length > 0)
            messagePayload.append("file", fileInput.current?.files[0]);

          fileInput.current.value = "";
        }

        await createMessageService(messagePayload);

        textRef.current.value = "";
        socket?.emit("typing", {
          user: user?.uuid,
          user_name: user?.username,
          typing: false,
        });
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
  }, [chat, user, loading, textRef, socket, fileInput]);

  const onChange = useCallback(
    e => {
      if (e.target.value.length === 1) {
        socket?.emit("typing", {
          user: user?.uuid,
          user_name: user?.username,
          typing: true,
        });
      } else if (e.target.value.length <= 0) {
        socket?.emit("typing", {
          user: user?.uuid,
          user_name: user?.username,
          typing: false,
        });
      }
    },
    [user, socket],
  );

  const submitOnEnter = useCallback(
    e => {
      if (e.ctrlKey && e.code === "Enter") {
        sendMessage();
      }
    },
    [sendMessage],
  );

  return (
    chat && (
      <div className="chat">
        <header>
          {isExternal ? (
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => {
                setSelectedChat(null);
                setCreateChat(true);
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={() => setSelectedChat(null)}
            />
          )}
          {chat.summary}
        </header>

        <ul
          ref={ref => {
            if (ref) {
              ref.scrollTo({
                top: ref.scrollHeight,
                behavior: "smooth",
              });
            }
          }}
        >
          {messages?.length ? (
            messages?.map(message => <Message message={message} user={user} />)
          ) : (
            <span className="no_message">Nenhuma mensagem</span>
          )}
        </ul>

        <footer>
          {typingUsers?.find(u => u.typing) && (
            <div className="typing">
              {typingUsers.map(
                (u, i) =>
                  u.typing && (
                    <p key={u.id}>
                      {u.user_name}
                      {typingUsers.length > 1 && i + 1 !== typingUsers.length
                        ? ", "
                        : " "}
                    </p>
                  ),
              )}
            </div>
          )}
          <div>
            <input
              ref={fileInput}
              type="file"
              id="fileinput"
              style={{
                display: "none",
              }}
            />
            <FontAwesomeIcon
              icon={faPaperclip}
              onClick={() => fileInput?.current?.click()}
            />
          </div>

          <textarea
            ref={textRef}
            onChange={onChange}
            onKeyDown={submitOnEnter}
          />

          <button type="button" onClick={sendMessage} disabled={loading}>
            <FontAwesomeIcon
              icon={loading ? faSpinner : faPaperPlane}
              spin={loading}
            />
          </button>
        </footer>
      </div>
    )
  );
};

export default Chat;
