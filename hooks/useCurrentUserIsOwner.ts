import { useSession } from "next-auth/react";

export default function useCurrentUserIsOwner(userEmail: string) {
  const { data: session } = useSession();

  return session?.user?.email === userEmail;
}
