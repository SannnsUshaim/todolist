import { FileCheck, FileText, Home } from "lucide-react";

export const NavLinks = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: FileText,
  },
  {
    label: "Done",
    href: "/done",
    icon: FileCheck,
  },
];
