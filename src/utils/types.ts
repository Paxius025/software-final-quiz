// src/utils/types.ts

// โครงสร้างของตัวเลือกคำตอบ
export interface Choice {
  key: string; // '1', '2', '3', '4' จาก JSON
  text: string;
}

// โครงสร้างของคำถาม
export interface Question {
  question_id: number;
  question: string;
  choices: { [key: string]: string }; // ตัวเลือกเดิมจาก JSON
  correct_choice: string; // คีย์คำตอบที่ถูกต้อง
  explanation: string;
  
  // สถานะที่เพิ่มเข้ามาสำหรับ Quiz
  shuffledChoices: Choice[]; // ตัวเลือกที่ถูกสุ่มลำดับแล้ว
  selectedChoiceKey: string | null; // คำตอบที่ผู้ใช้เลือก
  isCorrect: boolean | null; // สถานะความถูกต้อง
}

// โครงสร้างข้อมูลทั้งหมด (รวมทุกบท)
export type QuizData = {
  [chapterName: string]: Question[]; // คีย์คือชื่อบทเรียน
};

// โครงสร้างสำหรับ Mode 1: การเลือกบทเรียน
export type ChapterInfo = {
  fileName: string;
  chapterName: string;
};

// โหมดการทำแบบทดสอบ
export type QuizMode = 'single_chapter' | 'random_80';