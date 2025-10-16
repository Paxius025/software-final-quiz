/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // 💡 ส่วนที่ต้องเพิ่ม: กำหนด Font Family
      fontFamily: {
        // 'sans' คือฟอนต์เริ่มต้นที่ใช้ใน Tailwind สำหรับข้อความทั่วไป
        // ให้ใส่ชื่อ Font ที่คุณเพิ่มเข้ามาเป็นอันดับแรก
        sans: ["Kanit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
