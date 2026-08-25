"use client"
import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  console.log("🚀 ~ QuestionsSection ~ mockInterviewQuestion:", mockInterviewQuestion);

  const textToSpeach = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };

  return mockInterviewQuestion && (
    <div className='p-5 border rounded-lg mt-4'>
      {/* Question number tabs */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {mockInterviewQuestion.map((question, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border transition-colors
              ${activeQuestionIndex === index
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-secondary text-foreground border-border'
              }`}
          >
            Question #{index + 1}
          </span>
        ))}
      </div>

      {/* Active question text */}
      <p className='text-base md:text-lg font-medium leading-relaxed mb-3'>
        {mockInterviewQuestion[activeQuestionIndex]?.question}
      </p>

      {/* Text-to-speech button */}
      <Volume2
        className='cursor-pointer mb-5 text-gray-500 hover:text-primary transition-colors'
        onClick={() => textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}
      />

      {/* Note box */}
      <div className='border border-indigo-500/20 rounded-xl p-4 bg-indigo-950/20'>
        <h2 className='flex gap-2 items-center text-indigo-400 font-semibold mb-1 text-sm'>
          <Lightbulb className='w-4 h-4' />
          Interview Tips &amp; Note:
        </h2>
        <p className='text-xs text-slate-300 leading-relaxed'>
          Enable your webcam and microphone to simulate real interview conditions. After recording or typing each response, remember to click <strong className="text-indigo-300">Save Answer for Evaluation</strong> to receive your AI rating and detailed constructive feedback at the end.
        </p>
      </div>
    </div>
  );
};

export default QuestionsSection;