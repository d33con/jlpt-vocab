export const showModal = (elementId: string) => {
  const modal = document.getElementById(elementId) as HTMLDialogElement | null;

  if (modal) modal.showModal();
};

export const closeModal = (elementId: string) => {
  const modal = document.getElementById(elementId) as HTMLDialogElement | null;

  if (modal) modal.close();
};
