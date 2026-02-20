"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Code, Database, Flame, Lock, Server } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } }
};

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }} className="h-full">
            <Card className="bg-neutral-900/40 border-white/5 backdrop-blur-sm text-white h-full hover:bg-primary-950/20 hover:border-primary-500/20 transition-all duration-300 group overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 bg-linear-to-b from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-neutral-800 to-neutral-900 flex items-center justify-center mb-4 border border-white/5 group-hover:border-primary-500/30 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                        {icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary-100 transition-colors">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-500 text-sm md:text-base leading-relaxed group-hover:text-gray-400 transition-colors">
                        {description}
                    </CardDescription>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function FeaturesSection() {
    return (
        <motion.div
            id="features"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 lg:mb-32"
        >
            <FeatureCard
                icon={<Database className="w-6 h-6 text-primary-400" />}
                title="Instant Database"
                description="SQL-like database with simple JSON APIs. Create tables and query data instantly."
            />
            <FeatureCard
                icon={<Lock className="w-6 h-6 text-primary-300" />}
                title="Authentication"
                description="Secure user management with JWTs, role-based access, and social logins built-in."
            />
            <FeatureCard
                icon={<Server className="w-6 h-6 text-primary-500" />}
                title="Storage"
                description="Store and serve files with ease. Secure, signed URLs for your assets."
            />
            <FeatureCard
                icon={<Flame className="w-6 h-6 text-primary-400" />}
                title="Realtime"
                description="Realtime database with instant updates. Keep your data in sync across all devices."
            />
            <FeatureCard
                icon={<Code className="w-6 h-6 text-primary-400" />}
                title="SDKs"
                description="SDKs for all major platforms. Integrate CoreBase into your applications with ease."
            />
            <FeatureCard
                icon={<Brain className="w-6 h-6 text-primary-400" />}
                title="MCP Server"
                description="Use Corebase MCP server with your favorite AI tools. To build your apps."
            />
        </motion.div>
    );
}
