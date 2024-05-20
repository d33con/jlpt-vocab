export default function formatDate(date: string | Date) {
  let dateAddedAsDate: string | Date;
  if (typeof date === "string") {
    dateAddedAsDate = new Date(date);
  }
  return dateAddedAsDate.toLocaleString().slice(0, 10);
}
