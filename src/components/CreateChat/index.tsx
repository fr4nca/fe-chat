import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useChat } from "../../hooks/chat";
import { createChatService } from "../../services/deadpool";
import "./styles.scss";

const CreateChat: React.FC = () => {
  const { user, isExternal, setKeyData, company } = useChat();

  const onSubmitExternal = useCallback(
    async e => {
      e.preventDefault();
      const name = e.target.elements.name.value;
      const email = e.target.elements.email.value;
      const uuid = uuidv4();

      const { data: dataRes } = await createChatService({
        owner_uuid: uuid,
        owner_name: name,
        owner_email: email,
        company_uuid: company,
        summary: "Novo chat",
        team: 0,
        is_partner: false,
      });

      setKeyData("user", {
        email,
        username: name,
        uuid,
        is_partner: false,
      });

      setKeyData("chat", dataRes);
      setKeyData("createChat", false);
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
        // const resource_type = e.target.elements.resource_type.value;
        // const resource_id = e.target.elements.resource_id.value;

        payload = {
          ...payload,
          team,
          // resource_type,
          // resource_id,
        };
      }

      const { data: dataRes } = await createChatService(payload);

      setKeyData("chat", dataRes);
      setKeyData("createChat", false);
    },
    [user, company],
  );

  return user && !isExternal ? (
    <form className="form" onSubmit={onSubmitInternal}>
      <div>
        <label>Título</label>
        <input placeholder="Escreva seu nome" name="summary" required />
      </div>
      <div>
        <label>Área de atendimento</label>
        <select
          placeholder="Escolha uma área"
          name="team"
          required
          defaultValue={0}
        >
          <option disabled value={0}>
            Escolha uma área
          </option>
          <option value={1}>Suporte</option>
          <option value={2}>Financeiro</option>
          <option value={3}>Comercial</option>
          <option value={4}>Migração</option>
          <option value={5}>Spam</option>
          <option value={6}>Insights</option>
          <option value={7}>Whitelabel</option>
          <option value={1}>Outros</option>
        </select>
      </div>
      {false && user?.is_partner && (
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
      <button type="submit">NOVO CHAT</button>
    </form>
  );
};

export default CreateChat;
