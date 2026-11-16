import { redirect } from "next/navigation";

// Fashion styles are not part of this kitchen catalog.
export default function StylesPage() {
  redirect("/admin");
}
