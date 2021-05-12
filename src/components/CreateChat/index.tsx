import { IUser } from "../../types/types";
import "./styles.scss";

interface ICreateChatProps {
    user?: IUser;
    company?: string;
    onSubmitExternal(e: any): void;
    onSubmitInternal(e: any): void;
}

const CreateChat: React.FC<ICreateChatProps> = ({
    user,
    onSubmitExternal,
    onSubmitInternal,
}) => {
    return user ? (
        <form className="form" onSubmit={onSubmitInternal}>
            <div>
                <label>Título</label>
                <input placeholder="Escreva seu nome" name="summary" required />
            </div>
            <div>
                <label>Área de atendimento</label>
                <select placeholder="Escolha uma área" name="team" required>
                    <option value={0}>A</option>
                </select>
            </div>
            {user?.is_partner && (
                <>
                    <div>
                        <label>Recurso</label>
                        <select
                            placeholder="Escolha um recurso"
                            name="resource_type"
                            required
                        >
                            <option value="website">A</option>
                        </select>
                    </div>
                    <div>
                        <label>Recurso</label>
                        <select
                            placeholder="Escolha um recurso"
                            name="resource_id"
                            required
                        >
                            <option value={10}>A</option>
                        </select>
                    </div>
                </>
            )}
            <button type="submit">NOVO CHAT</button>
        </form>
    ) : (
        <form className="form" onSubmit={onSubmitExternal}>
            <div>
                <label>Nome</label>
                <input placeholder="Escreva seu nome" name="name" required />
            </div>
            <div>
                <label>Email</label>
                <input
                    placeholder="Escreva seu email"
                    type="email"
                    name="email"
                    required
                />
            </div>
            <div>
                <label>Mensagem</label>
                <textarea
                    placeholder="Escreva sua mensagem"
                    name="message"
                    required
                />
            </div>
            <button type="submit">NOVO CHAT</button>
        </form>
    );
};

export default CreateChat;
