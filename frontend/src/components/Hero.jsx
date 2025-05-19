import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";
import {
  RiRocketLine,
  RiShieldLine,
  RiStarLine,
  RiTeamLine,
} from "react-icons/ri";
import heroImage from "../assets/use-case-education-1.png";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the gradient text
      gsap.to(".gradient-animate", {
        backgroundImage: "linear-gradient(45deg, #2A2A72, #009FFD, #2A2A72)",
        backgroundSize: "200%",
        repeat: -1,
        duration: 4,
        ease: "none",
        backgroundPosition: ["0% 50%", "200% 50%"],
      });

      // Animate stats counting up
      gsap.from(".stat-number", {
        textContent: 0,
        duration: 2,
        ease: "power1.out",
        snap: { textContent: 1 },
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".stats-grid",
          start: "top 80%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px -10px rgba(42, 42, 114, 0.4)",
    },
    tap: { scale: 0.95 },
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden font-robotoCondensed"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-[#2A2A72] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
        <div className="absolute right-0 w-[500px] h-[500px] bg-[#009FFD] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full mb-14">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-blue-50 rounded-full"
              >
                <span className="text-blue-600 font-semibold">
                  ✨ AI-Powered Note Taking
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block text-[#002244]"
                >
                  Unlock Knowledge,
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="block"
                >
                  <span className="gradient-animate bg-clip-text text-transparent">
                    One Lecture at a Time
                  </span>
                </motion.span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-600 text-xl md:text-2xl max-w-2xl leading-relaxed"
            >
              Transform lengthy lectures into concise, well-organized study
              notes with AI-powered precision. Stay ahead, study smarter, and
              succeed effortlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex gap-4 pt-4"
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-r from-[#2A2A72] to-[#009FFD] text-white px-8 py-4 rounded-xl
                  text-lg font-semibold shadow-lg flex items-center gap-2 group"
              >
                Start for Free
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-8 py-4 rounded-xl text-lg font-semibold border-2 border-[#2A2A72] 
                  text-[#2A2A72] hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                Watch Demo
                <span>▶</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative pt-10"
          >
            {/* Modern 3D Card Effect */}
            <motion.div
              animate={{
                rotateY: [0, 10, 0],
                rotateX: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative w-full aspect-video bg-gradient-to-br from-white to-blue-50 
                rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm"
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* Add some decorative elements */}
              <div className="absolute top-4 left-4 w-2/3 h-8 bg-blue-200/20 rounded-lg" />
              <div className="absolute top-16 left-4 w-1/2 h-8 bg-blue-200/20 rounded-lg" />
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-br from-[#2A2A72] to-[#009FFD] rounded-2xl opacity-20" />

              {/* Add the image here */}
              <img
                src={heroImage}
                alt="Descriptive Alt Text"
                className="absolute inset-0 w-full h-full object-contain opacity-80"
                style={{ zIndex: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-20 -mt-4"
        >
          {[
            { icon: RiRocketLine, number: "5M+", label: "users worldwide" },
            { icon: RiTeamLine, number: "4,000+", label: "teams trust us" },
            { icon: RiShieldLine, number: "100%", label: "SOC-2 compliant" },
            { icon: RiStarLine, number: "4.6", label: "rated on G2" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center justify-center p-6 rounded-2xl
                bg-white/50 backdrop-blur-sm border border-blue-100/50 hover:shadow-lg
                transition-all duration-300"
            >
              <stat.icon className="text-3xl text-blue-600 mb-2" />
              <p className="stat-number font-bold text-2xl text-[#2A2A72]">
                {stat.number}
              </p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
