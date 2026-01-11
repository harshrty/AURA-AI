const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const connectDB = require("./dbconnection");
const authRoutes = require("./routing/authroutes"); // Renamed for clarity
const chatRoutes = require("./routing/chatroutes");
const moodRoutes = require('./routing/moodroutes');

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

const app = express();

// Middlewares (Order is important!)
app.use(cors({
    origin: "https://aura-ai-dun.vercel.app", // Use your exact URL here
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json()); // Only need this once

// Routes
// Mounting under /api/auth makes your life easier
app.use('/api/auth', authRoutes); 
app.use("/api/chat", chatRoutes);
app.use('/api/moods', moodRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

