import React from "react";
import { useTheme } from "./theme-provider";

const Github = () => {
  return (
    <div className="flex flex-col items-center text-center border  rounded-lg p-8">
      <h3 className="text-lg font-medium text-blue-600 mb-2">Contact Us</h3>
      <h2 className="text-3xl md:text-4xl font-semibold mb-4 theme:text-gray-800">
        Find Us On GitHub
      </h2>
      <p className="w-3/5 mb-14 text-gray-500 text-sm">
        You can follow us on GitHub to get the latest updates and news.
      </p>
      <div
        className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        onClick={() =>
          window.open(
            "https://github.com/SumYu02/Score-Board-Website",
            "_blank"
          )
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      </div>
    </div>
  );
};

export default Github;
