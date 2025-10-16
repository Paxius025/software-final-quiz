// src/components/QuestionCard.tsx
import React from 'react';
import type { Question, Choice } from '../utils/types';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  onSelectChoice: (selectedKey: string) => void;
}

const getChoiceClassName = (choice: Choice, selectedKey: string | null, correctKey: string) => {
  const isSelected = selectedKey === choice.key;
  const isCorrect = choice.key === correctKey;
  const hasAnswered = selectedKey !== null;

  if (!hasAnswered) {
    // ยังไม่ได้ตอบ
    return "hover:bg-blue-50";
  }

  if (isCorrect) {
    // คำตอบที่ถูกต้อง
    return "bg-green-100 border-green-500 text-green-800 font-semibold";
  }

  if (isSelected && !isCorrect) {
    // คำตอบที่ผู้ใช้เลือกและผิด
    return "bg-red-100 border-red-500 text-red-800 font-semibold line-through";
  }

  // ตัวเลือกอื่นๆ ที่ไม่ถูกเลือก
  return "bg-white border-gray-200 text-gray-700 pointer-events-none";
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionIndex, onSelectChoice }) => {
  const { question: text, shuffledChoices, selectedChoiceKey, correct_choice, explanation } = question;
  const hasAnswered = selectedChoiceKey !== null;

  // แปลงคีย์คำตอบให้เป็นตัวอักษร A, B, C... เพื่อแสดงผล
  const choiceMap = ['A', 'B', 'C', 'D', 'E', 'F']; 
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-blue-600">
        คำถามที่ {questionIndex + 1}
      </h3>
      <p className="text-2xl font-medium mb-6 text-gray-800">
        {text}
      </p>

      <div className="space-y-3">
        {shuffledChoices.map((choice, index) => (
          <button
            key={choice.key}
            onClick={() => !hasAnswered && onSelectChoice(choice.key)}
            disabled={hasAnswered} // ห้ามแก้ไขเมื่อตอบแล้ว
            className={`
              w-full text-left p-4 rounded-lg border-2 transition duration-150 ease-in-out 
              ${getChoiceClassName(choice, selectedChoiceKey, correct_choice)}
            `}
          >
            <span className="font-mono text-lg mr-3">
              {choiceMap[index]}: 
            </span>
            <span className="text-lg">
              {choice.text}
            </span>
          </button>
        ))}
      </div>

      {hasAnswered && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-gray-800 rounded-md">
          <p className="font-bold mb-2 text-xl text-yellow-700">
            เฉลย:
          </p>
          <p>
            คำตอบที่ถูกต้องคือ: <span className="font-bold text-green-600">
              {shuffledChoices.find(c => c.key === correct_choice)?.text || 'ไม่พบคำตอบ'}
            </span>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold">คำอธิบาย:</span> {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;