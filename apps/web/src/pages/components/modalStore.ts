import create from "zustand";

export interface ModalStateType {
  isModalOpen?: boolean;
  alert?: string;
  value?: string;
  message?: string;
  changeValue(newValue: string): void;
  changeAlert(newAlert: string): void;
  changeMessage(newMessage: string): void;
  changeIsModalOpen(isOpen: boolean): void;
}

type SetType = (state: {}) => void;

export type ModalState = ModalStateType;

const createStore = (set: SetType) => ({
  isModalOpen: false,
  alert: "",
  value: "",
  message: "",
  changeValue: (newValue: string) => set({ value: newValue }),
  changeAlert: (newAlert: string) => set({ alert: newAlert }),
  changeMessage: (newMessage: string) => set({ message: newMessage }),
  changeIsModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
});

export const useModalStore = create<ModalStateType>(createStore);

export const handleModalProps = ({
  alert,
  message,
}: {
  alert: string;
  message: string;
}) => {
  useModalStore.setState({ isModalOpen: true });
  useModalStore.setState({ alert: alert });
  useModalStore.setState({ message: message });
};