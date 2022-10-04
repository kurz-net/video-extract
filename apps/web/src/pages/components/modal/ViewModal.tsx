import { createPortal } from "react-dom";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  func(data: string | boolean | undefined): void;
  message: string;
  close: () => void;
  alert: string;
}
const Modal = ({ func, message, close, isOpen, alert }: Props) => {
  const [input, setInput] = useState("");

  const handleChange = (e: { target: { value: string } }) => {
    setInput(e.target.value);
  };

  const handleClick = () => {
    alert === "prompt" && func(input)
    alert === "confirm" && func(true)
    setInput("");
    close();
  };

  return createPortal(
    isOpen && (
      <div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 place-items-center text-center text-white pt-48">
        <div className="bg-secondary mx-auto w-72 sm:w-96 p-8 rounded-md">
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
            <button className="btn btn-primary px-8 mt-4" onClick={handleClick}>
              {alert === "alert" || alert === "confirm" ? "Ok" : "Done"}
            </button>
          </div>
        </div>
      </div>
    ),
    document.getElementById("modal_portal") as HTMLElement
  );
};

export default Modal;
