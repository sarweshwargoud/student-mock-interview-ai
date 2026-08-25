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
        toast.info("Listening... speak your answer.");
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
    <div className="flex flex-col gap-2 p-2 mt-1">
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex flex-col justify-center items-center">
          <Loader2 className="h-14 w-14 animate-spin text-white mb-3" />
          <p className="text-white text-base font-medium">Evaluating and saving your answer...</p>
        </div>
      )}

      {/* Compact Webcam Card */}
      <div className="flex flex-col items-center bg-slate-950 border border-slate-800 rounded-lg p-2 gap-2 shadow-inner">
        {webcamEnabled ? (
          <div className="relative w-[180px] h-[110px] rounded-md overflow-hidden bg-black flex items-center justify-center">
            <Webcam
              audio={false}
              mirrored={true}
              className="w-full h-full object-cover rounded-md"
              onUserMediaError={(err) => {
                console.error("Webcam error:", err);
                toast.error("Could not access webcam.");
                setWebcamEnabled(false);
              }}
            />
          </div>
        ) : (
          <div className="w-[180px] h-[70px] flex flex-col justify-center items-center bg-slate-900/60 border border-slate-800 rounded-md text-center p-1">
            <CameraOff className="h-5 w-5 text-slate-500 mb-0.5" />
            <p className="text-slate-400 text-[11px] font-medium">Webcam Disabled</p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setWebcamEnabled((prev) => !prev)}
          className="h-7 px-3 text-xs bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200"
        >
          {webcamEnabled ? (
            <>
              <CameraOff className="mr-1.5 h-3.5 w-3.5 text-red-400" /> Disable Webcam
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
        disabled={loading}
        variant="outline"
        size="sm"
        onClick={StartStopRecording}
        className="w-full h-8 border-indigo-500/30 hover:bg-indigo-50/10 text-xs font-semibold"
      >
        {isRecording ? (
          <span className="text-red-500 flex items-center justify-center gap-1.5 animate-pulse">
            <StopCircle className="h-3.5 w-3.5" /> Stop Recording
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5 text-indigo-400 hover:text-indigo-300">
            <Mic className="h-3.5 w-3.5" /> Record Answer with Speech
          </span>
        )}
      </Button>

      {/* Compact Answer textarea */}
      <div>
        <textarea
          className="w-full h-20 p-2.5 border rounded-md text-xs text-foreground bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none leading-relaxed"
          placeholder="Your answer will appear here via speech or type directly..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
      </div>

      {/* Save button */}
      <Button
        onClick={UpdateUserAnswer}
        disabled={loading || !userAnswer.trim()}
        size="sm"
        className="w-full h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving…
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" /> Save Answer for Evaluation
          </>
        )}
      </Button>

      {/* Note box visible on the same screen */}
      <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-[11px] text-amber-300 leading-snug">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold text-amber-200">Note:</span> Click{" "}
          <strong className="text-white underline">Save Answer for Evaluation</strong> for each question so AI evaluates your answers.
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerSection;