import {useState} from "react";
import ReactDOM from "react-dom";

interface PropTypes {resolve: (value: boolean | string) => void, alert?: string, message: string}

const DisplayModal = <T extends PropTypes>({ resolve, alert, message }: T) => {
    const [input, setInput] = useState("");

    const handleChange = (e: { target: { value: string } }) => {
        setInput(e.target.value);
    };

    async function handleClick() {
      removeDialog();
      alert === "prompt" && resolve(input);
      alert === "confirm" && resolve(true);
      setInput("");
    }
    function handleCancel() {
      removeDialog();
      resolve(false);
    }
    return (
        <div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 place-items-center text-center text-white pt-48">
        {
        alert === "video" ?
          <div className="bg-[#999999] mx-auto w-full sm:w-96 p-1 rounded-md">
            <video controls src={message}></video>
            <div className="text-end pointer-cursor">
              <a href={message}>
              <button className="p-2 bg-black text-white mt-1 rounded-md">Download</button>
              </a>
              <button className="p-2 px-4 bg-black text-white ml-2 rounded-md" onClick={handleCancel}>Close</button>
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
        }
      </div>
    );
  }
  
  export default function callModal(alert: string, message: string) {
    return new Promise((resolve, reject) => {
      addDialog(alert, resolve, message);
    });
  }
  
  function addDialog(alert: string, resolve: (value: unknown) => void, message: string) {
    const body = document.getElementsByTagName("body")[0];
    const div = document.createElement("div");
    div.setAttribute("id", "modal-container");
    body!.appendChild(div);
    ReactDOM.render(
      <DisplayModal alert={alert} resolve={resolve} message={message} />,
      div
    );
  }
  
  
  function removeDialog() {
    const div = document.getElementById("modal-container");
    const body = document.getElementsByTagName("body")[0];
    body!.removeChild(div as HTMLDivElement);
  }