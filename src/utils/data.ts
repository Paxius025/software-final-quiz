// src/utils/data.ts
import type { Question, Choice, QuizData, ChapterInfo } from './types';

// ข้อมูลสำหรับอ้างอิงไฟล์ JSON ที่อัพโหลดมา
export const CHAPTER_FILES: ChapterInfo[] = [
  { fileName: '8_software_design.json', chapterName: '8. Software Design' },
  { fileName: '9_UX_UI.json', chapterName: '9. UX/UI' },
  { fileName: '10_Software_Testing.json', chapterName: '10. Software Testing' },
  { fileName: '11_Software_Development_Standard.json', chapterName: '11. Software Development Standard' },
  { fileName: '12_Software_cost_estimation.json', chapterName: '12. Software Cost Estimation' },
  { fileName: '13_Quality_Management.json', chapterName: '13. Quality Management' },
  { fileName: '14_Software_Maintenance.json', chapterName: '14. Software Maintenance' },
  { fileName: '15_CMS.json', chapterName: '15. CMS' },
];

/**
 * ฟังก์ชันสำหรับสุ่มลำดับ Array (Fisher-Yates Shuffle)
 * @param array Array ที่ต้องการสุ่ม
 * @returns Array ที่สุ่มลำดับแล้ว
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * เตรียมคำถาม: สุ่มลำดับคำถามและสลับตัวเลือก
 * @param questions คำถามในรูปแบบ Question[]
 * @param limit จำนวนข้อที่ต้องการ (ใช้สำหรับ Mode 2)
 * @returns คำถามที่ถูกสุ่มและสลับตัวเลือกแล้ว
 */
export function prepareQuizQuestions(questions: Question[], limit: number = questions.length): Question[] {
  // 1. สุ่มลำดับคำถาม
  const shuffledQuestions = shuffleArray(questions).slice(0, limit);

  // 2. สลับตัวเลือกคำตอบ
  return shuffledQuestions.map(q => {
    // แปลง choices จาก Object เป็น Array
    const choicesArray: Choice[] = Object.entries(q.choices).map(([key, text]) => ({ key, text }));
    
    return {
      ...q,
      shuffledChoices: shuffleArray(choicesArray),
      selectedChoiceKey: null,
      isCorrect: null,
    };
  });
}

/**
 * ดึงข้อมูล JSON จากทุกไฟล์และจัดโครงสร้างใหม่
 * @returns Promise ที่ส่งกลับ QuizData
 */
export async function fetchAllQuizData(): Promise<QuizData> {
  const quizData: QuizData = {};

  const fetchPromises = CHAPTER_FILES.map(async ({ fileName, chapterName }) => {
    try {
      // *** จำลองการเรียกใช้ fetch จากไฟล์ JSON ในโฟลเดอร์ public/ หรือ assets/ ***
      // คุณต้องวางไฟล์ JSON ทั้งหมดในโฟลเดอร์ที่สามารถเข้าถึงได้ เช่น public/
      const response = await fetch(`/questions/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}`);
      }
      const questions: Question[] = await response.json();
      quizData[chapterName] = questions;
    } catch (error) {
      console.error(`Error loading quiz data for ${chapterName}:`, error);
      // ใส่ Array ว่างเพื่อป้องกันโค้ดพังหากโหลดไฟล์ไม่ได้
      quizData[chapterName] = []; 
    }
  });

  await Promise.all(fetchPromises);
  return quizData;
}