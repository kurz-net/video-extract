interface StateType {
  isOpen: boolean;
  alertType: string;
  message: string;
}

interface ActionType {
  type: string; 
  payload?: {message: string}
}

export const initialModalValue = {
  isOpen: false,
  alertType: "",
  message: ""
}

export const reducer = (state: StateType, actions: ActionType) => {
  switch(actions.type) {
    case "alert":
      return {isOpen: true, alertType: "alert", message: actions.payload!.message};
    case "prompt":
      return {isOpen: true, alertType: "prompt", message: actions.payload!.message};
    case "confirm":
      return {isOpen: true, alertType: "confirm", message: actions.payload!.message};
    case "close":
      return {isOpen: false, alertType: "", message: ""};
    default:
      return state;
  }
}