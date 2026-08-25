"use client";
import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const textToSpeach = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
        <div>
          {/* Question number pill tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {mockInterviewQuestion.map((question, index) => (
              <span
                key={index}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  activeQuestionIndex === index
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Question #{index + 1}
              </span>
            ))}
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {mockInterviewQuestion[activeQuestionIndex]?.question}
            </h2>

            {/* Audio speech button */}
            <button
              type="button"
              onClick={() =>
                textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)
              }
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Listen to Question</span>
            </button>
          </div>
        </div>

        {/* High-Contrast Bold Tip Box */}
        <div className="mt-8 p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/90 dark:bg-indigo-950/50 shadow-sm">
          <h3 className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200 font-extrabold text-sm mb-1.5">
            <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Interview Preparation Tip</span>
          </h3>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            Take a breath and structure your thoughts using the <strong>STAR method</strong> (Situation, Task, Action, Result). Speak clearly into your microphone and make sure to click <strong className="text-indigo-900 dark:text-indigo-300 font-bold underline">Save Answer for Evaluation</strong> for each question.
          </p>
        </div>
      </div>
    )
  );
};

export default QuestionsSection;