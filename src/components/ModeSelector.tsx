// src/components/ModeSelector.tsx
import React, { useState } from 'react';
import type { ChapterInfo, QuizMode } from '../utils/types';

interface ModeSelectorProps {
  chapters: ChapterInfo[];
  onStartQuiz: (mode: QuizMode, chapterName: string | null) => void;
  isLoading: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ chapters, onStartQuiz, isLoading }) => {
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  
  const handleStart = () => {
    if (selectedMode === 'single_chapter' && !selectedChapter) return;
    onStartQuiz(selectedMode as QuizMode, selectedChapter);
  };
  
  // Mode 2: สุ่ม 80 ข้อจากทุกบท
  const handleSelectMode2 = () => {
    setSelectedMode('random_80');
    setSelectedChapter('สุ่ม 80 ข้อรวมทุกบท');
  };

  // Mode 1: แยกทำทีละบท
  const handleSelectMode1 = () => {
    setSelectedMode('single_chapter');
    setSelectedChapter(null);
  };
  
  const isStartButtonDisabled = isLoading || !selectedMode || (selectedMode === 'single_chapter' && !selectedChapter);

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto border-t-4 border-purple-500">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
        เลือกโหมดทำแบบทดสอบ
      </h2>

      <div className="space-y-4 mb-8">
        {/* Mode 2: สุ่ม 10 ข้อรวม */}
        <button
          onClick={handleSelectMode2}
          className={`w-full p-4 rounded-lg text-lg font-bold border-2 transition duration-200 ${
            selectedMode === 'random_80' 
              ? 'bg-purple-500 text-white border-purple-500' 
              : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-50'
          }`}
        >
          สุ่ม 80 ข้อรวมทุกบท
        </button>

        {/* Mode 1: แยกทำทีละบท */}
        <button
          onClick={handleSelectMode1}
          className={`w-full p-4 rounded-lg text-lg font-bold border-2 transition duration-200 ${
            selectedMode === 'single_chapter' 
              ? 'bg-purple-500 text-white border-purple-500' 
              : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-50'
          }`}
        >
          แยกทำทีละบท
        </button>
      </div>

      {selectedMode === 'single_chapter' && (
        <div className="mt-4 border-t pt-4">
          <h3 id="chapter-select-label" className="text-xl font-semibold mb-3 text-gray-700">
            เลือกบทเรียน
          </h3>
          <select
            aria-labelledby="chapter-select-label"
            className="w-full p-3 border rounded-lg text-gray-700 bg-gray-50 focus:ring-purple-500 focus:border-purple-500"
            value={selectedChapter || ''}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            <option value="" disabled>
              --- เลือกบทเรียนที่ต้องการ ---
            </option>
            {chapters.map(c => (
              <option key={c.chapterName} value={c.chapterName}>
                {c.chapterName}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={isStartButtonDisabled}
        className={`w-full mt-6 py-3 px-4 text-lg font-bold rounded-lg transition duration-300 ${
          isStartButtonDisabled 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600 text-white shadow-md'
        }`}
      >
        {isLoading ? 'กำลังเตรียมข้อมูล...' : 'เริ่มทำแบบทดสอบ'}
      </button>
    </div>
  );
};

export default ModeSelector;