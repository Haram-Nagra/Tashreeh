import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useRef } from "react";
import Feature from "../components/Feature";
import FutureProspects from "../components/FutureProspects";
import Hero from "../components/Hero";
import Intro from "../components/Intro";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Enhanced transform values for smoother parallax
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-[#f0f4ff] to-white"
    >
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: backgroundY }} className="absolute inset-0">
          {/* Adjusted positioning and sizes for better visual harmony with new Hero */}
          <div
            className="absolute top-0 left-[5%] w-[45rem] h-[45rem] 
            bg-[#2A2A72] rounded-full mix-blend-multiply filter blur-[100px] 
            opacity-[0.15] animate-blob"
          />
          <div
            className="absolute top-[10%] right-[5%] w-[40rem] h-[40rem] 
            bg-[#009FFD] rounded-full mix-blend-multiply filter blur-[100px] 
            opacity-[0.15] animate-blob animation-delay-2000"
          />
          <div
            className="absolute bottom-[5%] left-[15%] w-[50rem] h-[50rem] 
            bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] 
            opacity-[0.15] animate-blob animation-delay-4000"
          />
        </motion.div>
      </div>

      {/* Content Sections with Adjusted Spacing */}
      <div className="relative z-10">
        {/* Hero Section - Added mt-10 */}
        <section className="relative">
          <Hero />
        </section>

        {/* Intro Section with Enhanced Animation */}
        <section className="relative py-24">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 50,
            }}
          >
            <Intro />
          </motion.div>
        </section>

        {/* Features Section with Enhanced Animations */}
        <section className="relative py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 50,
              }}
              className="text-5xl font-bold bg-gradient-to-r from-[#2A2A72] to-[#009FFD] 
                bg-clip-text text-transparent mb-6"
            >
              Empowering Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 50,
              }}
              className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Discover the tools that will revolutionize your learning
              experience
            </motion.p>
          </motion.div>
          <Feature />
        </section>

        {/* Future Prospects Section */}
        <section className="relative py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 50,
              }}
              className="text-5xl font-bold bg-gradient-to-r from-[#2A2A72] to-[#009FFD] 
                bg-clip-text text-transparent mb-6"
            >
              Future Prospects
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 50,
              }}
              className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Explore the exciting features that are on the horizon.
            </motion.p>
          </motion.div>
          <FutureProspects />
        </section>

        {/* Enhanced Floating Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-full h-full">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: 0.2,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, Math.random() * 0.5 + 1.5, 1],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
