import React from "react";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

interface SidemenuLinkProps {
  href: string;
  label: string;
  Icon?: LucideIcon;
  className?: string;
}

const SidemenuLink = ({ href, label, Icon, className }: SidemenuLinkProps) => {
  const location = useLocation();

  return (
    <a href={href} className={className}>
      <Button
        className={`hover:bg-secondary/60 bg-transparent justify-start gap-2 w-full px-3 py-4 text-black shadow-none ${location.pathname === href || location.pathname.startsWith(href + "/") ? "bg-secondary font-bold text-white" : ""}`}
      >
        {Icon && <Icon size={18} />}
        {label}
      </Button>
    </a>
  );
};

export default SidemenuLink;