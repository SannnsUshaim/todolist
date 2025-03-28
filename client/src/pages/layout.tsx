import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidemenu from "../components/element/Sidemenu";

export const Layout = () => {
  const location = useLocation();
  return (
    <div className="h-screen bg-[#F3F4F6]">
      <div className="flex h-full overflow-y-hidden">
        <Sidemenu />
        <div className="flex flex-col h-full gap-4 basis-10/12 overflow-y-hidden">
          <div className="bg-dark w-full p-4 h-24 flex items-center">
            <h1 className="text-white text-2xl font-semibold capitalize">
              {location.pathname === "/" ? "Home" : location.pathname.slice(1)}
            </h1>
          </div>
          <div className="w-full h-full px-4 pb-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
