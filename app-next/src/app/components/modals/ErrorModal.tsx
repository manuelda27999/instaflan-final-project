"use client";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export default function ErrorModal(props: ErrorModalProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 m-auto bg-black/50 w-full h-full z-30 flex flex-col items-center justify-center">
      <div className="flex flex-col justify-center items-center p-6 bg-color5 border-solid border-black border-4 rounded-lg w-64">
        <h3 className="font-bold text-xl text-color1 mb-4">Error</h3>
        <p className="text-color1 font-extrabold mb-4">{props.message}</p>
        <button
          onClick={props.onClose}
          className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          Close
        </button>
      </div>
    </div>
  );
}
