import AccountForm from "./account-form";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  // ❌ buggy
  const { data } = useQuery({
    queryKey: ['projects'],                 // orgId omitted
    queryFn: () => fetchProjects(orgId),
    });


  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AccountForm user={user} />;
}
function fetchProjects(orgId: any) {
  throw new Error("Function not implemented.");
}

function useQuery(arg0: {
  queryKey: string[]; // orgId omitted
  queryFn: () => void;
}): { data: any; } {
  throw new Error("Function not implemented.");
}

