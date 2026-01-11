import { useState, useEffect } from 'react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
        // We reverse the data so it goes from oldest to newest for the chart
        setTrends(res.data.data.reverse());
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
      // Refresh trends after adding
      const res = await api.get('/moods/trends');
      setTrends(res.data.data.reverse());
    } catch (err) {
      console.error("Error saving mood", err);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-500">How are you feeling today?</p>
      </header>

      {/* 2. Mood Quick Logger */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Frown, label: 'Sad', score: 2, color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: CloudRain, label: 'Anxious', score: 4, color: 'text-purple-500', bg: 'bg-purple-50' },
          { icon: Meh, label: 'Okay', score: 6, color: 'text-slate-500', bg: 'bg-slate-50' },
          { icon: Smile, label: 'Happy', score: 8, color: 'text-green-500', bg: 'bg-green-50' },
          { icon: Sun, label: 'Great', score: 10, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((mood) => (
          <motion.button
            whileHover={{ y: -5 }}
            key={mood.label}
            onClick={() => handleMoodSubmit(mood.score, mood.label)}
            className={`p-6 rounded-3xl border border-transparent hover:border-slate-200 transition-all shadow-sm flex flex-col items-center gap-3 ${mood.bg}`}
          >
            <mood.icon className={`size-8 ${mood.color}`} />
            <span className="font-semibold text-slate-700 text-sm">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      {/* 3. The Analytics Chart */}
      <Card className="p-6 rounded-3xl border-slate-200 shadow-xl bg-white/50 backdrop-blur-md">
        <CardHeader className="px-0">
          <CardTitle>Mood Trends</CardTitle>
          <CardDescription>Your emotional journey over the last 7 entries</CardDescription>
        </CardHeader>
        <CardContent className="h-75 px-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="createdAt" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })} 
                stroke="#94a3b8" 
                fontSize={12}
              />
              <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="moodScore" 
                stroke="#4f46e5" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;