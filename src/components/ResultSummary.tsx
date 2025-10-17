// src/components/ResultSummary.tsx
import React from 'react';
import type { Question } from '../utils/types';

interface ResultSummaryProps {
  questions: Question[];
  onRestart: () => void;
  chapterName: string;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ questions, onRestart, chapterName }) => {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => q.isCorrect).length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto border-t-4 border-purple-500">
      <h2 className="text-3xl font-bold mb-4 text-center text-purple-600">
        สรุปผลการทำแบบทดสอบ
      </h2>
      <p className="text-xl text-center mb-6 text-gray-700">
        บทเรียน: <span className="font-semibold">{chapterName}</span>
      </p>
      
      <div className="space-y-2 text-center mb-6">
        <p className="text-5xl font-extrabold text-green-600">
          {correctAnswers} / {totalQuestions}
        </p>
        <p className="text-2xl font-bold text-gray-800">
          คะแนนของคุณ: {scorePercentage.toFixed(2)}%
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          สรุปรายละเอียด
        </h3>
        <p>ตอบถูก: <span className="font-bold text-green-500">{correctAnswers} ข้อ</span></p>
        <p>ตอบผิด: <span className="font-bold text-red-500">{totalQuestions - correctAnswers} ข้อ</span></p>
      </div>

      <button
        onClick={onRestart}
        className="w-full mt-6 py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition duration-200"
      >
        เริ่มใหม่ / เลือกโหมดใหม่
      </button>
    </div>
  );
};

export default ResultSummary;