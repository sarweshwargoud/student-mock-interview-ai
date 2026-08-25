"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { Mic, StopCircle, Loader2, Camera, CameraOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import Webcam from "react-webcam";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const RecordAnswerSection = ({ 
  mockInterviewQuestion, 
  activeQuestionIndex, 
  interviewData, 
  onAnswerSave,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript.trim()) {
          setUserAnswer((prev) => (prev + " " + finalTranscript).trim());
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event);
        if (event.error !== "no-speech") {
          toast.error(`Speech recognition error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const StartStopRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech-to-text is not supported in this browser. Please type your answer directly.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      toast.info("Recording stopped.");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info("Listening... speak your answer clearly.");
      } catch (err) {
        console.error("Start recording error:", err);
      }
    }
  };

  const UpdateUserAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before saving.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mockIdRef: interviewData?.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          userEmail: user?.primaryEmailAddress?.emailAddress || "",
        }),
      });

      if (response.ok) {
        const answerRecord = await response.json();
        onAnswerSave?.(answerRecord);
        toast.success("Answer saved and evaluated successfully!");
        setUserAnswer("");
        if (recognitionRef.current && isRecording) {
          recognitionRef.current.stop();
        }
        setIsRecording(false);
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.detail || "Failed to save answer");
      }
    } catch (error) {
      console.error("Answer save error:", error);
      toast.error(error.message || "Failed to save answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4 h-full">
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex flex-col justify-center items-center">
          <Loader2 className="h-14 w-14 animate-spin text-white mb-3" />
          <p className="text-white text-base font-semibold">Evaluating and saving your answer...</p>
        </div>
      )}

      {/* Centered Sleek Webcam Card */}
      <div className="flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-inner">
        {webcamEnabled ? (
          <div className="relative w-[240px] h-[135px] rounded-lg overflow-hidden bg-black flex items-center justify-center shadow-md">
            <Webcam
              audio={false}
              mirrored={true}
              className="w-full h-full object-cover rounded-lg"
              onUserMediaError={(err) => {
                console.error("Webcam error:", err);
                toast.error("Could not access webcam.");
                setWebcamEnabled(false);
              }}
            />
          </div>
        ) : (
          <div className="w-[240px] h-[80px] flex flex-col justify-center items-center bg-slate-900 border border-slate-800 rounded-lg text-center p-2">
            <CameraOff className="h-5 w-5 text-slate-400 mb-1" />
            <p className="text-slate-300 text-xs font-bold">Webcam Disabled</p>
            <p className="text-slate-400 text-[11px]">Enable to practice real interview posture</p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setWebcamEnabled((prev) => !prev)}
          className="mt-2.5 h-7 px-3.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-100 transition-colors"
        >
          {webcamEnabled ? (
            <>
              <CameraOff className="mr-1.5 h-3.5 w-3.5 text-rose-400" /> Disable Webcam
            </>
          ) : (
            <>
              <Camera className="mr-1.5 h-3.5 w-3.5 text-indigo-400" /> Enable Webcam
            </>
          )}
        </Button>
      </div>

      {/* Speech-to-text recording button */}
      <Button
        type="button"
        disabled={loading}
        variant="outline"
        onClick={StartStopRecording}
        className={`w-full h-10 text-xs sm:text-sm font-bold rounded-xl transition-all border ${
          isRecording
            ? "border-rose-500 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 animate-pulse"
            : "border-indigo-500/40 text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-100"
        }`}
      >
        {isRecording ? (
          <span className="flex items-center justify-center gap-2">
            <StopCircle className="h-4 w-4 text-rose-600" /> Stop Recording
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Mic className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Record Answer with Speech
          </span>
        )}
      </Button>

      {/* Answer textarea */}
      <div className="flex-1 min-h-[85px]">
        <textarea
          className="w-full h-full min-h-[85px] p-3 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 resize-none leading-relaxed"
          placeholder="Your answer will appear here automatically as you speak, or you can type directly..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
      </div>

      {/* Save Answer Button */}
      <Button
        type="button"
        onClick={UpdateUserAnswer}
        disabled={loading || !userAnswer.trim()}
        className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Answer…
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" /> Save Answer for Evaluation
          </>
        )}
      </Button>

      {/* Ultra High-Contrast Alert Box */}
      <div className="p-3.5 bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 rounded-xl flex items-start gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
          <span className="font-extrabold text-amber-950 dark:text-amber-300 uppercase tracking-wider text-[11px] block mb-0.5">
            Important Note:
          </span>
          Click <strong className="font-extrabold underline text-amber-950 dark:text-amber-200">Save Answer for Evaluation</strong> for each question so our AI can evaluate your response and generate your feedback report.
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerSection;