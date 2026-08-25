"use client";
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LoaderCircle,
  Sparkles,
  FileText,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ── Constants ──────────────────────────────────────────────────────────────

const JOB_ROLE_SUGGESTIONS = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Software Engineer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Cloud Engineer",
  "Mobile App Developer",
  "UI/UX Designer",
];

const TECH_STACK_SUGGESTIONS = {
  "Full Stack Developer": "React, Node.js, Express, MongoDB, TypeScript",
  "Frontend Developer": "React, Vue.js, Angular, TypeScript, Tailwind CSS",
  "Backend Developer": "Python, Django, Flask, Java Spring, PostgreSQL",
  "Software Engineer": "Java, C++, Python, AWS, Microservices",
  "DevOps Engineer": "Docker, Kubernetes, Jenkins, AWS, Azure",
  "Data Scientist": "Python, TensorFlow, PyTorch, Pandas, NumPy",
  "Machine Learning Engineer": "Python, scikit-learn, Keras, TensorFlow",
  "Cloud Engineer": "AWS, Azure, GCP, Terraform, Kubernetes",
  "Mobile App Developer": "React Native, Flutter, Swift, Kotlin",
  "UI/UX Designer": "Figma, Sketch, Adobe XD, InVision",
};

const MAX_FILE_MB = 5;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// ── Difficulty selector (shared between both tabs) ─────────────────────────

function DifficultySelect({ value, onChange }) {
  return (
    <div className="my-3">
      <label className="text-sm font-medium text-foreground">
        Difficulty Level
      </label>
      <select
        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("manual"); // "manual" | "resume"

  // Manual-mode state
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");

  // Resume-mode state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeDifficulty, setResumeDifficulty] = useState("Medium");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  // ── Helpers ──────────────────────────────────────────────────────────────

  const resetDialog = () => {
    setMode("manual");
    setJobPosition("");
    setJobDescription("");
    setJobExperience("");
    setDifficulty("Medium");
    setResumeFile(null);
    setResumeDifficulty("Medium");
    setIsDragging(false);
  };

  const autoSuggestTechStack = (role) => {
    const suggestion = TECH_STACK_SUGGESTIONS[role];
    if (suggestion) {
      setJobDescription(suggestion);
      toast.info(`Auto-filled tech stack for ${role}`);
    }
  };

  // ── File validation ───────────────────────────────────────────────────────

  const validateAndSetFile = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(ext)) {
      toast.error("Only PDF and DOCX files are accepted.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`File must be smaller than ${MAX_FILE_MB} MB.`);
      return;
    }
    setResumeFile(file);
  };

  const handleFileInput = (e) => validateAndSetFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  // ── Submit: manual ────────────────────────────────────────────────────────

  const onManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/interviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition,
          jobDesc: jobDescription,
          jobExperience,
          difficulty,
          userEmail: user?.primaryEmailAddress?.emailAddress || "",
        }),
      });

      if (response.ok) {
        const res = await response.json();
        toast.success("Interview questions generated successfully!");
        setOpenDialog(false);
        resetDialog();
        router.push(`/dashboard/interview/${res.mockId}`);
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.detail || "Failed to generate questions");
      }
    } catch (error) {
      console.error("Error generating interview:", error);
      toast.error(error.message || "Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit: resume ────────────────────────────────────────────────────────

  const onResumeSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please upload your resume first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", resumeFile);
      formData.append("userEmail", user?.primaryEmailAddress?.emailAddress || "");
      formData.append("difficulty", resumeDifficulty);

      const response = await fetch(`${API_URL}/api/interviews/from-resume`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const res = await response.json();
        toast.success("Resume analysed — interview ready!");
        setOpenDialog(false);
        resetDialog();
        router.push(`/dashboard/interview/${res.mockId}`);
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || err.error || "Failed to process resume.");
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error(error.message || "Failed to process resume.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Trigger card */}
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h1 className="font-bold text-lg text-center">+ Add New</h1>
      </div>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) resetDialog();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Create Your Interview Preparation
            </DialogTitle>
          </DialogHeader>

          {/* ── Mode toggle ─────────────────────────────────────────────── */}
          <div className="flex rounded-lg border border-border overflow-hidden mt-1 mb-4">
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors
                ${mode === "manual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
                }`}
            >
              <Sparkles className="w-4 h-4" />
              Manual
            </button>
            <button
              type="button"
              onClick={() => setMode("resume")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors
                ${mode === "resume"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
                }`}
            >
              <FileText className="w-4 h-4" />
              From Resume
            </button>
          </div>

          <DialogDescription asChild>
            <div>
              {/* ══════════════════════════════════════════════════════════ */}
              {/*  MANUAL TAB                                                */}
              {/* ══════════════════════════════════════════════════════════ */}
              {mode === "manual" && (
                <form onSubmit={onManualSubmit} className="space-y-3">
                  <div className="my-3">
                    <label className="text-sm font-medium text-foreground">
                      Job Role / Position
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        placeholder="Ex. Full Stack Developer"
                        value={jobPosition}
                        required
                        onChange={(e) => setJobPosition(e.target.value)}
                        list="jobRoles"
                      />
                      <datalist id="jobRoles">
                        {JOB_ROLE_SUGGESTIONS.map((role) => (
                          <option key={role} value={role} />
                        ))}
                      </datalist>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Auto-fill tech stack"
                        onClick={() => autoSuggestTechStack(jobPosition)}
                        disabled={!jobPosition}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="my-3">
                    <label className="text-sm font-medium text-foreground">
                      Job Description / Tech Stack
                    </label>
                    <Textarea
                      className="mt-1"
                      placeholder="Ex. React, Angular, NodeJs, MySql etc"
                      value={jobDescription}
                      required
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  <div className="my-3">
                    <label className="text-sm font-medium text-foreground">
                      Years of Experience
                    </label>
                    <Input
                      className="mt-1"
                      placeholder="Ex. 5"
                      type="number"
                      min="0"
                      max="70"
                      value={jobExperience}
                      required
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>

                  <DifficultySelect value={difficulty} onChange={setDifficulty} />

                  <div className="flex gap-3 justify-end pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                          Generating…
                        </>
                      ) : (
                        "Start Interview"
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* ══════════════════════════════════════════════════════════ */}
              {/*  RESUME TAB                                                */}
              {/* ══════════════════════════════════════════════════════════ */}
              {mode === "resume" && (
                <form onSubmit={onResumeSubmit} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload your resume and our AI will automatically extract your
                    role, skills, and experience — then generate 5 personalised
                    interview questions just for you.
                  </p>

                  {/* Drop zone */}
                  {!resumeFile ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors
                        ${isDragging
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/40"
                        }`}
                    >
                      <div className="p-4 rounded-full bg-primary/10">
                        <Upload className="h-7 w-7 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm text-foreground">
                          Drag &amp; drop your resume here
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          or <span className="text-primary underline">browse files</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Supported: PDF, DOCX &nbsp;·&nbsp; Max {MAX_FILE_MB} MB
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </div>
                  ) : (
                    /* File preview card */
                    <div className="flex items-center gap-3 border rounded-xl p-4 bg-muted/30">
                      <div className="p-2.5 rounded-lg bg-green-100">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(resumeFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => setResumeFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <DifficultySelect
                    value={resumeDifficulty}
                    onChange={setResumeDifficulty}
                  />

                  <div className="flex gap-3 justify-end pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !resumeFile}
                    >
                      {loading ? (
                        <>
                          <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                          Analysing Resume…
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Generate Interview
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;