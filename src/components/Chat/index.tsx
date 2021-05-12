import { IUser } from "../../types/types";
import "./styles.scss";

interface IChatProps {
    user?: IUser;
    company?: string;
    chat?: any;
}

const Chat: React.FC<IChatProps> = ({ user, company, chat }) => {
    console.log(chat);
    return <h1>oi</h1>;
};

export default Chat;
