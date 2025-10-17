// src/components/Quiz.tsx
import React, { useState, useCallback } from 'react';
import type { Question } from '../utils/types';
import QuestionCard from './QuestionCard';
import ResultSummary from './ResultSummary';

interface QuizProps {
  initialQuestions: Question[];
  chapterName: string;
  onRestart: () => void;
}

const Quiz: React.FC<QuizProps> = ({ initialQuestions, chapterName, onRestart }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // คำถามปัจจุบัน
  const currentQuestion = questions[currentQuestionIndex];
  
  // จัดการการเลือกคำตอบ
  const handleSelectChoice = useCallback((selectedKey: string) => {
    if (currentQuestion.selectedChoiceKey !== null) return; // ป้องกันการเลือกซ้ำ

    const isCorrect = selectedKey === currentQuestion.correct_choice;

    // อัปเดตสถานะของคำถาม
    const updatedQuestions = questions.map((q, index) => {
      if (index === currentQuestionIndex) {
        return {
          ...q,
          selectedChoiceKey: selectedKey,
          isCorrect: isCorrect,
        };
      }
      return q;
    });

    setQuestions(updatedQuestions);

  }, [questions, currentQuestionIndex, currentQuestion]);

  // ไปยังข้อถัดไป
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return <ResultSummary questions={questions} onRestart={onRestart} chapterName={chapterName} />;
  }
  
  if (!currentQuestion) {
    return <p className="text-center text-red-500">ไม่พบคำถามในบทเรียนนี้</p>;
  }

  // กำหนดปุ่มถัดไป
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const buttonText = isLastQuestion ? 'สรุปผลคะแนน' : 'ข้อถัดไป';

  return (
    <div className="space-y-6">
      {/* Question Card */}
      <QuestionCard
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        onSelectChoice={handleSelectChoice}
      />
      
      {/* Navigation Button */}
      {currentQuestion.selectedChoiceKey !== null && (
        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            className={`
              py-3 px-8 text-lg font-bold rounded-lg transition duration-200 
              ${isLastQuestion ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'}
              text-white shadow-md
            `}
          >
            {buttonText}
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="text-center text-gray-600 font-semibold">
        ความคืบหน้า: {currentQuestionIndex + 1} / {questions.length} ข้อ
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Quiz;