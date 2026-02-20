"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function CodePreviewSection() {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="flex flex-col md:flex-row items-center gap-12 mb-24 lg:mb-32"
        >
            <div className="flex-1 space-y-6 text-center md:text-left">
                <motion.h2
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: false }}
                    className="text-3xl md:text-4xl font-bold"
                >
                    <span className="text-primary-500">Simple</span> by Design
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: false }}
                    className="text-gray-400 text-lg md:text-xl leading-relaxed"
                >
                    Stop wrestling with complex infrastructure. CoreBase gives you a simple, intuitive SDK to interact with your database and auth in real-time.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: false }}
                    className="flex flex-col gap-4 max-w-sm mx-auto md:mx-0"
                >
                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-gray-300 transition-transform">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0 text-sm">✓</div>
                        <span>Type-safe SDKs</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-gray-300 transition-transform">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0 text-sm">✓</div>
                        <span>Real-time subscriptions</span>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-gray-300 transition-transform">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0 text-sm">✓</div>
                        <span>Automatic caching</span>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                viewport={{ once: true }}
                className="flex-1 w-full max-w-lg perspective-1000"
            >
                <Card className="bg-[#0D0D0D] border-white/10 overflow-hidden shadow-2xl shadow-primary-900/10 hover:shadow-primary-500/20 transition-all duration-500 transform hover:-translate-y-2">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="p-4 md:p-6 font-mono text-xs md:text-sm overflow-x-auto leading-relaxed text-left whitespace-pre">
                        <div className="text-gray-500 mb-2">// 1. Install</div>
                        <div className="text-white mb-4"><span className="text-primary-400">npm</span> install corebase-js</div>

                        <div className="text-gray-500 mb-2">// 2. Initialize</div>
                        <div className="text-purple-400">import <span className="text-white">{'{'} createClient {'}'}</span> from <span className="text-green-400">'corebase-js'</span>;</div>
                        <div className="text-purple-400 mt-1">const <span className="text-white">corebase</span> = <span className="text-blue-400">createClient</span>(</div>
                        <div className="pl-4 text-green-400">'https://corebase.trivyaa.in'<span className="text-white">,</span></div>
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
            </motion.div>
        </motion.div>
    );
}
