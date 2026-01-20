"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Database, Globe, Key, Layers, Lock, Server } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const gradientBlobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      rotate: [0, 90, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <motion.div
        variants={gradientBlobVariants as any}
        animate="animate"
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <motion.div
        variants={gradientBlobVariants as any}
        animate="animate"
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"
      />
      <motion.div
        variants={gradientBlobVariants as any}
        animate="animate"
        className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ transitionDelay: '2s' }}
      />


      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-orange-500/10 bg-neutral-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-default">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            CoreBase
          </div>
          <div className="flex items-center gap-4">
            <Link href="/platform/login">
              <Button variant="ghost" className="hover:bg-white/5 hover:text-orange-400 text-gray-300 transition-colors">Login</Button>
            </Link>
            <Link href="/platform/signup">
              <Button className="bg-white text-black hover:bg-orange-50 hover:text-orange-900 border-0 transition-all shadow-lg hover:shadow-orange-500/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-orange-500/20 blur-[80px] -z-10 rounded-full" />
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              The Backend for{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-400 via-amber-200 to-red-400 animate-gradient-x">
                Modern Apps
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Instant APIs, Database, and Auth for your next big idea.
              Manage everything from a unified, stunning dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/platform">
                <Button size="lg" className="h-14 px-8 text-lg bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 border-0 shadow-lg shadow-orange-500/25 text-white cursor-pointer rounded-full transition-all hover:scale-105 active:scale-95">
                  Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/50 hover:text-orange-100 text-gray-300 cursor-pointer rounded-full backdrop-blur-sm transition-all">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          id="features"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        >
          <FeatureCard
            icon={<Database className="w-6 h-6 text-orange-400" />}
            title="Instant Database"
            description="SQL-like database with simple JSON APIs. Create tables and query data instantly."
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6 text-amber-400" />}
            title="Authentication"
            description="Secure user management with JWTs, role-based access, and social logins built-in."
          />
          <FeatureCard
            icon={<Server className="w-6 h-6 text-red-400" />}
            title="Real-time Storage"
            description="Store and serve files with ease. Secure, signed URLs for your assets."
          />
          <FeatureCard
            icon={<Key className="w-6 h-6 text-yellow-400" />}
            title="API Keys"
            description="Manage access with project-scoped API keys. granular control for your apps."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-rose-400" />}
            title="Global Edge"
            description="Deployed on the edge for lightning fast response times worldwide."
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6 text-orange-300" />}
            title="Project Isolation"
            description="Multi-tenancy built-in. Keep your projects and data completely separate."
          />
        </motion.div>

        {/* Code Preview Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-orange-500">Simple</span> by Design
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Stop wrestling with complex infrastructure. CoreBase gives you a simple, intuitive SDK to interact with your database and auth in real-time.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div>
                <span>Type-safe SDKs</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div>
                <span>Real-time subscriptions</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">✓</div>
                <span>Automatic caching</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg">
            <Card className="bg-[#0D0D0D] border-white/10 overflow-hidden shadow-2xl shadow-orange-900/10">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto leading-relaxed">
                <div className="text-gray-500 mb-2">// 1. Install</div>
                <div className="text-white mb-4"><span className="text-orange-400">npm</span> install corebase-js</div>

                <div className="text-gray-500 mb-2">// 2. Initialize</div>
                <div className="text-purple-400">import <span className="text-white">{'{'} createClient {'}'}</span> from <span className="text-green-400">'corebase-js'</span>;</div>
                <div className="text-purple-400 mt-1">const <span className="text-white">corebase</span> = <span className="text-blue-400">createClient</span>(</div>
                <div className="pl-4 text-green-400">'https://project.corebase.dev'<span className="text-white">,</span></div>
                <div className="pl-4 text-green-400">'your-public-api-key'</div>
                <div className="text-white">);</div>

                <br />
                <div className="text-gray-500 mb-2">// 3. Authenticate</div>
                <div className="text-purple-400">const <span className="text-white">{'{'} data, error {'}'}</span> = <span className="text-purple-400">await</span> corebase.<span className="text-blue-400">auth</span>.<span className="text-yellow-300">signUp</span>({'{'}</div>
                <div className="pl-4 text-white">email: <span className="text-green-400">'user@example.com'</span>,</div>
                <div className="pl-4 text-white">password: <span className="text-green-400">'password123'</span></div>
                <div className="text-white">{'}'});</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-y border-white/5 py-12 bg-white/2">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">99.99%</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">50ms</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Latency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">10k+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Developers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">1B+</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Requests</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative rounded-3xl bg-linear-to-b from-orange-900/20 to-neutral-900 border border-orange-500/20 p-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
            Ready to <span className="text-orange-500">Scale</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of developers building the future with CoreBase.
            Get started for free today.
          </p>
          <div className="flex justify-center relative z-10">
            <Link href="/platform/signup">
              <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-orange-50 border-0 shadow-xl shadow-orange-900/20 rounded-full transition-all hover:scale-105">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>


      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -8, transition: { duration: 0.3 } }}>
      <Card className="bg-neutral-900/40 border-white/5 backdrop-blur-sm text-white h-full hover:bg-orange-950/20 hover:border-orange-500/20 transition-all duration-300 group overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-neutral-800 to-neutral-900 flex items-center justify-center mb-4 border border-white/5 group-hover:border-orange-500/30 group-hover:shadow-lg group-hover:shadow-orange-500/10 transition-all duration-300">
            {icon}
          </div>
          <CardTitle className="text-xl group-hover:text-orange-100 transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-500 text-base leading-relaxed group-hover:text-gray-400 transition-colors">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
