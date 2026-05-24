"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { List, X, ArrowLeft, ArrowRight } from "@phosphor-icons/react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Cover Letter", href: "/cover-letter" },
    { name: "About", href: "/about" },
  ];

  const handleActionClick = () => {
    router.push("/");
  };

  // Determine what action button to show on the right
  const showActionButton = pathname !== "/";
  const actionButtonText = pathname === "/results" ? "Analyze Another" : "Optimize Resume";
  const ActionIcon = pathname === "/results" ? ArrowLeft : ArrowRight;

  return (
    <nav className="relative flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-200 bg-white shrink-0 z-30 w-full">
      {/* Brand logo */}
      <div 
        onClick={() => router.push("/")}
        className="text-xl font-heading font-bold text-gray-900 tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
      >
        CVRunner
      </div>

      {/* Desktop Links (Centered) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex gap-8 text-[13px] font-semibold">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <a
              key={link.name}
              href={link.href}
              className={`transition-colors py-1 ${
                isActive
                  ? "text-gray-900 border-b-2 border-black"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.name}
            </a>
          );
        })}
      </div>

      {/* Desktop Action Button (Right) */}
      <div className="hidden md:flex min-w-[120px] justify-end">
        {showActionButton && (
          <button
            onClick={handleActionClick}
            className="text-[13px] font-semibold text-gray-500 hover:text-black flex items-center gap-1.5 transition-all bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200 shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            {pathname === "/results" && <ActionIcon size={14} />}
            {actionButtonText}
            {pathname !== "/results" && <ActionIcon size={14} />}
          </button>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-gray-500 hover:text-gray-900 p-1 cursor-pointer focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg flex flex-col p-4 md:hidden gap-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`text-[14px] font-semibold transition-colors py-1 ${
                  isActive ? "text-black pl-1 border-l-2 border-black" : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            );
          })}
          {showActionButton && (
            <>
              <div className="h-px w-full bg-gray-100 my-1"></div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleActionClick();
                }}
                className="text-[14px] font-semibold text-gray-900 flex items-center gap-1.5 text-left cursor-pointer"
              >
                {pathname === "/results" && <ActionIcon size={14} />}
                {actionButtonText}
                {pathname !== "/results" && <ActionIcon size={14} />}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
