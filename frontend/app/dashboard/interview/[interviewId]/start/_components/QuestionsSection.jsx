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
      <div className='border rounded-lg p-4 bg-blue-50'>
        <h2 className='flex gap-2 items-center text-primary font-semibold mb-1'>
          <Lightbulb className='w-4 h-4' />
          Note:
        </h2>
        <p className='text-sm text-primary leading-relaxed'>
          Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview.
          It has 5 questions which you can answer and at last you will get a report based
          on your answers. We never record your video — webcam access can be disabled
          at any time.
        </p>
      </div>
    </div>
  );
};

export default QuestionsSection;