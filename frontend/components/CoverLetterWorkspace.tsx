"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Download, Sparkle, ArrowLeft, Spinner } from "@phosphor-icons/react";

interface CoverLetterWorkspaceProps {
  resumeText: string;
  jobDescription: string;
  initialCoverLetter?: string;
  initialTone?: "professional" | "confident" | "creative";
  initialWordCount?: number;
  candidateInfo?: { name?: string; email?: string; phone?: string; links?: string[] };
  onBack?: () => void;
}

export function CoverLetterWorkspace({
  resumeText,
  jobDescription,
  initialCoverLetter = "",
  initialTone = "professional",
  initialWordCount = 250,
  candidateInfo = {},
  onBack
}: CoverLetterWorkspaceProps) {
  const [tone, setTone] = useState<"professional" | "confident" | "creative">(initialTone);
  const [wordCount, setWordCount] = useState<number>(initialWordCount);
  const [coverLetter, setCoverLetter] = useState<string>(initialCoverLetter);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Analyzing resume accomplishments...",
    "Aligning qualifications with target job description...",
    "Drafting compelling opening hook...",
    "Refining accomplishments and experiences...",
    "Applying selected tone & structure...",
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    setLoading(true);
    setCoverLetter("");
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
          tone,
          word_count: wordCount,
          candidate_info: candidateInfo,
        }),
      });

      if (!res.ok) throw new Error("API failed to generate cover letter");
      const data = await res.json();
      setCoverLetter(data.cover_letter);
    } catch (err) {
      console.error(err);
      alert("Failed to generate cover letter. Please check your network and API keys.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cover_letter_${tone}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* Configuration Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3 md:py-2 md:px-4 w-full">

        {/* Back Button and Mobile Action Button (aligned at top on mobile) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft size={14} /> Back to Upload
            </button>
          )}

          {/* Mobile only Re-Generate Action */}
          <button
            onClick={handleGenerate}
            disabled={loading || !resumeText || !jobDescription}
            className={`flex md:hidden items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${loading || !resumeText || !jobDescription
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 shadow-sm active:scale-95"
              }`}
          >
            {loading ? (
              <Spinner size={14} className="animate-spin" />
            ) : (
              <>
                <Sparkle size={14} weight="fill" /> Generate
              </>
            )}
          </button>
        </div>

        {/* Selectors Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full md:w-auto">
          {/* Tone Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Tone</span>
            <div className="flex bg-gray-200/50 p-0.5 rounded-md border border-gray-300/30 w-full sm:w-auto justify-between">
              {(["professional", "confident", "creative"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  disabled={loading}
                  className={`flex-1 sm:flex-none px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded transition-all capitalize cursor-pointer ${tone === t
                    ? "bg-white text-gray-900 shadow-sm font-bold"
                    : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Word Count Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Length</span>
            <div className="flex bg-gray-200/50 p-0.5 rounded-md border border-gray-300/30 w-full sm:w-auto justify-between">
              {([150, 250, 350] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setWordCount(w)}
                  disabled={loading}
                  className={`flex-1 sm:flex-none px-2.5 py-1.5 sm:py-1 text-xs font-semibold rounded transition-all cursor-pointer ${wordCount === w
                    ? "bg-white text-gray-900 shadow-sm font-bold"
                    : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {w === 150 ? "Short" : w === 250 ? "Medium" : "Long"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop only Generate Action */}
        <button
          onClick={handleGenerate}
          disabled={loading || !resumeText || !jobDescription}
          className={`hidden md:flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${loading || !resumeText || !jobDescription
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow active:scale-95"
            }`}
        >
          {loading ? (
            <>
              <Spinner size={14} className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkle size={14} weight="fill" /> Re-Generate
            </>
          )}
        </button>
      </div>

      {/* Editor & Document area */}
      <div className="flex-1 flex flex-col items-center">

        {/* Loading Shell */}
        {loading && (
          <div className="w-full max-w-2xl bg-white border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-md p-8 md:p-12 min-h-[500px] flex flex-col gap-6 justify-center items-center text-center">
            <div className="relative w-12 h-12 flex items-center justify-center mb-2">
              <div className="absolute inset-0 rounded-full border-2 border-gray-100"></div>
              <div className="absolute inset-0 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
            </div>
            <div className="space-y-1.5 max-w-xs">
              <p className="text-[13px] font-bold text-gray-900 tracking-tight">Drafting Cover Letter</p>
              <p className="text-xs text-gray-500 font-medium animate-pulse min-h-[16px]">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !coverLetter && (
          <div className="w-full max-w-2xl bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 mb-1">
              <Sparkle size={20} />
            </div>
            <div className="max-w-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-1.5">No Cover Letter Generated Yet</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Choose a tone above and click the button to draft a highly tailored cover letter targeting your missing skills.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="mt-2 text-xs font-bold text-gray-900 border border-gray-300 hover:border-gray-900 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Generate Now
            </button>
          </div>
        )}

        {/* Letterhead Document Mockup */}
        {!loading && coverLetter && (
          <div className="w-full max-w-2xl flex flex-col gap-3">
            {/* Action Bar */}
            <div className="flex justify-end gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer active:scale-95"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Letter
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 shadow-sm text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer active:scale-95"
                title="Download as text file"
              >
                <Download size={14} /> Download (.txt)
              </button>
            </div>

            {/* Paper Container */}
            <div
              className="w-full bg-white border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-md p-5 sm:p-10 md:p-16 min-h-[500px] sm:min-h-[600px] flex flex-col relative transition-all duration-300"
              style={{ backgroundImage: 'radial-gradient(rgba(209, 213, 219, 0.25) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
            >
              {/* Premium A4 Styling Lines */}
              <div className="absolute top-0 left-0 w-full h-[6px] bg-black rounded-t-md"></div>

              {/* Editable Content Area */}
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-full flex-1 min-h-[500px] resize-none border-0 p-0 text-gray-800 leading-relaxed text-[13px] sm:text-[14px] font-medium bg-transparent focus:outline-none focus:ring-0 custom-scrollbar font-sans"
                placeholder="Edit your cover letter here..."
              />
            </div>
            <p className="text-[11px] text-gray-400 font-bold text-center mt-2 uppercase tracking-wider">
              📝 Tip: Click inside the letter above to edit it directly.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
