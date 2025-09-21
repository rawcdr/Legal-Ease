📜 LegalEase AI

LegalEase AI is a prototype built for the Google Gen AI Exchange Hackathon that simplifies complex legal documents into plain, actionable language using Google’s Gemini API.

🚀 Features

📂 Multi-format Input → Upload PDF, DOC, DOCX, or TXT files.

🤖 AI-Powered Simplification → Uses Gemini API to break down complex legal text.

📑 Structured Output → Extracts and highlights Obligations, Risks, and Benefits.

🎨 Clean UI → Minimal, responsive frontend built with React + Tailwind CSS.

⚡ Prototype Ready → Functional demo with scope for fine-tuning and domain-specific training.

🛠️ Tech Stack

Frontend: React, Tailwind CSS

Backend: Next.js (API Routes)

AI Integration: Google Gemini Generative AI API

Deployment Ready: Can be hosted on Vercel / Firebase

📂 Project Structure
/components    → Navbar, UI components
/pages         
   index.js    → Main UI
   /api        
      simplify.js → Backend route calling Gemini API
/public        → Assets

⚙️ Setup Instructions

Clone the repo:

git clone https://github.com/your-username/legalease-ai.git
cd legalease-ai


Install dependencies:

npm install


Create .env.local in the root and add your Gemini API key:

GEMINI_API_KEY=your_key_here


Run locally:

npm run dev

⚠️ Disclaimer

This prototype is built for educational and hackathon purposes only. It is not a substitute for professional legal advice.
