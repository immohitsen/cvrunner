"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, WarningCircle, ArrowLeft, FilePdf, Article, ListChecks, List, X } from "@phosphor-icons/react";

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [jd, setJd] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("cvrunner_result");
    const storedJd = sessionStorage.getItem("cvrunner_jd");
    const storedFilename = sessionStorage.getItem("cvrunner_filename");
    
    if (!storedData) {
      router.push("/");
    } else {
      setData(JSON.parse(storedData));
      setJd(storedJd || "Job description not provided.");
      setFilename(storedFilename || "resume.pdf");
    }
  }, [router]);

  if (!data) return <div className="h-screen w-full bg-[#F8F9FA] flex items-center justify-center font-sans"><div className="w-8 h-8 border-4 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div></div>;

  const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white text-gray-900 font-sans">
      
      {/* Navbar (Restored Top Menu) */}
      <nav className="relative flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white shrink-0 z-30">
        <div className="text-xl font-heading font-bold text-gray-900 tracking-tighter">CVRunner</div>
        
        {/* Desktop Nav */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex gap-8 text-[13px] font-medium text-gray-500">
          <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
          <a href="/about" className="hover:text-gray-900 transition-colors">About</a>
        </div>
        
        <div className="hidden md:flex">
          <button onClick={() => router.push("/")} className="text-[13px] font-medium text-gray-500 hover:text-black flex items-center gap-1.5 transition-colors bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
            <ArrowLeft size={14} /> Analyze Another
          </button>
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
            <div className="h-px w-full bg-gray-100 my-2"></div>
            <button onClick={() => router.push("/")} className="text-[14px] font-medium text-gray-900 flex items-center gap-1.5 text-left">
              <ArrowLeft size={14} /> Analyze Another
            </button>
          </div>
        )}
      </nav>

      {/* Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Context */}
        <aside className="w-[320px] lg:w-[380px] shrink-0 border-r border-gray-200 bg-white flex flex-col h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Input Context</h3>
            
            {/* Uploaded File Item */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-start gap-4 mb-4">
               <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                 <FilePdf size={24} weight="fill" className="text-red-500" />
               </div>
               <div>
                 <p className="text-[14px] font-semibold text-gray-900 line-clamp-1">{filename}</p>
                 <p className="text-[12px] text-gray-500 mt-0.5">Analyzed successfully</p>
               </div>
            </div>

            {/* Target JD Item */}
            <div className="bg-[#F8F9FA] border border-gray-200 rounded-lg p-4 flex flex-col h-[280px]">
               <div className="flex items-center gap-2 mb-3 text-gray-700">
                 <Article size={18} weight="fill" />
                 <span className="text-[13px] font-bold">Target Job Description</span>
               </div>
               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
                   {jd}
                 </p>
               </div>
            </div>
          </div>
          
          <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Report Status</h3>
             <div className="flex items-center gap-3">
               <div className="flex relative">
                 <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center z-10">
                   <CheckCircle size={16} weight="fill" className="text-green-600" />
                 </div>
               </div>
               <div>
                 <p className="text-[13px] font-semibold text-gray-900">Report Generated</p>
                 <p className="text-[11px] text-gray-500">Ready for review</p>
               </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Right Canvas: The Document */}
      <main className="flex-1 h-full overflow-y-auto relative bg-[#fbfbfb]">
        {/* Dotted background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40" 
             style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        <div className="max-w-4xl mx-auto my-12 relative z-10">
          
          {/* The A4 Document Container */}
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200/60 p-12 md:p-16 min-h-[800px]">
             
             {/* Document Header */}
             <div className="mb-12">
               <h1 className="text-4xl font-heading font-bold text-gray-900 tracking-tight leading-tight mb-8">
                 Resume Optimization & <br/>ATS Fitness Report, {date}
               </h1>
               
               <h2 className="text-xl font-bold text-gray-900 mb-3">Executive Summary</h2>
               <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
                 The submitted resume achieved an overall ATS compatibility score of <strong>{data.resume_score}/100</strong>. 
                 {data.resume_score > 75 
                   ? " The document demonstrates strong alignment with the target job description, featuring clear impact statements and relevant skills. Some minor optimizations are recommended before submission."
                   : " The document requires substantial revision to meet the expectations of the target job description. Critical missing skills and structural improvements have been identified below."}
               </p>
             </div>

             {/* Portfolio Snapshot (Metrics Grid) */}
             <div className="mb-12">
               <h2 className="text-xl font-bold text-gray-900 mb-6">Metrics Snapshot</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 
                 <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-32 bg-[#F8F9FA]">
                   <span className="text-[13px] font-medium text-gray-500">Impact Score</span>
                   <div>
                     <p className="text-3xl font-medium text-gray-900 mb-1">{data.metrics?.impact || 0}</p>
                     <p className="text-[11px] text-gray-500">Action verbs & metrics</p>
                   </div>
                 </div>

                 <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-32 bg-[#F8F9FA]">
                   <span className="text-[13px] font-medium text-gray-500">Brevity Score</span>
                   <div>
                     <p className="text-3xl font-medium text-gray-900 mb-1">{data.metrics?.brevity || 0}</p>
                     <p className="text-[11px] text-gray-500">Readability & length</p>
                   </div>
                 </div>

                 <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-32 bg-[#F8F9FA]">
                   <span className="text-[13px] font-medium text-gray-500">Style Score</span>
                   <div>
                     <p className="text-3xl font-medium text-gray-900 mb-1">{data.metrics?.style || 0}</p>
                     <p className="text-[11px] text-gray-500">Formatting consistency</p>
                   </div>
                 </div>

                 <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-32 bg-[#F8F9FA]">
                   <span className="text-[13px] font-medium text-gray-500">Skills Match</span>
                   <div>
                     <p className="text-3xl font-medium text-gray-900 mb-1">{data.metrics?.skills || 0}</p>
                     <p className="text-[11px] text-gray-500">JD keyword alignment</p>
                   </div>
                 </div>

               </div>
             </div>

             {/* Skill Drivers */}
             <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Skill Alignment</h2>
                <p className="text-[13px] text-gray-500 mb-6 font-medium">Reflects extracted technical competencies vs required competencies.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Missing */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <WarningCircle size={16} className="text-red-500" weight="fill" /> Critical Missing
                    </h3>
                    {data.missing_skills.length > 0 ? (
                       <div className="flex flex-wrap gap-2">
                         {data.missing_skills.map((skill: string, idx: number) => (
                           <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 text-[12px] font-semibold rounded border border-red-100">{skill}</span>
                         ))}
                       </div>
                    ) : (
                      <p className="text-[13px] text-gray-500 font-medium">No missing technical skills.</p>
                    )}
                  </div>
                  
                  {/* Matched */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" weight="fill" /> Extracted
                    </h3>
                    {data.extracted_skills.length > 0 ? (
                       <div className="flex flex-wrap gap-2">
                         {data.extracted_skills.map((skill: string, idx: number) => (
                           <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-[12px] font-semibold rounded border border-gray-200">{skill}</span>
                         ))}
                       </div>
                    ) : (
                      <p className="text-[13px] text-gray-500 font-medium">No skills detected.</p>
                    )}
                  </div>
                </div>
             </div>

             {/* Recommended Actions */}
             <div>
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <ListChecks size={24} className="text-blue-600" /> Recommended Actions
               </h2>
               <div className="space-y-4">
                 {data.ai_suggestions.map((sug: string, idx: number) => (
                   <div key={idx} className="flex gap-4 p-5 bg-blue-50/30 rounded-xl border border-blue-100/50 items-start">
                     <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                       <span className="text-[11px] font-bold text-blue-700">{idx + 1}</span>
                     </div>
                     <p className="text-[14px] text-gray-800 leading-relaxed font-medium">{sug}</p>
                   </div>
                 ))}
               </div>
             </div>

          </div>
          
          <div className="h-24"></div> {/* Bottom spacer */}
        </div>
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
