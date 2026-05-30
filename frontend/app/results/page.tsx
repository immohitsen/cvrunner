"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, WarningCircle, FilePdf, Article, ListChecks } from "@phosphor-icons/react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MetricsVisualization } from "@/components/MetricsVisualization";
import { CoverLetterWorkspace } from "@/components/CoverLetterWorkspace";

export default function Results() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [jd, setJd] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"report" | "cover-letter" | "context">("report");

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

      {/* Centralized Navigation Header */}
      <Navbar />

      {/* Mobile Tab Bar */}
      <div className="flex border-b border-gray-200 md:hidden bg-white shrink-0 z-20">
        <button
          onClick={() => setActiveTab("report")}
          className={`flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "report"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          ATS Report
        </button>
        <button
          onClick={() => setActiveTab("cover-letter")}
          className={`flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "cover-letter"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Cover Letter
        </button>
        <button
          onClick={() => setActiveTab("context")}
          className={`flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "context"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Context
        </button>
      </div>

      {/* Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Context (Hidden on mobile unless context tab selected) */}
        <aside className={`${
          activeTab === "context" ? "flex" : "hidden"
        } md:flex w-full md:w-[320px] lg:w-[380px] shrink-0 border-r border-gray-200 bg-white flex-col h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Input Context</h3>

              {/* Uploaded File Item */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-start gap-4 mb-4">
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
                  <span className="text-[13px] font-bold">Target JD / Job Role</span>
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

        {/* Main Work Area */}
        <main className={`${
          activeTab === "report" || activeTab === "cover-letter" ? "block" : "hidden"
        } md:block overflow-y-auto flex-1 h-full relative bg-[#fbfbfb]`}
          style={{ backgroundImage: 'radial-gradient(rgba(209, 213, 219, 0.4) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>

          <div className="max-w-4xl mx-auto my-4 md:my-12 px-4 md:px-6 relative z-10">

            {/* Desktop-only Tab Switcher */}
            <div className="hidden md:flex gap-6 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("report")}
                className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "report"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                ATS Performance Report
              </button>
              <button
                onClick={() => setActiveTab("cover-letter")}
                className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === "cover-letter"
                    ? "border-black text-black"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Tailored Cover Letter
              </button>
            </div>

            {activeTab === "report" ? (
              /* The A4 Document Container for Report */
              <div className="bg-white rounded-md border border-gray-200/60 p-5 sm:p-8 md:p-16 min-h-[800px] shadow-sm animate-in fade-in duration-300">

                {/* Document Header */}
                <div className="mb-8 md:mb-12">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 tracking-tight leading-tight mb-6 md:mb-8">
                    Resume Optimization & <br className="hidden md:inline" />ATS Fitness Report, {date}
                  </h1>

                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Executive Summary</h2>
                  <p className="text-[14px] md:text-[15px] text-gray-700 leading-relaxed font-medium">
                    The submitted resume achieved an overall ATS compatibility score of <strong>{data.resume_score}/100</strong>.
                    {data.resume_score > 75
                      ? " The document demonstrates strong alignment with the target job description, featuring clear impact statements and relevant skills. Some minor optimizations are recommended before submission."
                      : " The document requires substantial revision to meet the expectations of the target job description. Critical missing skills and structural improvements have been identified below."}
                  </p>
                </div>

                {/* SVG Visual Metrics snapshot */}
                <div className="mb-8 md:mb-12">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Metrics Snapshot</h2>
                  <MetricsVisualization
                    metrics={{
                      impact: data.metrics?.impact || 0,
                      brevity: data.metrics?.brevity || 0,
                      style: data.metrics?.style || 0,
                      skills: data.metrics?.skills || 0,
                    }}
                    overallScore={data.resume_score || 0}
                  />
                </div>

                {/* Skill Drivers */}
                <div className="mb-8 md:mb-12">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Skill Alignment</h2>
                  <p className="text-[12px] md:text-[13px] text-gray-500 mb-4 md:mb-6 font-medium">Reflects extracted technical competencies vs required competencies.</p>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    {/* Missing */}
                    <div className="bg-white border border-gray-200 rounded-md p-4 md:p-6">
                      <h3 className="text-[12px] md:text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                        <WarningCircle size={16} className="text-red-500" weight="fill" /> Critical Missing
                      </h3>
                      {data.missing_skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {data.missing_skills.map((skill: string, idx: number) => (
                            <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-700 text-[11px] md:text-[12px] font-semibold rounded border border-red-100">{skill}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] md:text-[13px] text-gray-500 font-medium">No missing technical skills.</p>
                      )}
                    </div>

                    {/* Matched */}
                    <div className="bg-white border border-gray-200 rounded-md p-4 md:p-6">
                      <h3 className="text-[12px] md:text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" weight="fill" /> Extracted
                      </h3>
                      {data.extracted_skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {data.extracted_skills.map((skill: string, idx: number) => (
                            <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] md:text-[12px] font-semibold rounded border border-gray-200">{skill}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] md:text-[13px] text-gray-500 font-medium">No skills detected.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                    <ListChecks size={24} className="text-blue-600" /> Recommended Actions
                  </h2>
                  <div className="space-y-4 md:space-y-6">
                    {data.ai_suggestions?.map((sug: any, idx: number) => {
                      const isObject = typeof sug === 'object' && sug !== null;
                      const section = isObject ? sug.section : "General";
                      const issue = isObject ? sug.issue : sug;
                      const fix = isObject ? sug.fix : null;
                      const before = isObject ? sug.before : null;
                      const after = isObject ? sug.after : null;

                      return (
                        <div key={idx} className="border border-gray-200/80 rounded-md p-4 md:p-6 bg-[#FCFDFE] flex flex-col gap-3 md:gap-4 ">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] md:text-[11px] font-bold shrink-0">
                                {idx + 1}
                              </div>
                              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100/80 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-gray-200/40">
                                {section || "General"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1 md:space-y-2">
                            <h4 className="text-[13px] md:text-[14px] font-bold text-gray-900 leading-snug">
                              {issue}
                            </h4>
                            {fix && (
                              <p className="text-[12px] md:text-[13px] text-gray-600 font-medium">
                                <strong className="text-gray-900">Fix: </strong>{fix}
                              </p>
                            )}
                          </div>

                          {before && after && (
                            <div className="grid md:grid-cols-2 gap-3 mt-1 text-[11px] md:text-[12px] font-medium leading-relaxed">
                              <div className="bg-red-50/40 border border-red-100/80 rounded-lg p-3 md:p-3.5 text-red-800">
                                <span className="block text-[8px] md:text-[9px] font-bold text-red-500 uppercase tracking-wider mb-1 md:mb-1.5">Original Draft</span>
                                <span className="italic">"{before}"</span>
                              </div>
                              <div className="bg-green-50/40 border border-green-100/80 rounded-lg p-3 md:p-3.5 text-green-800">
                                <span className="block text-[8px] md:text-[9px] font-bold text-green-600 uppercase tracking-wider mb-1 md:mb-1.5">ATS-Optimized Version</span>
                                <span>"{after}"</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              /* Cover Letter Workspace View */
              <div className="bg-white rounded-md border border-gray-200/60 p-4 sm:p-6 md:p-10 shadow-sm animate-in fade-in duration-300">
                <div className="flex flex-col gap-1 mb-6 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-gray-900">
                    Draft Tailored Cover Letter
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Use AI to write a high-converting cover letter based on your score results.
                  </p>
                </div>
                <CoverLetterWorkspace 
                  resumeText={data.resume_text || ""} 
                  jobDescription={jd} 
                  candidateInfo={data.candidate_info || null}
                />
              </div>
            )}

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
