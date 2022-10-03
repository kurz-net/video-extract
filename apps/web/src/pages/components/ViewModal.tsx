import { useModalStore } from "./modalStore";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

interface Props {
  func(data: string | boolean | undefined): void;
}
const Modal = ({ func }: Props) => {
  const [input, setInput] = useState("");
  const { changeValue, alert, message, isModalOpen, changeIsModalOpen } =
    useModalStore((state) => state);

  const handleChange = (e: { target: { value: string } }) => {
    setInput(e.target.value);
  };

  const handleClick = () => {
    changeIsModalOpen(false);
    changeValue(input);
    alert && alert === "prompt" ? func(input) : func(true);
    setInput("");
  };

  return createPortal(
    isModalOpen && (
      <div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 place-items-center text-center text-black pt-48">
        <div className="bg-white mx-auto w-96 p-8 rounded-md">
          <p className="text-lg font-bold">Attention!</p>
          <p>{message}</p>
          {alert === "prompt" && (
            <>
              <input
                className="mt-4 h-10 w-72 border-2 border-black rounded-lg px-2"
                value={input}
                onChange={handleChange}
                type="text"
              />
              <br />
            </>
          )}
          <button className="btn btn-primary px-8 mt-4" onClick={handleClick}>
            {alert === "alert" || alert === "confirm" ? "Ok" : "Done"}
          </button>
        </div>
      </div>
    ),
    document.getElementById("modal_portal") as HTMLElement
  );
};

export default Modal;