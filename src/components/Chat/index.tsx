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

interface IChatProps {
    user?: IUser;
    company?: string;
    chat?: any;
    addMessage(e: any): void;
}

const Chat: React.FC<IChatProps> = ({ user, company, chat, addMessage }) => {
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [messages, setMessages] = useState<Array<any>>([]);

    const socket = useMemo(() => {
        const socket = socketIOClient("http://localhost:3333/chat", {
            query: {
                chat: chat.id,
            },
            auth: {
                token: user?.uuid,
            },
        });

        return socket;
    }, [chat, user]);

    const sendMessage = useCallback(() => {
        addMessage(textRef);

        socket?.emit("typing", {
            user: user?.uuid,
            user_name: user?.username,
            typing: false,
        });
    }, [textRef, user, socket]);

    useEffect(() => {
        setMessages(chat.messages || []);

        socket.on("message", msg => {
            setMessages(data => [...(data as Array<any>), msg.message]);
        });
    }, [chat]);

    return (
        <div className="chat">
            <header>
                <FontAwesomeIcon icon={faArrowLeft} />
                {chat.summary}
            </header>

            <ul>
                {messages?.map(message => (
                    <li>{message.text}</li>
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
    );
};

export default Chat;
