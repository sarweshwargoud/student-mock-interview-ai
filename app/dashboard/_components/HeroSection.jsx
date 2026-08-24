'use client'

import React from 'react'
import ThreeDCanvas from '../../../components/ui/ThreeDCanvas'
import { ArrowRight, Bot, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Interactive Canvas Background */}
      <ThreeDCanvas />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Floating AI badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-400 text-sm font-semibold mb-8 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Sparkles size={16} />
          <span>Next-Generation AI Interview Coaching</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-400 tracking-tight leading-tight sm:leading-none">
          Elevate Your Performance With <span className="text-indigo-400 font-bold block sm:inline">StudentAI</span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unlock your dream career. Double your interview performance with our advanced, real-time AI mock simulator tailored specifically for student success.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/dashboard"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-all duration-300 hover:bg-indigo-500 hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/how-it-works"
            className="inline-flex items-center justify-center px-8 py-4 font-semibold text-slate-300 border border-slate-700 hover:border-slate-500 bg-slate-900/50 backdrop-blur-md rounded-full hover:text-white transition-all duration-300"
          >
            How It Works
          </a>
        </div>
      </div>
      
      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </div>
  )
}