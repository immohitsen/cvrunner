import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12 px-6 md:px-8 w-full mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: Title & Description */}
        <div className="flex flex-col gap-3">
          <span className="text-lg font-heading font-bold text-gray-900 tracking-tighter">CVRunner</span>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm font-medium">
            AI-powered resume analyzer built to optimize your career documents for Applicant Tracking Systems and hiring managers.
          </p>
        </div>

        {/* Column 2: Pages Links */}
        <div className="flex flex-col gap-3 md:items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pages</span>
          <div className="flex flex-col gap-2.5 font-medium md:items-center">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors w-fit">
              Home
            </a>
            <a href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors w-fit">
              About
            </a>
          </div>
        </div>

        {/* Column 3: Developer & Github */}
        <div className="flex flex-col gap-3 md:items-end">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Developer</span>
          <p className="text-sm text-gray-500 leading-relaxed mb-1 font-medium md:text-right max-w-sm">
            Created by a passionate developer focused on building impactful and modern web applications.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors w-fit flex items-center gap-1.5"
          >
            GitHub Profile →
          </a>
        </div>
      </div>
      
      {/* Bottom copyright bar */}
      <div className="max-w-7xl mx-auto border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-400 font-medium">
          © {new Date().getFullYear()} CVRunner. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
