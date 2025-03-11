import React from "react";
// import { Button } from "./button";
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
      <button
        className={`hover:bg-black/5 bg-transparent justify-start gap-2 w-full ${location.pathname === href || location.pathname.startsWith(href + "/") ? "font-bold" : ""}`}
      >
        {Icon && <Icon size={18} />}
        {label}
      </button>
    </a>
  );
};

export default SidemenuLink;