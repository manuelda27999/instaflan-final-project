"use client";

import { useModal } from "@/context/ModalContext";
import ErrorModal from "@/app/components/modals/ErrorModal";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { modalState, closeModal } = useModal();

  return (
    <main className="min-h-screen w-screen flex items-center justify-center">
      {children}

      {modalState && modalState.name === "error-modal" && (
        <ErrorModal
          message={modalState.props.message}
          onClose={() => {
            modalState.props.callback?.(closeModal);
            closeModal();
          }}
        />
      )}
    </main>
  );
}
