import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/infra/routes";

export default function RootPage() {
  redirect(ROUTES.provider.auth);
}
