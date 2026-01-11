import { useState, useEffect } from 'react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Smile, Frown, Meh, Sun, CloudRain, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch data from your Backend Mood Controller
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await api.get('/moods/trends');
        // Safely check for data and reverse it for a chronological chart
        if (res.data?.data) {
          setTrends([...res.data.data].reverse());
        }
      } catch (err) {
        console.error("Failed to fetch mood trends", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const handleMoodSubmit = async (score, tag) => {
    try {
      await api.post('/moods/add', { moodScore: score, emotionTag: tag });
      // Refresh trends immediately after adding a new mood
      const res = await api.get('/moods/trends');
      if (res.data?.data) {
        setTrends([...res.data.data].reverse());
      }
    } catch (err) {
      console.error("Error saving mood", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-indigo-600 size-10" />
        <p className="text-slate-500 animate-pulse font-medium">Loading your sanctuary...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-sm md:text-base text-slate-500">How are you feeling today?</p>
      </header>

      {/* 2. Mood Quick Logger - Responsive Grid (3 columns on mobile, 5 on desktop) */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {[
          { icon: Frown, label: 'Sad', score: 2, color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: CloudRain, label: 'Anxious', score: 4, color: 'text-purple-500', bg: 'bg-purple-50' },
          { icon: Meh, label: 'Okay', score: 6, color: 'text-slate-500', bg: 'bg-slate-50' },
          { icon: Smile, label: 'Happy', score: 8, color: 'text-green-500', bg: 'bg-green-50' },
          { icon: Sun, label: 'Great', score: 10, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((mood) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -5 }}
            key={mood.label}
            onClick={() => handleMoodSubmit(mood.score, mood.label)}
            className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border border-transparent hover:border-slate-200 transition-all shadow-sm flex flex-col items-center gap-2 md:gap-3 ${mood.bg}`}
          >
            {/* FIXED: Combined className into a single attribute */}
            <mood.icon className={`size-6 md:size-8 ${mood.color}`} />
            <span className="font-semibold text-slate-700 text-[10px] md:text-sm">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      {/* 3. The Analytics Chart - Responsive Height and Margins */}
      <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl border-slate-200 shadow-xl bg-white/50 backdrop-blur-md">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg md:text-xl text-slate-800">Mood Trends</CardTitle>
          <CardDescription className="text-xs md:text-sm text-slate-500">
            Your emotional journey over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 md:h-80 px-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="createdAt" 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return d.toLocaleDateString('en-US', { weekday: 'short' });
                }} 
                stroke="#94a3b8" 
                fontSize={10}
                tickMargin={10}
              />
              <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="moodScore" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;