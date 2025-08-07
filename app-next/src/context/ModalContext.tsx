"use client";

import { createContext, useState, useContext, ReactNode } from "react";

type ModalNames =
  | "create-post-modal"
  | "edit-post-modal"
  | "delete-post-modal"
  | "create-comment-modal"
  | null;

interface ModalContextType {
  modal: ModalNames;
  modalProps: any;
  openModal: (name: ModalNames, props?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalNames | null>(null);
  const [modalProps, setModalProps] = useState<any>({});

  const openModal = (nameModal: ModalNames, props = {}) => {
    setModal(nameModal);
    setModalProps(props);
  };

  const closeModal = () => {
    setModal(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ modal, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal should be used within a ModalProvider");
  }

  return context;
};
