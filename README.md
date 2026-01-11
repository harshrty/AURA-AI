🧘‍♂️ AURA AI - Your Mental Health Sanctuary
Aura AI is a full-stack MERN application designed to provide a safe, empathetic space for users to chat about their feelings and track their emotional well-being. Built with high-performance AI and real-time mood analytics, Aura acts as a digital sanctuary for mental wellness.

🚀 Live Demo
Frontend: https://aura-ai-dun.vercel.app

Backend API: https://aura-ai-aka1.onrender.com

✨ Key Features
🤖 AI-Powered Sanctuary: Real-time chat integration with Groq AI providing empathetic, low-latency responses for mental health support.

📊 Mood Tracking & Analytics: Interactive dashboard using Recharts to visualize emotional trends over time.

🔐 Secure Authentication: Robust user authentication system using JWT (JSON Web Tokens) and encrypted password storage.

📱 Fully Responsive UI: Mobile-first design built with Tailwind CSS, optimized for everything from smartphones to desktops.

✨ Smooth UX: Fluid transitions and animations powered by Framer Motion.

🛠️ Tech Stack
Frontend
React.js (Vite)

Tailwind CSS (Styling)

Shadcn UI (Components)

Lucide React (Icons)

Framer Motion (Animations)

Recharts (Data Visualization)

Backend
Node.js & Express.js

MongoDB Atlas (Database)

Groq Cloud API (AI Engine)

Mongoose (ODM)

⚙️ Installation & Setup
Prerequisites
Node.js (v18 or higher)

MongoDB Atlas Account

Groq API Key

1. Clone the Repository
Bash

git clone https://github.com/harshrty/AURA-AI.git
cd AURA-AI
2. Backend Setup
Bash

cd server
npm install
Create a .env file in the server folder:

Code snippet

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
PORT=5000
3. Frontend Setup
Bash

cd ../client
npm install
Create a .env file in the client folder:

Code snippet

VITE_API_URL=http://localhost:5000/api
4. Run Locally
Server: cd server && npm start

Client: cd client && npm run dev

🌐 Deployment Configuration
Render (Backend)
Root Directory: server

Build Command: npm install

Start Command: node index.js

Environment Variables: Add MONGO_URI, JWT_SECRET, and GROQ_API_KEY in the Render dashboard.

Vercel (Frontend)
Root Directory: client

Framework Preset: Vite

Environment Variables: Add VITE_API_URL pointing to your Render backend.

Routing Fix: Includes a vercel.json to handle React Router 404 errors.

JSON

{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
🤝 Contributing
Contributions are welcome! If you have suggestions for improving Aura AI, please feel free to:

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📧 Contact
Harsh Singh - Your GitHub Profile

Project Link: https://github.com/harshrty/AURA-AI
