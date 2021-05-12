import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import "./app.scss";
import { v4 as uuidv4 } from "uuid";
import CreateChat from "./components/CreateChat";
import Chat from "./components/Chat";
import { IUser } from "./types/types";
import { createChatService, getChatsService } from "./services/deadpool";

const App = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [company, setCompany] = useState<string | undefined>(undefined);
    const [selectedChat, setSelectedChat] = useState<any>();

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

    const onSubmitExternal = useCallback(
        async e => {
            e.preventDefault();

            const name = e.target.elements.name.value;
            const email = e.target.elements.email.value;

            const { data } = await createChatService({
                owner_uuid: uuidv4(),
                owner_name: name,
                owner_email: email,
                company_uuid: company,
                summary: "Novo chat",
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

    return (
        <div className={`app ${isOpen ? "open" : "close"}`}>
            {isOpen ? (
                <>
                    <header className="header">
                        <div>
                            <FontAwesomeIcon icon={faCommentAlt} />
                            Novo chat
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
