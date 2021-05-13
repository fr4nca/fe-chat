import { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faPaperclip,
    faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import socketIOClient from "socket.io-client";
import { IUser } from "../../types/types";
import "./styles.scss";
import { getChatService } from "../../services/deadpool";

interface IChatProps {
    user?: IUser;
    company?: string;
    chat?: any;
    addMessage(e: any): void;
}

const Chat: React.FC<IChatProps> = ({
    user,
    company,
    chat: { id },
    addMessage,
}) => {
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<Array<any>>([]);
    const [chat, setChat] = useState<any>(null);

    const socket = useMemo(() => {
        const socket = socketIOClient("http://localhost:3333/chat", {
            query: {
                chat: id,
            },
            auth: {
                token: user?.uuid,
            },
        });

        socket.on("message", msg => {
            setMessages(data => [...(data as Array<any>), msg.message]);
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

        return () => {
            socket.close();
        };
    }, [id, socket]);

    const sendMessage = useCallback(() => {
        addMessage(textRef);

        socket?.emit("typing", {
            user: user?.uuid,
            user_name: user?.username,
            typing: false,
        });
    }, [textRef, user, socket]);

    return (
        chat && (
            <div className="chat">
                <header>
                    <FontAwesomeIcon icon={faArrowLeft} />
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
                    {messages?.map(message => (
                        <li
                            className={
                                message.author_uuid === user?.uuid
                                    ? "author"
                                    : ""
                            }
                        >
                            {message.text}
                        </li>
                    ))}
                </ul>

                <footer>
                    <div>
                        <FontAwesomeIcon icon={faPaperclip} />
                    </div>

                    <textarea ref={textRef} />

                    <button type="button" onClick={sendMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </footer>
            </div>
        )
    );
};

export default Chat;
