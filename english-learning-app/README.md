# English Learning App

แอปฝึกภาษาอังกฤษสำหรับผู้เรียนกลุ่มเล็กประมาณ 5–10 คน โดยตั้งเป้าให้ค่าใช้จ่ายเริ่มต้นเป็น $0

## V1

- หน้า Home
- เรียนคำศัพท์พื้นฐาน
- คำอ่านภาษาไทย
- ตัวอย่างประโยคภาษาอังกฤษ/ไทย
- ฟังเสียงด้วย Browser Speech Synthesis
- Quiz
- เก็บคำที่ยังจำไม่ได้ไว้ทบทวน
- XP และสถิติพื้นฐาน
- Responsive สำหรับมือถือ

## Current data mode

V1 ใช้ `localStorage` เพื่อให้ทดลอง UI ได้ทันทีโดยไม่ต้องรอ backend

เมื่อ Neon พร้อม จะเปลี่ยน data layer ให้ใช้ PostgreSQL กลางสำหรับผู้เรียน 5–10 คน โดย schema เตรียมไว้ใน `database/schema.sql`

## Project structure

```text
english-learning-app/
├── index.html
├── styles.css
├── app.js
├── vercel.json
├── README.md
└── database/
    └── schema.sql
```

## Deployment

สามารถตั้ง Vercel Root Directory เป็น `english-learning-app` ได้เมื่อเชื่อม repository นี้กับ Vercel
