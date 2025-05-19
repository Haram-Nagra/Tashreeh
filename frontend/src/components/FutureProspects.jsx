import { motion } from "framer-motion";
import React from "react";

const FutureProspects = () => {
  const prospects = [
    "AI-Powered Learning Tools",
    "Real-Time Collaboration Features",
    "Enhanced Data Analytics",
    "Personalized Learning Experiences",
    "Seamless Integration with Other Platforms",
    "Advanced Security Features",
    "Interactive Learning Modules",
    "Gamification of Learning Processes",
  ];

  return (
    <div className="relative overflow-hidden bg-gray-50">
      <motion.div
        className="whitespace-nowrap"
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {prospects.map((prospect, index) => (
          <div
            key={index}
            className="inline-block px-8 py-2 text-xl font-semibold text-gray-800 bg-gradient-to-r from-[#A7C6ED] to-[#B3E0F7] rounded-lg shadow-md mx-2"
          >
            {prospect}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default FutureProspects;
