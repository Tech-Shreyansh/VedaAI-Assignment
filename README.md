# 🚀 VedaAI – AI Assessment Creator

An AI-powered platform that allows teachers to create structured question papers automatically using configurable inputs.

---

## 🌐 Live Demo

👉 Deployed Backend: https://your-backend-url.onrender.com
👉 Frontend: https://veda-ai-assignment-six.vercel.app/

---

## 📌 Overview

VedaAI enables educators to:

* Create assignments with custom configurations
* Generate structured question papers using AI
* View formatted question papers and answers
* Download as PDF (Questions / QnA)
* Manage assignments (CRUD operations)
* Search Assignments
* Auth protected & isolated data environment application

---

## ✨ Features

### 🔐 Authentication

* Email-based signup & login
* OTP verification flow (demo mode on deployed version)

### 📝 Assignment Creation

* File Upload
* Topic, Standard, Due Date
* Duration (1–5 hours)
* Question configuration (type, count, marks)
* Additional instructions

### 🤖 AI Question Generation

* Structured prompt creation
* Section Wise Rendering (A, B, C…)
* Difficulty tagging (Easy / Medium / Hard)
* Marks allocation

### 📄 Assignment View

* Clean exam-like layout
* Student info section
* Section-wise questions
* MCQ options support
* Answer Visibility toggle

### 📥 PDF Export

* Download Question Paper
* Download QnA Sheet

### 🗂️ Assignment Management

* View all assignments
* Regenerate AI output
* Delete assignments

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Axios
* React Hot Toast

### Backend

* Node.js + Express
* TypeScript
* MongoDB (Mongoose)

### AI

* OpenAI / LLM API
* Prompt engineering + structured parsing

### Deployment

* Backend: Render
* Database: MongoDB Atlas

---

## 🏗️ Architecture

```
Frontend (Next.js)
        ↓
Backend API (Express)
        ↓
MongoDB Atlas
        ↓
LLM API (AI Generation)
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Tech-Shreyansh/VedaAI-Assignment.git
cd VedaAI-Assignment
```

---

### 2️⃣ Backend Setup

```bash
cd vedaai-backend
npm install
```

#### Create `.env`

```env
MONGO_URI=your_mongodb_uri
PORT=5000
OPENAI_API_KEY=your_key
```

#### Run

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../vedaai-frontend
npm install
npm run dev
```

---

## ⚠️ OTP Verification Note

Due to SMTP/network restrictions on Render’s free tier, email-based OTP delivery is **not functional on the deployed version**.

### Current Behavior (Deployed)

* OTP is generated on backend
* Displayed on UI (for demo/testing)
* User enters OTP to verify

### Local Environment

* Email OTP flow works correctly
* Can be demonstrated if required

---

## 🔒 Validation Rules

* Due date: Today → +1 year max
* Topic: Max 50 characters
* Max 10 questions per type
* Total marks ≤ 300
* Duration: 1–5 hours

---

## 📌 API Endpoints

### Auth

* `POST /auth/send-otp`
* `POST /auth/verify-otp`
* `POST /auth/signup`
* `POST /auth/login`

### Assignments

* `POST /assignments/create`
* `GET /assignments/get`
* `GET /assignments/:id`
* `POST /assignments/regenerate/:id`
* `DELETE /assignments/:id`

---

## 🚧 Challenges & Solutions

### ❌ SMTP blocked on Render

* Switched to demo OTP mode for deployment
* Email flow preserved for local testing

### ❌ PDF rendering issues

* Normalized styles for html2canvas compatibility

---

## 🚀 Future Improvements

* Queue-based AI processing (BullMQ + Redis)
* Role-based access (Teacher / Student)
* Assignment sharing
* Analytics dashboard

---

## 👨‍💻 Author

**Shreyansh Agarwal**

* Full Stack Developer
* Focus: Scalable SaaS + AI systems

---

## ⭐ Final Note

This project demonstrates:

* End-to-end full stack development
* AI integration with structured outputs
* Real-world problem solving (infra limitations)
* Production-grade UI/UX considerations

---
