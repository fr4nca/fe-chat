/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  faFile,
  faFilePdf,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useMemo, useRef } from "react";
import { IUser } from "../../types/types";

interface IMessageProps {
  message: any;
  user?: IUser;
}

const Message: React.FC<IMessageProps> = ({ message, user }) => {
  const messageRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const url = new RegExp(
      /(\b(https?|ftp):\/\/[A-Z0-9+&@#/%?=~_|!:,.;-]*[-A-Z0-9+&@#/%=~_|])/gim,
    );

    if (messageRef) {
      if (messageRef.current) {
        messageRef.current.innerHTML = messageRef.current.innerHTML.replace(
          url,
          '<a href="$1" target="_blank">$1</a>',
        );
      }
    }
  }, [messageRef]);

  const messageCreatedAt = useMemo(() => {
    return moment(message.createdAt).format("HH:mm");
  }, [message]);

  const isAuthor = useMemo(
    () => message.author_uuid === user?.uuid,
    [message, user],
  );

  const fileIsImage = useMemo(
    () =>
      message.file &&
      (message.file.includes(".png") ||
        message.file.includes(".jpg") ||
        message.file.includes(".jpe") ||
        message.file.includes(".jpeg")),
    [message],
  );

  return (
    <li className={isAuthor ? "author" : ""}>
      {message.text && message.file && (
        <span
          className="file"
          onClick={() => window.open(message.file, "_blank")}
        >
          <span>Anexo </span>
          <FontAwesomeIcon icon={faPaperclip} />
        </span>
      )}
      {!message.text && message.file && (
        <div
          className="div_file"
          onClick={() => {
            window.open(message.file, "_blank");
          }}
        >
          <span>
            {fileIsImage ? (
              <img
                src={message.file}
                alt={message.file}
                style={{
                  maxHeight: "120px",
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon={message.file.includes(".pdf") ? faFilePdf : faFile}
              />
            )}
          </span>
          <p>{message.file.split("uploads/")[1]}</p>
        </div>
      )}
      {!isAuthor && <span className="author">{message.author_name}</span>}
      <pre ref={messageRef}>{message.text}</pre>
      <span className="hour">{messageCreatedAt}</span>
    </li>
  );
};

export default Message;
