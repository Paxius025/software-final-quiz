// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import type { QuizData, Question, QuizMode } from "./utils/types";
import {
  fetchAllQuizData,
  prepareQuizQuestions,
  CHAPTER_FILES,
} from "./utils/data";
import ModeSelector from "./components/ModeSelector";
import Quiz from "./components/Quiz";
import Footer from "./components/Footer";

// ใช้ CSS ง่ายๆ ในการจัดกึ่งกลางและใช้ฟอนต์
const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f4f7f9",
  // padding: "40px 20px",
};

const App: React.FC = () => {
  const [allQuizData, setAllQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<
    Question[] | null
  >(null);
  const [quizChapterName, setQuizChapterName] = useState<string | null>(null);

  // 1. ดึงข้อมูลทั้งหมดเมื่อ Component โหลดครั้งแรก
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchAllQuizData();
      setAllQuizData(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // 2. ฟังก์ชันเริ่มทำแบบทดสอบ
  const handleStartQuiz = useCallback(
    (mode: QuizMode, chapterName: string | null) => {
      if (!allQuizData) return;

      let questionsToUse: Question[] = [];
      let name: string = "";

      if (mode === "single_chapter" && chapterName) {
        // โหมด 1: แยกทำทีละบท
        questionsToUse = allQuizData[chapterName] || [];
        name = chapterName;
      } else if (mode === "random_80") {
        // โหมด 2: สุ่ม 80 ข้อจาก 15 (สมมติว่าแต่ละบทมีอย่างน้อย 10-15 ข้อตามโจทย์)
        const allQuestions: Question[] = Object.values(allQuizData).flat();
        // สุ่ม 80 ข้อจากคำถามทั้งหมด (จำนวนข้อสูงสุดไม่เกิน 80)
        questionsToUse = prepareQuizQuestions(allQuestions, 80);
        name = "สุ่ม 80 ข้อรวมทุกบท";
      }

      if (questionsToUse.length === 0) {
        alert("ไม่พบข้อมูลคำถามสำหรับโหมด/บทเรียนนี้");
        return;
      }

      // เตรียมคำถาม (สลับข้อและตัวเลือก) ก่อนเริ่ม
      setCurrentQuizQuestions(prepareQuizQuestions(questionsToUse));
      setQuizChapterName(name);
    },
    [allQuizData]
  );

  // 3. ฟังก์ชันกลับไปเลือกโหมด/เริ่มใหม่
  const handleRestart = () => {
    setCurrentQuizQuestions(null);
    setQuizChapterName(null);
  };

  if (isLoading) {
    return (
      <div
        style={containerStyle}
        className="text-center text-xl font-semibold text-blue-500"
      >
        กำลังโหลดข้อมูลแบบทดสอบ... 🔄
      </div>
    );
  }

  if (!allQuizData) {
    return (
      <div
        style={containerStyle}
        className="text-center text-xl font-semibold text-red-500"
      >
        ไม่สามารถโหลดข้อมูลแบบทดสอบได้ โปรดตรวจสอบไฟล์ JSON
      </div>
    );
  }

  return (
    <div
      style={containerStyle}
      className="flex items-center flex-col justify-between"
    >
      <div className="w-full h-[80vh] flex justify-center items-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
            Prepare Software Engineer Final Quiz
          </h1>

          {currentQuizQuestions && quizChapterName ? (
            // แสดงหน้า Quiz
            <Quiz
              initialQuestions={currentQuizQuestions}
              chapterName={quizChapterName}
              onRestart={handleRestart}
            />
          ) : (
            // แสดงหน้าเลือกโหมด/บทเรียน
            <ModeSelector
              chapters={CHAPTER_FILES}
              onStartQuiz={handleStartQuiz}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default App;
