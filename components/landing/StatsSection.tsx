"use client";
import { motion } from "framer-motion";

export function StatsSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const statVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, type: "spring" as const, bounce: 0.4 } }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 lg:mb-32 border-y border-white/5 py-12 bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl mx-2 md:mx-0 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-linear-to-r from-primary-600/5 via-transparent to-primary-600/5 pointer-events-none" />

            <motion.div variants={statVariants} className="text-center relative z-10">
                <div className="text-3xl md:text-5xl font-bold text-white mb-2">99.99<span className="text-primary-400">%</span></div>
                <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-semibold">Uptime</div>
            </motion.div>
            <motion.div variants={statVariants} className="text-center relative z-10">
                <div className="text-3xl md:text-5xl font-bold text-white mb-2">50<span className="text-primary-400">ms</span></div>
                <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-semibold">Latency</div>
            </motion.div>
            <motion.div variants={statVariants} className="text-center relative z-10">
                <div className="text-3xl md:text-5xl font-bold text-white mb-2">10<span className="text-primary-400">k+</span></div>
                <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-semibold">Developers</div>
            </motion.div>
            <motion.div variants={statVariants} className="text-center relative z-10">
                <div className="text-3xl md:text-5xl font-bold text-white mb-2">1<span className="text-primary-400">B+</span></div>
                <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-semibold">Requests</div>
            </motion.div>
        </motion.div>
    );
}
