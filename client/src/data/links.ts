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
    label: "Completed",
    href: "/complete",
    icon: FileCheck,
  },
];
