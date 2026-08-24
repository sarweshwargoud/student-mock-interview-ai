'use client'

import React from "react";
import { Bot, UserCheck, Settings, Play, Send, ChartBar, Repeat } from "lucide-react";
import TiltCard from "../../components/ui/TiltCard";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <UserCheck size={36} className="text-indigo-400" />,
      title: "Sign Up & Profiles",
      description: "Create an account or log in via Clerk. Establish your profile to track interview history and build custom templates."
    },
    {
      icon: <Settings size={36} className="text-indigo-400" />,
      title: "Configure Mock Session",
      description: "Select from tech, behavioral, or mixed interviews. Customize years of experience, target role, and job description specs."
    },
    {
      icon: <Play size={36} className="text-indigo-400" />,
      title: "Interactive Simulator",
      description: "Our AI generates dynamic, contextually relevant interview questions powered by Gemini. Focus on one question at a time."
    },
    {
      icon: <Send size={36} className="text-indigo-400" />,
      title: "Submit Response",
      description: "Record your answers using text inputs or voice transcription support. The interface captures and processes responses smoothly."
    },
    {
      icon: <ChartBar size={36} className="text-indigo-400" />,
      title: "Detailed AI Scoring",
      description: "Get immediate feedback. The AI rates your answers out of 10 and outlines precise phrasing updates and model answers."
    },
    {
      icon: <Repeat size={36} className="text-indigo-400" />,
      title: "Iterative Improvement",
      description: "Review history, repeat sessions, and monitor your score curves. Adaptation guarantees you grow with every mock."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-400 tracking-tight leading-tight flex items-center justify-center gap-4">
            <Bot className="text-indigo-400" size={48} />
            How Interview Guru Works
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Master engineering and technical recruitment panels with personalized mock iterations and AI scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <TiltCard 
              key={step.title} 
              className="bg-slate-900/30 border-slate-800/80 hover:border-indigo-500/30 p-8 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-950/50 border border-indigo-500/20 rounded-2xl">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Step {index + 1}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mb-4">
                  {step.title}
                </h2>
                <p className="text-slate-400 leading-relaxed text-sm">{step.description}</p>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="text-center mt-16">
          <a 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            Start Your Interview Journey
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;