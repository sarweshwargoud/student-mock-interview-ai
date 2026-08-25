"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { Mic, StopCircle, Loader2, Camera, CameraOff } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const webcamRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript.trim()) {
          setUserAnswer(prev => (prev + ' ' + finalTranscript).trim());
        }
      };

      recognition.onerror = (event) => {
        toast.error(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const EnableWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
      setWebcamEnabled(true);
      toast.success("Webcam enabled successfully");
    } catch (error) {
      toast.error("Failed to enable webcam", {
        description: "Please check your camera permissions"
      });
      console.error("Webcam error:", error);
    }
  };

  const DisableWebcam = () => {
    const tracks = webcamRef.current?.srcObject?.getTracks();
    tracks?.forEach(track => track.stop());
    setWebcamEnabled(false);
  };

  const StartStopRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech-to-text not supported");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      toast.info("Recording stopped");
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      toast.info("Recording started");
    }
  };

  const UpdateUserAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer");
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
          userEmail: user?.primaryEmailAddress?.emailAddress
        })
      });

      if (response.ok) {
        const answerRecord = await response.json();
        onAnswerSave?.(answerRecord);
        toast.success("Answer recorded successfully");
        setUserAnswer("");
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsRecording(false);
      } else {
        throw new Error("Failed to save answer to backend");
      }
    } catch (error) {
      toast.error("Failed to save answer", { description: error.message });
      console.error("Answer save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 mt-4">
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex flex-col justify-center items-center">
          <Loader2 className="h-16 w-16 animate-spin text-white mb-4" />
          <p className="text-white text-lg">Saving your answer...</p>
        </div>
      )}

      {/* Webcam box */}
      <div className="flex flex-col items-center bg-black rounded-lg p-4 gap-3">
        {webcamEnabled ? (
          <video
            ref={webcamRef}
            autoPlay
            playsInline
            className="w-full max-w-[280px] h-[180px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-full max-w-[280px] h-[180px] flex justify-center items-center bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-sm">Webcam Disabled</p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={webcamEnabled ? DisableWebcam : EnableWebcam}
          className="w-full max-w-[280px]"
        >
          {webcamEnabled ? (
            <><CameraOff className="mr-2 h-4 w-4" /> Disable Webcam</>
          ) : (
            <><Camera className="mr-2 h-4 w-4" /> Enable Webcam</>
          )}
        </Button>
      </div>

      {/* Record button */}
      <Button
        disabled={loading}
        variant="outline"
        onClick={StartStopRecording}
        className="w-full"
      >
        {isRecording ? (
          <span className="text-red-600 flex items-center gap-2 animate-pulse">
            <StopCircle className="h-4 w-4" /> Stop Recording
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Mic className="h-4 w-4" /> Record Answer
          </span>
        )}
      </Button>

      {/* Answer textarea */}
      <textarea
        className="w-full h-28 p-3 border rounded-md text-sm text-gray-800 resize-none"
        placeholder="Your answer will appear here..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />

      {/* Save button */}
      <Button
        onClick={UpdateUserAnswer}
        disabled={loading || !userAnswer.trim()}
        className="w-full"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          "Save Answer"
        )}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;