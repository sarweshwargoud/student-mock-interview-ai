import { SignIn } from "@clerk/nextjs";
import { Bot, CheckCircle2, Sparkles, FileText, Mic, Trophy } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="w-full grid lg:grid-cols-12 min-h-screen">
        {/* Left Branding Hero Section */}
        <section className="relative hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-12 bg-slate-950 text-white overflow-hidden">
          {/* Background Image with Overlay */}
          <img
            alt="Interview Preparation"
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-indigo-950/60" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white group">
              <div className="p-2 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">Interview Guru</span>
            </Link>
          </div>

          {/* Center Pitch */}
          <div className="relative z-10 max-w-xl my-auto py-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI-Powered Mock Interview Platform
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Master Your Next Job Interview with Real-Time AI Coaching
            </h1>

            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              Practice realistic technical and behavioral interviews tailored specifically to your target job role or uploaded resume. Get instant constructive feedback and score breakdown.
            </p>

            {/* Feature highlights list */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Upload PDF/DOCX resumes for instant custom interview questions</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
                  <Mic className="w-4 h-4" />
                </div>
                <span>Speech-to-text voice answer recording with webcam simulator</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="p-1 rounded-full bg-amber-500/20 text-amber-400">
                  <Trophy className="w-4 h-4" />
                </div>
                <span>AI score evaluations, model answers, and improvement suggestions</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Interview Guru. All rights reserved.
          </div>
        </section>

        {/* Right Sign In Form — Centered Middle */}
        <main className="flex items-center justify-center p-6 sm:p-12 lg:col-span-6 xl:col-span-5 bg-white dark:bg-slate-950">
          <div className="w-full max-w-md flex flex-col items-center justify-center">
            {/* Mobile Branding Header */}
            <div className="lg:hidden text-center mb-6">
              <Link href="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-white mb-2">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-xl">Interview Guru</span>
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-Powered Mock Interview Platform
              </p>
            </div>

            {/* Clerk Sign In Component */}
            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}
