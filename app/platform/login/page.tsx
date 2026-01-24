"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.auth.login(formData.email, formData.password);
            // Store token
            if (response.access_token) {
                // Save to store
                const setToken = useAuthStore.getState().setToken;
                const setUser = useAuthStore.getState().setUser;

                setToken(response.access_token);

                // Construct user object from response or form data
                // Assuming response might contain user details, otherwise use email
                const user = (response as any).user || {
                    id: (response as any).user_id || 'user_' + Date.now(),
                    email: formData.email,
                    name: (response as any).name || 'User'
                };
                setUser(user);

                // Keep localStorage for compatibility with other parts if any (optional but safe)
                localStorage.setItem("platform_token", response.access_token);

                console.log("user is", response);
                toast.success("Welcome back!", {
                    description: "You have successfully signed in."
                });
                router.push("/platform");
            } else {
                throw new Error("No access token received");
            }
        } catch (error: any) {
            toast.error("Login failed", {
                description: error.message || "Invalid credentials."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 z-0" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="z-10 w-full max-w-md"
            >
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <Layers className="w-6 h-6 text-white" />
                        </div>
                        CoreBase
                    </Link>
                </div>

                <Card className="bg-black/40 border-white/10 text-white backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                        <CardDescription className="text-center text-gray-400">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-black/50 border-white/10 focus-visible:ring-orange-500 text-white"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="bg-black/50 border-white/10 focus-visible:ring-orange-500 text-white"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 mt-4">
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                            <p className="text-center text-sm text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link href="/platform/signup" className="text-orange-400 hover:text-orange-300 underline underline-offset-4">
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
