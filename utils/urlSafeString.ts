export default function urlSafeString(value: string, userId: number) {
  return value
    .replace(/[^a-z0-9_]+/gi, "-")
    .replace(/^-|-$/g, "-")
    .toLowerCase()
    .concat(`-${userId}`);
}
