import React from "react";
import SidemenuLink from "../ui/sidemenu-link";
import { NavLinks } from "../../data/links";

export const Sidemenu = () => {
  return (
    <div className="basis-2/12 flex flex-col gap-10 bg-lighterSecondary p-4 h-auto text-white overflow-y-auto">
      <div className="flex items-center gap-5">
        <img
          src={"/Logo(withoutbg).png"}
          alt="TuDu Logo"
          className="w-[80px]"
        />
        {/* <h1 className="font-semibold text-2xl">TuDu</h1> */}
      </div>
      <div className="flex flex-col gap-3">
        {NavLinks.map((link) => (
          <React.Fragment key={link.label}>
            <SidemenuLink
              href={link.href}
              Icon={link.icon}
              label={link.label}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Sidemenu;
