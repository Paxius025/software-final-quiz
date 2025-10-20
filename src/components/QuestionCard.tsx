import React, { useEffect, useState } from "react";
import type { Question, Choice } from "../utils/types";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  onSelectChoice: (selectedKey: string) => void;
}

const getChoiceClassName = (
  choice: Choice,
  selectedKey: string | null,
  correctKey: string
) => {
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

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  onSelectChoice,
}) => {
  const {
    question: text,
    shuffledChoices,
    selectedChoiceKey,
    correct_choice,
    explanation,
  } = question;
  const hasAnswered = selectedChoiceKey !== null;
  const isCorrectSelected = hasAnswered && selectedChoiceKey === correct_choice;

  // แสดงโมดาลเฉลยเฉพาะตอนตอบผิด
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // เปิด/ปิดโมดาลเมื่อมีการตอบ และตอบผิดเท่านั้น
  useEffect(() => {
    if (hasAnswered && !isCorrectSelected) {
      setShowExplanationModal(true);
    } else {
      setShowExplanationModal(false);
    }
  }, [hasAnswered, isCorrectSelected, selectedChoiceKey]);

  // แสดงนับถอยหลังและปิดอัตโนมัติหลัง 15 วิ เมื่อโมดาลเปิด
  useEffect(() => {
    if (!showExplanationModal) return;

    setRemainingSeconds(60);
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowExplanationModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showExplanationModal]);

  // แปลงคีย์คำตอบให้เป็นตัวอักษร A, B, C... เพื่อแสดงผล
  const choiceMap = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-purple-600">
        คำถามที่ {questionIndex + 1}
      </h3>
      <p className="text-2xl font-medium mb-6 text-gray-800">{text}</p>

      <div className="space-y-3">
        {shuffledChoices.map((choice, index) => (
          <button
            key={choice.key}
            onClick={() => !hasAnswered && onSelectChoice(choice.key)}
            disabled={hasAnswered}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition duration-150 ease-in-out 
              ${getChoiceClassName(choice, selectedChoiceKey, correct_choice)}
            `}
          >
            <span className="font-mono text-lg mr-3">{choiceMap[index]}:</span>
            <span className="text-lg">{choice.text}</span>
          </button>
        ))}
      </div>

      {/* Popup modal shown only when answered incorrectly */}
      {showExplanationModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center px-4"
          aria-modal="true"
          role="dialog"
        >
          {/* semi-transparent backdrop (click to close) */}
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setShowExplanationModal(false)}
          />

          <div className="relative z-50 w-full max-w-2xl mx-auto">
            <div
              className="bg-white rounded-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold mb-2 text-xl text-yellow-700">
                      เฉลย:
                    </p>
                    <p>
                      คำตอบที่ถูกต้องคือ:{" "}
                      <span className="font-bold text-green-600">
                        {shuffledChoices.find((c) => c.key === correct_choice)
                          ?.text || "ไม่พบคำตอบ"}
                      </span>
                    </p>
                  </div>
                  {/* Close icon (click to close) */}
                  <button
                    aria-label="ปิด"
                    className="ml-4 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowExplanationModal(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <p className="mt-4 text-m text-gray-600">
                  <span className="font-semibold">คำอธิบาย:</span> {explanation}
                </p>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                <span className="text-s text-gray-500">
                  จะปิดอัตโนมัติใน {remainingSeconds} วิ
                </span>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  onClick={() => setShowExplanationModal(false)}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
