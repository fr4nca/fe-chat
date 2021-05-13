/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { useState, useEffect, useCallback, useMemo } from "react";
import md5 from "md5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import "./app.scss";
import { v4 as uuidv4 } from "uuid";
import CreateChat from "./components/CreateChat";
import Chat from "./components/Chat";
import { IUser } from "./types/types";
import {
    createChatService,
    createMessageService,
    getChatsService,
} from "./services/deadpool";

const App: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [company, setCompany] = useState<string | undefined>(undefined);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);
    const [selectedChat, setSelectedChat] = useState<any>();
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

    const getChats = useCallback(async () => {
        const { data } = await getChatsService({
            owner_uuid: user?.uuid,
        });

        return data;
    }, [user]);

    useEffect(() => {
        async function _getChats() {
            const data = await getChats();
            console.log(data);
        }

        if (user) _getChats();
    }, [getChats, user]);

    const addMessage = useCallback(
        async textRef => {
            if (messageLoading) return;
            setMessageLoading(true);

            if (selectedChat && user)
                try {
                    const messagePayload = new FormData();

                    messagePayload.append("chat_id", selectedChat?.id);
                    messagePayload.append("text", textRef.current.value);
                    messagePayload.append("author_uuid", user.uuid);
                    messagePayload.append("author_email", user.email);
                    messagePayload.append("author_name", user.username);

                    // if (fileInput.current?.files) {
                    //     if (fileInput.current?.files?.length > 0)
                    //         messagePayload.append(
                    //             "file",
                    //             fileInput.current?.files[0],
                    //         );

                    //     fileInput.current.value = "";
                    //     setHasFile(false);
                    // }

                    console.log(messagePayload);

                    await createMessageService(messagePayload);

                    textRef.current.value = "";
                    setMessageLoading(false);
                } catch (e) {
                    setMessageLoading(false);
                    console.log(e);
                }
        },
        [selectedChat, user, messageLoading],
    );

    const onSubmitExternal = useCallback(
        async e => {
            e.preventDefault();
            const name = e.target.elements.name.value;
            const email = e.target.elements.email.value;
            const uuid = uuidv4();

            const { data } = await createChatService({
                owner_uuid: uuid,
                owner_name: name,
                owner_email: email,
                company_uuid: company,
                summary: "Novo chat",
            });

            setUser({
                email,
                username: name,
                uuid,
                is_partner: false,
            });
            setSelectedChat(data);
        },
        [company],
    );

    const onSubmitInternal = useCallback(
        async e => {
            e.preventDefault();

            const summary = e.target.elements.summary.value;

            let payload: any = {
                owner_uuid: user?.uuid,
                owner_name: user?.username,
                owner_email: user?.email,
                is_partner: user?.is_partner,
                company_uuid: company,
                summary,
            };

            if (user?.is_partner) {
                const team = e.target.elements.team.value;
                const resource_type = e.target.elements.resource_type.value;
                const resource_id = e.target.elements.resource_id.value;

                payload = {
                    ...payload,
                    team,
                    resource_type,
                    resource_id,
                };
            }

            const { data } = await createChatService(payload);

            setSelectedChat(data);
        },
        [user, company],
    );

    useEffect(() => {
        const script = document.querySelector("#user_data");

        const username = script?.getAttribute("username");
        const email = script?.getAttribute("email");
        const uuid = script?.getAttribute("uuid");
        const is_partner = script?.getAttribute("is_partner") === "true";
        const _company = script?.getAttribute("company");

        if (_company) setCompany(_company);

        if (username && email && uuid && is_partner !== null)
            setUser({
                username,
                email,
                uuid,
                is_partner,
            });
    }, []);

    const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    const avatar = useMemo(() => {
        if (selectedChat) {
            const hash = md5(selectedChat.owner_email);
            return `https://www.gravatar.com/avatar/${hash}?d=mp`;
        }
    }, [selectedChat]);

    return (
        <div className={`app ${isOpen ? "open" : "close"}`}>
            {isOpen ? (
                <>
                    <header className="header">
                        <div>
                            {false ? (
                                <>
                                    <img src={avatar} alt="avatar" />
                                    {selectedChat.owner_name}
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCommentAlt} />
                                    Novo chat
                                </>
                            )}
                        </div>
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            onClick={toggleOpen}
                        />
                    </header>

                    {selectedChat ? (
                        <Chat
                            user={user}
                            company={company}
                            chat={selectedChat}
                            addMessage={addMessage}
                        />
                    ) : (
                        <CreateChat
                            user={user}
                            company={company}
                            onSubmitExternal={onSubmitExternal}
                            onSubmitInternal={onSubmitInternal}
                        />
                    )}
                </>
            ) : (
                <FontAwesomeIcon icon={faCommentAlt} onClick={toggleOpen} />
            )}
        </div>
    );
};

export default App;
