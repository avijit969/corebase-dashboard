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

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // API documentation only specifies email and password for platform signup
            await api.auth.signup(formData.email, formData.password);
            toast.success("Account created successfully", {
                description: "Please sign in with your new credentials."
            });
            router.push("/platform/login");
        } catch (error: any) {
            toast.error("Signup failed", {
                description: error.message || "Please try again."
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
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Layers className="w-6 h-6 text-white" />
                        </div>
                        CoreBase
                    </Link>
                </div>

                <Card className="bg-black/40 border-white/10 text-white backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                        <CardDescription className="text-center text-gray-400">
                            Enter your email below to create your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            {/* Note: Name field is here for UI completeness, API only uses email/pass currently */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="bg-black/50 border-white/10 focus-visible:ring-purple-500 text-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-black/50 border-white/10 focus-visible:ring-purple-500 text-white"
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
                                    className="bg-black/50 border-white/10 focus-visible:ring-purple-500 text-white"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 mt-4">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign Up
                            </Button>
                            <p className="text-center text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link href="/platform/login" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
