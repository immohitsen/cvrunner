"use client";

import { ArrowRight, Info, Code, ShieldCheck } from "@phosphor-icons/react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function About() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white text-gray-900 font-sans">
      <Navbar />

      {/* Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Right Canvas: The Document */}
        <main className="flex-1 h-full overflow-y-auto relative bg-[#fbfbfb]">
          {/* Dotted background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-40"
            style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          <div className="max-w-4xl mx-auto my-12 relative z-10">
            {/* The A4 Document Container */}
            <div className="bg-gray-100 rounded-xl border border-gray-200/60 p-12 md:p-16 min-h-[800px]">

              <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-gray-900 mb-8 mt-2">
                The Intelligence Behind CVRunner.
              </h1>

              <div className="space-y-8 text-lg text-gray-600 leading-relaxed font-medium">
                <p>
                  We built CVRunner to solve a fundamental problem in modern hiring: the disconnect between highly qualified candidates and automated Applicant Tracking Systems (ATS).
                </p>

                <p>
                  Instead of relying on rigid, outdated keyword matching, CVRunner utilizes advanced Large Language Models to perform semantic analysis on your resume. It understands context, impact, and phrasing the same way a human recruiter would, while applying the strict filtering logic of an ATS.
                </p>

                <div className="h-px w-full bg-gray-100 my-10"></div>

                <h2 className="text-2xl font-heading font-bold tracking-tight text-gray-900 mt-10 mb-6">
                  How the Analysis Works
                </h2>

                <ul className="space-y-8">
                  <li className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">1. Impact & Brevity</span>
                    <span className="text-base text-gray-700">We analyze your bullet points to ensure you lead with strong action verbs and quantifiable metrics, aggressively filtering out fluff and passive language.</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">2. Skill Extraction</span>
                    <span className="text-base text-gray-700">The model extracts both hard and soft skills from your document and cross-references them against your target job description to identify critical gaps.</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">3. Structural Style</span>
                    <span className="text-base text-gray-700">We evaluate the overall readability, consistency, and structural flow of your document to ensure maximum legibility for both machines and humans.</span>
                  </li>
                </ul>

                <div className="h-px w-full bg-gray-100 my-10"></div>

                <h2 className="text-2xl font-heading font-bold tracking-tight text-gray-900 mt-10 mb-4">
                  Our Privacy Guarantee
                </h2>
                <p className="text-base text-gray-600">
                  Your career data is your own. We do not use your resumes to train our foundational models. All uploaded documents are securely processed in memory and immediately discarded after your analysis is complete.
                </p>
              </div>

            </div>

            <div className="h-24"></div> {/* Bottom spacer */}
          </div>
          <Footer />
        </main>
      </div>

      {/* Global styles for custom scrollbar within the app */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
