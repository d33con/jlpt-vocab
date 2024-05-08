import { useSession } from "next-auth/react";

export default function useCurrentUserIsOwner(userEmail: string) {
  const { data: session } = useSession();

  const isListOwner = session?.user?.email === userEmail;

  return isListOwner;
}
