"use client";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const StartInterview = ({ params }) => {
  const [interViewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/interviews/${params.interviewId}`);
      if (response.ok) {
        const data = await response.json();
        const jsonMockResp = JSON.parse(data.jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(data);
      }
    } catch (error) {
      console.error("Failed to fetch interview details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSave = (answerRecord) => {
    if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-rose-500 font-semibold">No interview questions found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4 flex flex-col gap-6">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interViewData}
          onAnswerSave={handleAnswerSave}
        />
      </div>

      {/* Action navigation bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Question {activeQuestionIndex + 1} of {mockInterviewQuestion?.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {activeQuestionIndex > 0 && (
            <Button
              variant="outline"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="flex items-center gap-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
          )}

          {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 font-medium"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
            <Link href={"/dashboard/interview/" + interViewData?.mockId + "/feedback"}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 font-semibold shadow-md shadow-emerald-600/25">
                <CheckCircle className="w-4 h-4" /> End Interview &amp; View Feedback
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartInterview;