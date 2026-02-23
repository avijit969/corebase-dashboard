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
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
const signUpShema = z.object({
    email: z.email("Invalid Emal"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"),
    name: z.string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
})
export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit } = useForm<z.infer<typeof signUpShema>>({
        resolver: zodResolver(signUpShema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signUpShema>) => {
        setLoading(true);
        try {
            await api.auth.signup(data.email, data.password, data.name);
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
                    <Link href="/" className="flex items-center">
                        <img src="/logo/dark.svg" alt="CoreBase Logo" className="h-10 w-auto" />
                    </Link>
                </div>

                <Card className="bg-black/40 border-white/10 text-white backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                        <CardDescription className="text-center text-gray-400">
                            Enter your email below to create your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="grid gap-4">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">Name</FieldLabel>
                                        <Input
                                            {...field}
                                            type="text"
                                            id="name"
                                            placeholder="Enter your name"
                                            className="bg-black/50 border-white/10 focus-visible:ring-primary-500 text-white"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            type="email"
                                            id="email"
                                            placeholder="name@example.com"
                                            className="bg-black/50 border-white/10 focus-visible:ring-primary-500 text-white"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            {...field}
                                            type="password"
                                            id="password"
                                            className="bg-black/50 border-white/10 focus-visible:ring-primary-500 text-white"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 mt-4">
                            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign Up
                            </Button>
                            <p className="text-center text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link href="/platform/login" className="text-primary-400 hover:text-primary-300 underline underline-offset-4">
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
