"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="relative rounded-[2rem] bg-linear-to-b from-primary-900/40 to-neutral-900 border border-primary-500/20 p-8 md:p-16 text-center overflow-hidden mb-12 shadow-2xl shadow-primary-900/20"
        >
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary-500/10 rounded-full blur-[80px] md:blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-primary-500/10 rounded-full blur-[80px] md:blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 relative z-10">
                Ready to <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-primary-600">Scale</span>?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
                Join thousands of developers building the future with CoreBase.
                Get started for free today.
            </p>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center relative z-10 w-full md:w-max mx-auto"
            >
                <Link href="/platform/signup" className="w-full md:w-auto">
                    <Button size="lg" className="w-full h-14 md:h-16 px-10 md:px-12 text-lg md:text-xl bg-white text-black hover:bg-primary-50 border-0 shadow-xl shadow-primary-900/20 rounded-full transition-all cursor-pointer font-semibold">
                        Create Free Account
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
