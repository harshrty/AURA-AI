import { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // 1. Loading chat history - Fixed logic to handle the history array correctly
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/chat/history');
        // Backend returns: { success: true, history: [...] }
        if (res.data.success) {
          setMessages(res.data.history);
        }
      } catch (error) {
        console.error("failed to fetch history", error);
      }
    };
    fetchHistory();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Capture the message before clearing input
    const messageToSend = input;
    const userMessage = { role: "user", content: messageToSend };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. URL and Payload Fix: Matches backend controller req.body.message
      const res = await api.post("/chat/send", { message: messageToSend });
      
      // 3. Role Fix: Matches backend role "aura"
      const aiMessage = { role: "aura", content: res.data.response };
      setMessages((prev) => [...prev, aiMessage]); 
    } catch (err) {
      console.error("AI error", err);
      // Optional: Add a system message if it fails
      setMessages((prev) => [...prev, { role: "aura", content: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      // 4. Important: Always stop loading
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white/40 backdrop-blur-md rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-white/50 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-full">
          <Sparkles className="text-indigo-600 size-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Aura AI</h2>
          <p className="text-xs text-green-500 font-medium">Online • Your Personal Sanctuary</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}>
                    {msg.role === 'user' ? <User className="text-white size-4" /> : <Sparkles className="text-slate-600 size-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    // Matches role "aura" from backend
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-start"
            >
              <div className="bg-slate-100 px-4 py-2 rounded-2xl rounded-tl-none text-xs text-slate-500 animate-pulse">
                Aura is thinking...
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/80 border-t border-slate-200 flex gap-2">
        <Input 
          placeholder="Share what's on your mind..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="rounded-xl border-slate-200 focus-visible:ring-indigo-400"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl shrink-0 transition-all active:scale-95"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chat;