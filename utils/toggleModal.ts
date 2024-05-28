type ModalIdOptions = "addToListModal";

export const toggleModal = (elementId: ModalIdOptions) => {
  const modal = document.getElementById(elementId) as HTMLDialogElement | null;

  return modal && modal.open ? modal.close() : modal.showModal();
};
