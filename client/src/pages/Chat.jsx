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

  // Fetch history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/chat/history');
        if (res.data?.success) {
          setMessages(res.data.history);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchHistory();
  }, []);

  // Reliable Auto-scroll logic for mobile and desktop
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageToSend = input;
    const userMessage = { role: "user", content: messageToSend };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.post("/chat/send", { message: messageToSend });
      const aiMessage = { role: "aura", content: res.data.response };
      setMessages((prev) => [...prev, aiMessage]); 
    } catch (err) {
      console.error("AI error:", err);
      setMessages((prev) => [...prev, { 
        role: "aura", 
        content: "I'm having a little trouble connecting. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Container Fixes:
      - h-[calc(100dvh-80px)]: Uses dynamic viewport height to prevent keyboard overlap on mobile.
      - w-full: Ensures it doesn't exceed screen width.
    */
    <div className="flex flex-col h-[calc(100dvh-100px)] md:h-[85vh] w-full bg-white/40 backdrop-blur-md rounded-2xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
      
      {/* Header: Compact on mobile, spacious on desktop */}
      <div className="p-3 md:p-4 border-b border-slate-200 bg-white/50 flex items-center gap-3 shrink-0">
        <div className="bg-indigo-100 p-1.5 md:p-2 rounded-full">
          <Sparkles className="text-indigo-600 size-4 md:size-5" />
        </div>
        <div>
          <h2 className="font-bold text-sm md:text-base text-slate-800">Aura AI</h2>
          <p className="text-[10px] md:text-xs text-green-500 font-medium leading-none">Online • Your Sanctuary</p>
        </div>
      </div>

      {/* Messages: Optimized padding and spacing for small screens */}
      <ScrollArea className="flex-1 px-3 md:px-6 py-4" ref={scrollRef}>
        <div className="space-y-4 md:space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 md:gap-3 max-w-[92%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`size-7 md:size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}>
                    {msg.role === 'user' ? <User className="text-white size-3 md:size-4" /> : <Sparkles className="text-slate-600 size-3 md:size-4" />}
                  </div>
                  <div className={`p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm break-words ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-slate-100 px-3 py-2 rounded-2xl rounded-tl-none text-[10px] md:text-xs text-slate-500 animate-pulse">
                Aura is writing...
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input: Prevents zooming on mobile by keeping text at 16px (text-base) */}
      <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-white/80 border-t border-slate-200 flex gap-2 shrink-0">
        <Input 
          placeholder="What's on your mind?" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="rounded-xl border-slate-200 focus-visible:ring-indigo-400 text-base md:text-sm"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl shrink-0 transition-all active:scale-90"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chat;