"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [patientName, setPatientName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const setSelectedFile = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onDropZoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientName", patientName || "Anonymous");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Store result and local preview for the result page
        sessionStorage.setItem("lastAnalysis", JSON.stringify({
            ...result,
            localPreview: preview
        }));
        router.push("/result");
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        
        // Show specific error if available, else fallback
        const errorMessage = errorData.detail || errorData.error || "Wrong image uploaded or service unavailable.";
        
        Swal.fire({
          title: "Upload Failed",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#2e7d32",
          confirmButtonText: "Try Again"
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        title: "Connection Error",
        text: "Could not connect to the clinical server.",
        icon: "warning"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-50/30 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue-light/50 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-teal-light/50 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-xl animate-fade-in-up">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Diagnostic Portal</h1>
          <p className="text-slate-500 font-medium text-lg">Secure high-resolution retina scan upload.</p>
        </div>

        <div className="clinical-card p-2 group">
          <div className="bg-white rounded-[12px] p-12 transition-all">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-3">
                 <label htmlFor="patient-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Patient Full Name
                 </label>
                 <input
                    id="patient-name"
                    type="text"
                    required
                    placeholder="Enter full name for the report"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-accent-primary/30 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300 shadow-inner"
                 />
              </div>

              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className="relative"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.dicom"
                  onChange={handleFileChange}
                  className="sr-only"
                  id="file-upload"
                  aria-describedby="file-upload-help file-upload-status"
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openFilePicker}
                  onKeyDown={onDropZoneKeyDown}
                  aria-label={file ? `Selected file ${file.name}. Press Enter or Space to choose a different retina scan.` : "Choose or drop a retina scan image"}
                  aria-describedby="file-upload-help file-upload-status"
                  className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-[1rem] cursor-pointer transition-all duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-primary/30 focus-visible:border-accent-primary ${
                    isDragging 
                      ? 'border-accent-primary bg-accent-primary/5 scale-[1.01]' 
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-accent-primary/30'
                  }`}
                >
                  {!file ? (
                    <div className="flex flex-col items-center text-center px-10 space-y-6">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-accent-primary">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black text-slate-800 tracking-tight">
                          {isDragging ? 'Release to upload' : 'Upload Scan imagery'}
                        </p>
                        <p id="file-upload-help" className="text-xs text-slate-600 font-bold uppercase tracking-[0.2em]">Supported: .DICOM, .JPG, .PNG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-10 space-y-8 animate-fade-in">
                       <div className="w-24 h-24 rounded-3xl bg-accent-primary flex items-center justify-center text-white shadow-xl shadow-accent-primary/30 border-4 border-white">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <div className="space-y-2">
                          <p className="text-xl font-black text-slate-900 truncate max-w-sm">{file.name}</p>
                          <p className="text-[10px] font-black uppercase text-accent-primary tracking-[0.2em]">
                            Press Enter or Space to replace file
                          </p>
                       </div>
                    </div>
                  )}
                </div>
                <p id="file-upload-status" className="sr-only" aria-live="polite">
                  {file ? `${file.name} selected for analysis.` : "No retina scan selected."}
                </p>
                {file && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="mt-4 text-[10px] font-black uppercase text-accent-primary hover:text-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 focus-visible:ring-offset-2 tracking-[0.2em] transition-colors"
                    aria-label={`Remove selected file ${file.name}`}
                  >
                    Remove File Selection
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!file || uploading}
                className="clinical-btn w-full !py-6 text-xl shadow-xl shadow-accent-primary/20"
                aria-label={uploading ? "Analysis upload in progress" : "Execute retina scan analysis"}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-4">
                    <svg className="animate-spin h-7 w-7 text-white" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Neural Engine active...
                  </span>
                ) : (
                  "Execute Analysis"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* New Submission Guidelines Section */}
        <div className="mt-10 clinical-card p-1 bg-white/50 border-slate-200">
           <div className="bg-white/80 rounded-[12px] p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                 <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Scan Submission Guidelines</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed">
                 <div className="space-y-2">
                    <p className="font-black text-slate-800 uppercase tracking-tighter">Required Image Type</p>
                    <ul className="space-y-1.5 text-slate-500 font-medium">
                       <li className="flex gap-2">
                          <span className="text-accent-primary font-bold">✓</span>
                          Professional Fundus Photograph (Retinal Scan)
                       </li>
                       <li className="flex gap-2">
                          <span className="text-accent-primary font-bold">✓</span>
                          High-resolution digital output (.JPG, .PNG, .DICOM)
                       </li>
                       <li className="flex gap-2">
                          <span className="text-accent-primary font-bold">✓</span>
                          Clear visibility of Optic Disc and Macula
                       </li>
                    </ul>
                 </div>
                 <div className="space-y-2">
                    <p className="font-black text-slate-800 uppercase tracking-tighter">Prohibited Imagery</p>
                    <ul className="space-y-1.5 text-slate-500 font-medium">
                       <li className="flex gap-2">
                          <span className="text-red-500 font-bold">✕</span>
                          Standard smartphone selfies or external eye photos
                       </li>
                       <li className="flex gap-2">
                          <span className="text-red-500 font-bold">✕</span>
                          Low-quality or blurry scans
                       </li>
                       <li className="flex gap-2">
                          <span className="text-red-500 font-bold">✕</span>
                          Non-biological graphics or text-only images
                       </li>
                    </ul>
                 </div>
              </div>
              <div className="pt-2">
                 <p className="text-[10px] text-slate-400 font-medium italic">
                    Note: The Neural Engine will automatically reject non-retinal or low-quality imagery to maintain clinical integrity.
                 </p>
              </div>
           </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-10 opacity-50">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">End-to-End Encrypted</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Clinical v4.2.0</span>
           </div>
        </div>
      </div>
    </main>
  );
}
