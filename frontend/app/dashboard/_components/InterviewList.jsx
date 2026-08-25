"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const InterviewList = () => {
  const { user } = useUser();
  const [InterviewList, setInterviewList] = useState([]);
  useEffect(() => {
    user && GetInterviewList();
  }, [user]);
  const GetInterviewList = async () => {
    try {
      const response = await fetch(`${API_URL}/api/interviews/user/${user?.primaryEmailAddress?.emailAddress}`);
      if (response.ok) {
        const data = await response.json();
        setInterviewList(data);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };
  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {InterviewList&&InterviewList.map((interview,index)=>(
            <InterviewItemCard interview={interview} key={index}/>
        ))}
      </div>
    </div>
  );
};

export default InterviewList;