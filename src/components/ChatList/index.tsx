import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getChatsService } from "../../services/deadpool";
import { IUser } from "../../types/types";
import "./styles.scss";

interface IChatListProps {
  user?: IUser;
  setSelectedChat(e: any): void;
  setCreateChat(e: any): void;
  notifications?: any[];
}

const ChatList: React.FC<IChatListProps> = ({
  user,
  setSelectedChat,
  setCreateChat,
  notifications,
}) => {
  const [chats, setChats] = useState<any>();

  const getChats = useCallback(async () => {
    const { data } = await getChatsService({
      owner_uuid: user?.uuid,
    });

    setChats(data);
  }, [user]);

  useEffect(() => {
    if (user) getChats();
  }, [getChats, user]);

  const ticketArea = useCallback(team => {
    switch (team) {
      case 1:
        return "Suporte";
      case 2:
        return "Financeiro";
      case 3:
        return "Comercial";
      case 4:
        return "Migração";
      case 5:
        return "Spam";
      case 6:
        return "Insights";
      case 7:
        return "Whitelabel";
      case 8:
      case 0:
        return "Outros";
      default:
        return "Suporte";
    }
  }, []);

  const hasNot = useCallback(
    chat => {
      return notifications?.find(
        not =>
          not.chat_id === chat &&
          not.status === 0 &&
          not.user_uuid === user?.uuid,
      );
    },
    [notifications, user],
  );

  return (
    <div className="div">
      <table className="table">
        <thead>
          <tr>
            <th>TICKET</th>
            <th>ÁREA</th>
          </tr>
        </thead>

        <tbody>
          {chats?.map((chat: any) => (
            <>
              <tr onClick={() => setSelectedChat(chat)}>
                <td>
                  {hasNot(chat.id) && <span className="notification" />}
                  <FontAwesomeIcon icon={faCommentAlt} />
                  {chat.summary}
                </td>
                <td className="area">{ticketArea(chat.team)}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => setCreateChat(true)}>
        NOVO CHAT
      </button>
    </div>
  );
};

export default ChatList;
