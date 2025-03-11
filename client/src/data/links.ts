import { FileCheck, FileText, Home } from "lucide-react";

export const NavLinks = [
  {
    label: "Dashboard",
    base: "/",
    icon: Home,
  },
  {
    label: "Task",
    base: "/task",
    icon: FileText,
  },
  {
    label: "Done",
    base: "/done",
    icon: FileCheck,
  },
];
