import { getProfileByUserIdAction } from "@/actions/profiles-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function NotesPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/login");
  }

  const { data } = await getProfileByUserIdAction(userId);

  if (!data?.membership) {
    return redirect("/signup");
  }

  return <div>Notes</div>;
}
