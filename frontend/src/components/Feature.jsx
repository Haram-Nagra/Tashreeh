import { motion } from "framer-motion";
import React from "react";
import {
  RiAiGenerate,
  RiBrainLine,
  RiFileTextLine,
  RiSpeakLine,
} from "react-icons/ri";

const Feature = () => {
  const features = [
    {
      icon: RiSpeakLine,
      title: "Real-Time Transcription",
      description:
        "Convert spoken lectures into text instantly with high accuracy and multiple language support.",
      color: "from-purple-500 to-indigo-500",
      lightColor: "purple",
    },
    {
      icon: RiAiGenerate,
      title: "AI-Powered Analysis",
      description:
        "Advanced algorithms process lecture content to identify key concepts and important points.",
      color: "from-blue-500 to-cyan-500",
      lightColor: "blue",
    },
    {
      icon: RiBrainLine,
      title: "Smart Summarization",
      description:
        "Generate concise, well-structured summaries that capture the essence of each lecture.",
      color: "from-pink-500 to-rose-500",
      lightColor: "pink",
    },
    {
      icon: RiFileTextLine,
      title: "Note Organization",
      description:
        "Automatically organize and categorize notes with smart tagging and easy search functionality.",
      color: "from-emerald-500 to-teal-500",
      lightColor: "emerald",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative px-4 lg:px-28">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-blue-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 top-0 right-0" />
        <div className="absolute w-[500px] h-[500px] bg-purple-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 bottom-0 left-0" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative"
          >
            {/* Card Background with Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A2A72] to-[#009FFD] rounded-2xl opacity-50 blur-sm group-hover:opacity-100 transition-opacity duration-300" />

            {/* Main Card Content */}
            <div
              className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100/50 
              hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            >
              {/* Icon Container */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <feature.icon className="text-2xl text-[#2A2A72]" />
                </div>
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold bg-gradient-to-r from-[#2A2A72] to-[#009FFD] bg-clip-text text-transparent mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Line */}
              <div
                className="absolute bottom-0 left-[10%] right-[10%] h-1 bg-gradient-to-r from-[#2A2A72] to-[#009FFD] 
                transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-2 right-2 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
              <div className="absolute bottom-2 left-2 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default Feature;
