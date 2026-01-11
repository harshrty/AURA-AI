const Groq = require("groq-sdk");
const Message = require("../models/chat");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const sendmessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user; // From your protect middleware

        if (!message) {
            return res.status(400).json({ message: "Content is required" });
        }

        // 1. Save User Message to MongoDB
        await Message.create({ 
            user: userId, 
            role: "user", 
            content: message 
        });

        // 2. Get AI Response from Groq (Llama 3 is great for mental health)
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are Aura, an empathetic and kind mental health companion. Respond with warmth and psychologist-level insight."
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.3-70b-versatile", // This is free and powerful
        });

        const AiResponse = chatCompletion.choices[0]?.message?.content || "I'm here for you, but I'm having trouble thinking right now.";

        // 3. Save Aura Response to MongoDB
        await Message.create({ 
            user: userId, 
            role: "aura", 
            content: AiResponse 
        });

        // 4. Send back to frontend
        res.status(200).json({ response: AiResponse });

    } catch (error) {
        console.error("GROQ ERROR:", error.message);
        res.status(500).json({ message: "Aura is resting. Error: " + error.message });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const history = await Message.find({ user: req.user }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendmessage, getChatHistory };