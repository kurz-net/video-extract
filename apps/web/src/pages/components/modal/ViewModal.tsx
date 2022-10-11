import { useRef } from "react";
import { createRoot } from "react-dom/client";

interface PropTypes {
  resolve: <T>(value: T) => void;
  alert: Alert;
  message: string;
}

type Alert = "video" | "prompt" | "confirm" | "alert";

export default function callModal(alert: Alert, message: string) {
  return new Promise((resolve, reject) => {
    addModal(alert, resolve, message);
  });
}


const DisplayModal = <T extends PropTypes>({ resolve, alert, message }: T) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    alert === "prompt" && resolve(inputRef.current!.value);
    alert === "confirm" && resolve(true);
    removeModal();
  };

  const handleCancel = () => {
    resolve(false);
    removeModal();
  };

  return (
    <div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 place-items-center text-center text-white pt-48">
      {alert === "video" ? (
        <div className="bg-[#999999] mx-auto w-full sm:w-96 p-1 rounded-md">
          <video controls src={message}></video>
          <div className="text-end pointer-cursor">
            <a href={message}>
              <button className="p-2 bg-black text-white mt-1 rounded-md">
                Download
              </button>
            </a>
            <button
              className="p-2 px-4 bg-black text-white ml-2 rounded-md"
              onClick={handleCancel}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#999999] mx-auto w-72 sm:w-96 p-8 rounded-md">
          <p className="text-lg font-bold">Attention!</p>
          <p>{message}</p>
          {alert === "prompt" && (
            <>
              <input
                className="mt-4 h-12 w-56 sm:w-72 border-2 border-white rounded-lg px-2 text-black"
                ref={inputRef}
                type="text"
              />
              <br />
            </>
          )}
          <div>
            {alert !== "alert" && (
              <button
                className="btn btn-ghost px-8 mt-4"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
            <button className="btn bg-black px-8 mt-4" onClick={handleClick}>
              {alert === "alert" || alert === "confirm" ? "Ok" : "Done"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const addModal = (
  alert: Alert,
  resolve: (value: unknown) => void,
  message: string
) => {
  const body = document.getElementsByTagName("body")[0];
  const div = document.createElement("div");
  div.setAttribute("id", "modal-container");
  body!.appendChild(div);
  const modal = createRoot(div);
  modal.render(
    <DisplayModal alert={alert as Alert} resolve={resolve} message={message} />
  );
};

const removeModal = () => {
  const div = document.getElementById("modal-container");
  const body = document.getElementsByTagName("body")[0];
  body!.removeChild(div as HTMLDivElement);
};
