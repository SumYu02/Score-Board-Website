import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./theme-provider";

const Footer = () => {
  const navigate = useNavigate();

  return (
    // bg-gradient-to-b from-[#373737] to-[#FFFFFF]
    <footer className="w-full  theme:text-gray-800 border-t border-border/40 bg-background/95">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        <div
          className="flex items-center justify-center gap-2 "
          onClick={() => navigate("/")}
        >
          <div className="flex h-8 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">%</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Score Board
          </h1>
        </div>
        <div className="flex items-center space-x-3 mb-6"></div>
        <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
          Score Board is a simple score board for your games.
        </p>
      </div>
      <div className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
          <a href="https://prebuiltui.com">Score Board</a> ©2026. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
