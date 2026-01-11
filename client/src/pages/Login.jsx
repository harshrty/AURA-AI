import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    
    // Safely get auth context
    const auth = useAuth();
    const loginUser = auth?.login; 
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // 1. Fixed the URL to match your routing: /signin
        const res = await api.post("/auth/signin", formData);
        
        const { user, token } = res.data;

        if (token) {
            // 2. Explicitly save to localStorage so api.js can see it
            localStorage.setItem("token", token);
            
            // 3. Update the global context
            if (loginUser) {
                loginUser(user, token);
                navigate("/dashboard");
            }
        } else {
            console.error("No token received from server");
        }
    } catch (error) {
        // This will now show you EXACTLY why the login failed
        console.error("Login Error:", error.response?.data?.message || error.message);
        alert(error.response?.data?.message || "Login failed");
    } finally {
        setIsLoading(false);
    }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50/50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                {/* Changed w-100 to w-[400px] */}
                <Card className="w-[400px] shadow-2xl border-slate-200/60 backdrop-blur-sm bg-white/80">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold tracking-tight text-indigo-600">Aura</CardTitle>
                        <CardDescription>Enter your credentials to access your sanctuary</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                                Sign In
                            </Button>
                            <p className="text-sm text-center text-muted-foreground">
                                New here? <Link to="/register" className="text-indigo-600 font-semibold underline-offset-4 hover:underline">Create an account</Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;