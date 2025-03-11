import { FileQuestion } from "lucide-react";
import React from "react";

export const NotFound = () => {
  return (
    <div className="h-screen w-screen px-24 bg-dark">
      <div className="h-full flex flex-col justify-center gap-3">
        <div className="flex gap-2 items-center text-4xl font-semibold text-slate-200">
          <h1>404 NOT FOUND</h1>
          <FileQuestion size={32} />
        </div>
        <div className="flex flex-col gap-1 text-base font-normal text-slate-300">
          <h2>Sorry for the inconvenience</h2>
          <h3>
            The page you are looking for is not found or is under development!
          </h3>
          <p>Please go back to where you belong!</p>
        </div>
        <a
          href="/"
          className="px-4 py-1 bg-primary rounded-md text-slate-100 font-medium text-sm w-fit hover:bg-primary/80 transition mt-7 shadow-md hover:shadow-slate-500"
        >
          Back
        </a>
      </div>
    </div>
  );
};

export default NotFound;
