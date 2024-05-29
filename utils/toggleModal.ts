type ModalIdOptions = "addToListModal";

export const showModal = (elementId: ModalIdOptions) => {
  const modal = document.getElementById(elementId) as HTMLDialogElement | null;

  if (modal) modal.showModal();
};

export const closeModal = (elementId: ModalIdOptions) => {
  const modal = document.getElementById(elementId) as HTMLDialogElement | null;

  if (modal) modal.close();
};
