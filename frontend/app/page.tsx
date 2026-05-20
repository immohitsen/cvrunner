"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadSimple, FilePdf, CheckCircle, WarningCircle, UserCircle, Star, ArrowRight, List, X } from "@phosphor-icons/react";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { EncryptedText } from "@/components/ui/encrypted-text";


export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDragOver = (e: any) => e.preventDefault();
  const handleDrop = (e: any) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jd) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jd);

      const res = await fetch("http://127.0.0.1:8000/api/v1/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      sessionStorage.setItem("cvrunner_result", JSON.stringify(data));
      sessionStorage.setItem("cvrunner_jd", jd);
      sessionStorage.setItem("cvrunner_filename", file.name);
      router.push("/results");
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume. Make sure your Python backend is running!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans">
      <nav className="relative flex items-center justify-between px-8 py-5 max-w-7xl mx-auto border-b border-gray-200/50 z-30 bg-[#fafafa]">
        <div className="text-xl font-heading font-bold text-gray-900 tracking-tighter">CVRunner</div>
        
        {/* Desktop Nav */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex gap-8 text-[13px] font-medium text-gray-500">
          <a href="/" className="text-gray-900 transition-colors">Home</a>
          <a href="/about" className="hover:text-gray-900 transition-colors">About</a>
        </div>
        
        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden text-gray-500 hover:text-gray-900 p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-sm flex flex-col p-4 md:hidden gap-4">
            <a href="/" className="text-[14px] font-medium text-gray-900">Home</a>
            <a href="/about" className="text-[14px] font-medium text-gray-500">About</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-24 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column: Action */}
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl md:text-[4rem] font-heading font-bold leading-[1.05] text-[#111827] tracking-tighter">
            Optimize your resume for ATS &
            <PointerHighlight
              rectangleClassName="bg-gray-100 border-gray-200"
              pointerClassName="text-black"
            ><span className="relative z-10 text-gray-400"> Recruiters.</span></PointerHighlight>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
            Analyze your resume against real hiring standards with AI-powered feedback, keyword matching, and improvement suggestions.
          </p>

          {/* Upload Box */}
          <div
            className="border border-dashed border-gray-300 rounded-xl p-8 bg-white flex flex-col items-center text-center gap-4 relative group transition-all hover:border-gray-400 shadow-sm hover:shadow-md"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf"
              onChange={(e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); }}
            />

            <label htmlFor="file-upload" className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 mb-1 cursor-pointer hover:scale-105 transition-transform">
              {file ? <FilePdf size={20} weight="fill" className="text-red-500" /> : <UploadSimple size={20} />}
            </label>

            <div>
              <label htmlFor="file-upload" className="text-sm font-semibold text-gray-900 mb-1 cursor-pointer hover:text-gray-600 transition-colors">
                {file ? file.name : "Upload Your Resume"}
              </label>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">PDF only • Max 5MB</p>
            </div>

            <textarea
              placeholder="Paste the target Job Description here (Required)"
              className="w-full mt-3 p-4 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black focus:outline-none resize-none h-28 bg-gray-50 text-[13px] transition-all"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />

            <button
              onClick={handleAnalyze}
              className={`w-full py-2.5 rounded-lg font-medium text-sm flex justify-center items-center gap-2 transition-all ${!file || !jd ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 shadow-sm"}`}
              disabled={!file || !jd || loading}
            >
              {loading ? "Analyzing Document..." : <> Analyze Resume</>}
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#fafafa] bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt={`User ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-xs">
              <p className="text-gray-500"><span className="font-medium text-gray-900">Trusted by 1,000+</span> professionals globally.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Monochromatic Mockup */}
        <div className="relative hidden md:block">
          <div className="bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden transform relative z-10 w-[105%] -right-[5%]">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              </div>
              <div className="mx-auto bg-white border border-gray-200 rounded text-[10px] font-medium text-gray-500 px-16 py-1 flex items-center gap-2 shadow-sm">
                <CheckCircle size={12} className="text-gray-400" /> analysis_complete.json
              </div>
            </div>

            <div className="relative bg-gray-50/50">
              <div className="py-6 px-8 grid grid-cols-2 md:grid-cols-4 gap-3 overflow-hidden h-[350px]">
                {[...Array(8)].map((_, i) => (
                  <img
                    key={i}
                    src="/resume.png"
                    alt="Resume Analysis Preview"
                    className="w-full h-full object-cover object-top opacity-50"
                  />
                ))}
              </div>

              {/* Sleek fade effect at the bottom to make the grid look endless */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none"></div>

              {/* Floating AI processing badge */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-5 py-2.5 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-black animate-pulse"></div>
                  <div className="w-1 h-1 rounded-full bg-black animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 rounded-full bg-black animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
                <EncryptedText
                  text="Processing Batch"
                  encryptedClassName="text-gray-500 font-semibold text-sm"
                  revealedClassName="text-black font-semibold text-sm"
                  revealDelayMs={250}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
