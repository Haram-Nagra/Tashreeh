import { motion } from "framer-motion";
import React from "react";
import {
  RiAiGenerate,
  RiBrainLine,
  RiLightbulbFlashLine,
  RiTimeLine,
} from "react-icons/ri";
import introImage from "../assets/use-case-education-1.png";

const Intro = () => {
  const features = [
    {
      icon: RiAiGenerate,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms process and understand lecture content",
    },
    {
      icon: RiBrainLine,
      title: "Smart Learning",
      description: "Adaptive learning patterns for better retention",
    },
    {
      icon: RiTimeLine,
      title: "Time Efficient",
      description: "Save hours on note-taking and revision",
    },
    {
      icon: RiLightbulbFlashLine,
      title: "Enhanced Comprehension",
      description: "Better understanding through structured summaries",
    },
  ];

  return (
    <div className="px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[800px] h-[800px] bg-blue-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 -top-[400px] -right-[400px]" />
        <div className="absolute w-[600px] h-[600px] bg-[#2A2A72]/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 -bottom-[300px] -left-[300px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-blue-50 rounded-full"
              >
                <span className="text-blue-600 font-semibold">✨ About Us</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#2A2A72] to-[#009FFD] bg-clip-text text-transparent leading-tight"
              >
                A smarter way to learn and retain information
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg leading-relaxed"
              >
                At Tashreeh, we believe that learning should be efficient and
                enjoyable. Our AI-powered platform converts lecture
                transcriptions into summarized study notes, saving time and
                enhancing comprehension.
              </motion.p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100/50 
                    hover:shadow-lg transition-all duration-300 group"
                >
                  <feature.icon className="text-3xl text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative"
          >
            {/* Decorative Elements */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-3xl transform rotate-3" />
            <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-[#2A2A72]/10 to-transparent rounded-3xl transform -rotate-3" />

            {/* Main Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2A2A72] to-[#009FFD] opacity-10 rounded-2xl transform rotate-6 scale-95" />
              <img
                src={introImage}
                alt="Educational Hero"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm 
                  transform hover:rotate-0 transition-transform duration-500 rotate-3"
              />

              {/* Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 w-20 h-20 bg-blue-500/10 rounded-full backdrop-blur-md"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#2A2A72]/10 rounded-full backdrop-blur-md"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
