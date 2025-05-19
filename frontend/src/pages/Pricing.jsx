import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Pricing data based on billing cycle
  const pricingData = {
    monthly: {
      free: {
        price: "Rs0",
        features: ["Create up to 50 notes", "250 MB storage"],
      },
      basic: {
        price: "Rs14.99",
        features: ["Create up to 1000 notes", "5 GB storage", "Basic support"],
      },
      pro: {
        price: "Rs24.99",
        features: [
          "Unlimited notes",
          "20 GB storage",
          "Priority support",
          "Advanced analytics",
        ],
      },
    },
    annual: {
      free: {
        price: "Rs0",
        features: ["Create up to 50 notes", "250 MB storage"],
      },
      basic: {
        price: "Rs149.99", // Annual price (12 months * Rs14.99 with a discount)
        features: [
          "Create up to 1000 notes",
          "5 GB storage",
          "Basic support",
          "1 free month",
        ],
      },
      pro: {
        price: "Rs249.99", // Annual price (12 months * Rs24.99 with a discount)
        features: [
          "Unlimited notes",
          "20 GB storage",
          "Priority support",
          "Advanced analytics",
          "2 free months",
        ],
      },
    },
  };

  const currentPricing = pricingData[billingCycle];

  return (
    <div className="min-h-screen relative overflow-hidden pt-20">
      {/* Modern Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(201,235,255,0.8),transparent)]"></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Which Tashreeh is right for me?
          </h1>

          {/* Billing Toggle */}
          <div className="inline-flex p-1 space-x-1 bg-blue-50/50 backdrop-blur-sm rounded-xl">
            <motion.button
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setBillingCycle("monthly")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Monthly
            </motion.button>
            <motion.button
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                billingCycle === "annual"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setBillingCycle("annual")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Annual
            </motion.button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <AnimatePresence mode="wait">
            {["free", "basic", "pro"].map((plan, index) => (
              <motion.div
                key={`${plan}-${billingCycle}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 
                  border border-blue-100 shadow-lg hover:shadow-xl 
                  transition-all duration-300 group"
              >
                {plan === "pro" && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 
                    bg-blue-600 text-white text-sm font-medium rounded-full"
                  >
                    Most Popular
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {plan.toUpperCase()}
                </h2>

                <div className="mb-4 flex items-baseline">
                  <motion.span
                    key={currentPricing[plan].price}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {currentPricing[plan].price}
                  </motion.span>
                  <span className="text-gray-500 ml-2">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">
                  {plan === "free" && "Get started with basic features"}
                  {plan === "basic" && "Perfect for personal use"}
                  {plan === "pro" && "For power users and professionals"}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 
                    ${
                      plan === "pro"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                >
                  {plan === "free"
                    ? "Start For Free"
                    : `Choose ${plan.charAt(0).toUpperCase() + plan.slice(1)}`}
                </motion.button>

                <div className="space-y-3 mt-8">
                  <h3 className="font-medium mb-2 text-gray-900">
                    {plan === "free"
                      ? "What's included:"
                      : `Everything in ${
                          plan === "basic" ? "Free" : "Basic"
                        }, plus:`}
                  </h3>
                  {currentPricing[plan].features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center text-gray-600"
                    >
                      <HiCheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
