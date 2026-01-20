"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Database, Globe, Key, Layers, Lock, Server } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-default">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            CoreBase
          </div>
          <div className="flex items-center gap-4">
            <Link href="/platform/login">
              <Button variant="ghost" className="hover:bg-white/10 text-white">Login</Button>
            </Link>
            <Link href="/platform/signup">
              <Button className="bg-white text-black hover:bg-white/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white via-purple-200 to-blue-200">
              The Backend for Modern Apps
            </h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Instant APIs, Database, and Auth for your next big idea.
              Manage everything from a unified, stunning dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/platform">
                <Button size="lg" className="h-12 px-8 text-lg bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg shadow-purple-500/25 text-white cursor-pointer">
                  Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/20 bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          <FeatureCard
            icon={<Database className="w-6 h-6 text-purple-400" />}
            title="Instant Database"
            description="SQL-like database with simple JSON APIs. Create tables and query data instantly."
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6 text-blue-400" />}
            title="Authentication"
            description="Secure user management with JWTs, role-based access, and social logins built-in."
          />
          <FeatureCard
            icon={<Server className="w-6 h-6 text-pink-400" />}
            title="Real-time Storage"
            description="Store and serve files with ease. Secure, signed URLs for your assets."
          />
          <FeatureCard
            icon={<Key className="w-6 h-6 text-yellow-400" />}
            title="API Keys"
            description="Manage access with project-scoped API keys. granular control for your apps."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-green-400" />}
            title="Global Edge"
            description="Deployed on the edge for lightning fast response times worldwide."
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6 text-orange-400" />}
            title="Project Isolation"
            description="Multi-tenancy built-in. Keep your projects and data completely separate."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-white h-full hover:bg-white/10 transition-colors">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-2 border border-white/10">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-400 text-base">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
