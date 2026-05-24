"use client";

import { useState, useEffect } from "react";
import { UploadSimple, FilePdf, Sparkle } from "@phosphor-icons/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CoverLetterWorkspace } from "@/components/CoverLetterWorkspace";

export default function CoverLetterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState<"professional" | "confident" | "creative">("professional");
  const [wordCount, setWordCount] = useState<number>(250);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  // States for the active workspace
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [candidateInfo, setCandidateInfo] = useState<any>(null);
  const [hasData, setHasData] = useState(false);

  const loadingMessages = [
    "Reading PDF resume formatting...",
    "Extracting skills and achievements...",
    "Aligning credentials with Job Description...",
    "Drafting customized cover letter details...",
    "Polishing phrasing in selected tone...",
  ];

  // Try to load from session storage on mount
  useEffect(() => {
    const storedResult = sessionStorage.getItem("cvrunner_result");
    const storedJd = sessionStorage.getItem("cvrunner_jd");

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        if (parsedResult.resume_text) {
          setResumeText(parsedResult.resume_text);
          setJobDescription(storedJd || "");
          setCandidateInfo(parsedResult.candidate_info || null);
          // If loaded from previous results, we don't automatically generate the cover letter
          // since the user might want to adjust inputs first, but we prepare the states.
        }
      } catch (err) {
        console.error("Error reading session storage for cover letter:", err);
      }
    }
  }, []);

  // Shimmer loader timing
  useEffect(() => {
    let interval: any;
    if (loading) {
      setProgress(0);
      setLoadingStep(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            clearInterval(interval);
            return 98;
          }
          const next = prev + Math.floor(Math.random() * 8) + 3;
          if (next < 20) setLoadingStep(0);
          else if (next < 40) setLoadingStep(1);
          else if (next < 60) setLoadingStep(2);
          else if (next < 80) setLoadingStep(3);
          else setLoadingStep(4);
          return Math.min(next, 98);
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleDragOver = (e: any) => e.preventDefault();
  const handleDrop = (e: any) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAndGenerate = async () => {
    if (!file || !jd) return;
    setLoading(true);
    setCoverLetter("");

    try {
      // Step 1: Parse the PDF resume text and score
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jd);

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!analyzeRes.ok) throw new Error("Resume parsing failed");
      const analyzeData = await analyzeRes.json();
      const extractedText = analyzeData.resume_text || "";
      const extractedInfo = analyzeData.candidate_info || null;

      // Store in session storage so results page is populated as well
      sessionStorage.setItem("cvrunner_result", JSON.stringify(analyzeData));
      sessionStorage.setItem("cvrunner_jd", jd);
      sessionStorage.setItem("cvrunner_filename", file.name);

      // Step 2: Immediately call cover letter generation API
      const letterRes = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: extractedText,
          job_description: jd,
          tone: tone,
          word_count: wordCount,
          candidate_info: extractedInfo,
        }),
      });

      if (!letterRes.ok) throw new Error("Cover letter generation failed");
      const letterData = await letterRes.json();

      setResumeText(extractedText);
      setJobDescription(jd);
      setCandidateInfo(extractedInfo);
      setCoverLetter(letterData.cover_letter || "");
      setHasData(true);
    } catch (error: any) {
      console.error(error);
      alert(`Failed to complete cover letter generation: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasData(false);
    setResumeText("");
    setJobDescription("");
    setCandidateInfo(null);
    setCoverLetter("");
    setFile(null);
    setJd("");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans flex flex-col justify-between">
      
      <div className="w-full">
        <Navbar />
      </div>

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* Workspace Mode (Direct Response Displayed) */}
        {hasData ? (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-1 text-center sm:text-left mb-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-gray-900">
                Cover Letter Workspace
              </h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Your high-impact customized cover letter is ready.
              </p>
            </div>
            <CoverLetterWorkspace 
              resumeText={resumeText} 
              jobDescription={jobDescription} 
              initialCoverLetter={coverLetter}
              initialTone={tone}
              initialWordCount={wordCount}
              candidateInfo={candidateInfo}
              onBack={handleReset} 
            />
          </div>
        ) : (
          /* Form Upload Mode with Integrated Mood/Tone Selector */
          <div className="max-w-md w-full flex flex-col gap-8 py-4">
            <div className="flex flex-col gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-2 shadow">
                <Sparkle size={20} weight="fill" />
              </div>
              <h1 className="text-3xl font-heading font-black tracking-tight text-gray-900">
                Cover Letter Generator
              </h1>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Upload your resume, paste the target job description, select your tone, and generate a customized cover letter in one step.
              </p>
            </div>

            {/* Upload form container */}
            <div
              className="border border-dashed border-gray-300 rounded-xl p-8 bg-white flex flex-col items-center text-center gap-5 relative group transition-all hover:border-gray-400 shadow-sm hover:shadow-md"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload-cover"
                className="hidden"
                accept=".pdf"
                onChange={(e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); }}
              />

              <label htmlFor="file-upload-cover" className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 mb-1 cursor-pointer hover:scale-105 transition-transform">
                {file ? <FilePdf size={20} weight="fill" className="text-red-500" /> : <UploadSimple size={20} />}
              </label>

              <div>
                <label htmlFor="file-upload-cover" className="text-sm font-semibold text-gray-900 mb-1 cursor-pointer hover:text-gray-600 transition-colors">
                  {file ? file.name : "Upload Your Resume"}
                </label>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">PDF only • Max 5MB</p>
              </div>

              <textarea
                placeholder="Paste the target Job Description or Job Role here (e.g. Frontend Developer) (Required)"
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black focus:outline-none resize-none h-28 bg-gray-50 text-[13px] transition-all"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />

              {/* integrated Mood Selector (Tone) */}
              <div className="flex flex-col gap-2 w-full text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Tone / Mood</span>
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 w-full justify-between">
                  {(["professional", "confident", "creative"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      disabled={loading}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all capitalize cursor-pointer ${
                        tone === t
                          ? "bg-white text-gray-900 shadow-sm border border-gray-200/50 font-bold"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* integrated Word Count Selector */}
              <div className="flex flex-col gap-2 w-full text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Length</span>
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 w-full justify-between">
                  {([150, 250, 350] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWordCount(w)}
                      disabled={loading}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        wordCount === w
                          ? "bg-white text-gray-900 shadow-sm border border-gray-200/50 font-bold"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {w === 150 ? "Short (150w)" : w === 250 ? "Medium (250w)" : "Long (350w)"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUploadAndGenerate}
                className={`w-full py-2.5 rounded-lg font-medium text-sm flex justify-center items-center gap-2 transition-all cursor-pointer ${!file || !jd ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 shadow-sm"}`}
                disabled={!file || !jd || loading}
              >
                {loading ? "Generating Cover Letter..." : <>Generate Cover Letter</>}
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#fafafa]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-2 border-black border-t-transparent border-r-transparent animate-spin" style={{ animationDuration: '0.8s' }}></div>
              <span className="text-[15px] font-bold text-gray-900">{progress}%</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">Creating Cover Letter</h3>
              <p className="text-[12px] text-gray-500 font-medium min-h-[18px]">
                {loadingMessages[loadingStep]}
              </p>
            </div>

            <div className="w-56 h-1 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
              <div className="absolute top-0 bottom-0 left-0 bg-black transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
