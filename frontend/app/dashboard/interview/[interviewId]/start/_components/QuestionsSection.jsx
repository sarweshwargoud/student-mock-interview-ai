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
      <div className="p-3 border rounded-lg mt-1 flex flex-col gap-3">
        {/* Question number tabs */}
        <div className="flex flex-wrap gap-1.5">
          {mockInterviewQuestion.map((question, index) => (
            <span
              key={index}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer border transition-colors
                ${
                  activeQuestionIndex === index
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-secondary text-foreground border-border"
                }`}
            >
              Question #{index + 1}
            </span>
          ))}
        </div>

        {/* Active question text */}
        <div className="space-y-1.5">
          <p className="text-sm md:text-base font-semibold leading-snug">
            {mockInterviewQuestion[activeQuestionIndex]?.question}
          </p>

          {/* Text-to-speech button */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            onClick={() =>
              textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)
            }
          >
            <Volume2 className="w-4 h-4 cursor-pointer" />
            <span>Listen to question</span>
          </button>
        </div>

        {/* Note box */}
        <div className="border border-indigo-500/20 rounded-lg p-2.5 bg-indigo-950/20">
          <h2 className="flex gap-1.5 items-center text-indigo-400 font-semibold mb-1 text-xs">
            <Lightbulb className="w-3.5 h-3.5" />
            Interview Tips:
          </h2>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Practice answering naturally with your webcam enabled. Remember to click{" "}
            <strong className="text-indigo-300">Save Answer for Evaluation</strong> for each question so your complete score report is generated.
          </p>
        </div>
      </div>
    )
  );
};

export default QuestionsSection;