import { createPortal } from "react-dom";
import { ReactNode, useState } from "react";

interface Props <T>{
  values: ValueProps;
  onSend<T extends string | boolean>(data: T): T;
  close: () => void;
  children?: ReactNode;
  link?: string;
}

interface ValueProps {
  alertType: string;
  message: string;
  isOpen: boolean;
}

const Modal = <T extends Props>({ onSend, close, values: {alertType: alert, message, isOpen}, children, link}: T) => {
  const [input, setInput] = useState("");

  const handleChange = (e: { target: { value: string } }) => {
    setInput(e.target.value);
  };

  const handleClick = async() => {
    alert === "prompt" && await Promise.resolve(onSend(input));
    alert === "confirm" && await Promise.resolve(onSend(true));
    setInput("");
    close();
  };

  return createPortal(
    isOpen && (
      <div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 place-items-center text-center text-white pt-48">
        {
        children ?
          <div className="bg-[#999999] mx-auto w-full sm:w-96 p-1 rounded-md">
            {children}
            <div className="text-end pointer-cursor">
              <a href={link}>
              <button className="p-2 bg-black text-white mt-1 rounded-md">Download</button>
              </a>
              <button className="p-2 px-4 bg-black text-white ml-2 rounded-md" onClick={() => close()}>Close</button>
            </div>
          </div>
         :
        <div className="bg-[#999999] mx-auto w-72 sm:w-96 p-8 rounded-md">
          <p className="text-lg font-bold">Attention!</p>
          <p>{message}</p>
          {alert === "prompt" && (
            <>
              <input
                className="mt-4 h-10 w-72 border-2 border-white rounded-lg px-2 text-black"
                value={input}
                onChange={handleChange}
                type="text"
              />
              <br />
            </>
          )}
          <div>
            {alert !== "alert" && (
              <button
                className="btn btn-ghost px-8 mt-4"
                onClick={() => close()}
              >
                Cancel
              </button>
            )}
            <button className="btn bg-black px-8 mt-4" onClick={handleClick}>
              {alert === "alert" || alert === "confirm" ? "Ok" : "Done"}
            </button>
          </div>
        </div>
        }
      </div>
    ),
    document.body
  );
};

export default Modal;
