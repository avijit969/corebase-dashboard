"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <div className="text-center max-w-3xl mx-auto mb-24 lg:mb-32">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-primary-500/20 blur-[80px] -z-10 rounded-full" />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    The Backend for{" "}
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-primary-400 via-primary-200 to-primary-400 animate-gradient-x">
                        Modern Apps
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                    Instant APIs, Database, and Auth for your next big idea.
                    Manage everything from a unified, stunning dashboard.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/platform" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full h-14 px-8 text-lg bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 border-0 shadow-lg shadow-primary-500/25 text-white cursor-pointer rounded-full transition-all hover:scale-105 active:scale-95 group">
                            Start Building Now
                            <motion.div
                                className="inline-block"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </motion.div>
                        </Button>
                    </Link>
                    <Link href="https://corebase-docs.trivyaa.in" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-primary-500/10 hover:border-primary-500/50 hover:text-primary-100 text-gray-300 cursor-pointer rounded-full backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                            Read Documentation
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
