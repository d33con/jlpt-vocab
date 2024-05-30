import { useConfirm } from "../../hooks/useConfirm";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const DeleteConfirmationModal = () => {
  const { isAsking, message, deny, confirm } = useConfirm();
  return (
    <dialog
      id="deleteConfirmationModal"
      className={`modal ${isAsking ? "modal-open" : ""} ${
        sora.variable
      } font-sans`}
    >
      <div className="modal-box p-6">
        <h3 className="font-bold text-xl text-center">{message}</h3>
        <div className="flex justify-center mt-8">
          <button onClick={confirm} className="btn btn-error btn-outline mr-8">
            Yes
          </button>
          <button onClick={deny} className="btn btn-outline">
            No
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteConfirmationModal;
