import axios from "axios";
import { Document, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BsImages, BsRobot } from "react-icons/bs";
import { FiClock, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineTranslate,
} from "react-icons/hi";
import { useLocation } from "react-router-dom";

const SummarizationPage = () => {
  const location = useLocation();
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [length, setLength] = useState("short");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [canvasImage, setCanvasImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (location.state?.transcription) {
      setInputText(location.state.transcription);
    }
    if (location.state?.image) {
      setImage(location.state.image);
    }
    if (location.state?.canvasImage) {
      setCanvasImage(location.state.canvasImage);
    }
  }, [location.state]);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to summarize");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/summarization",
        {
          text: inputText,
          language: language,
          length: length,
        }
      );
      setSummary(response.data.summary);
      setShowPreview(true);
    } catch (error) {
      setError(
        "Failed to summarize. " + (error.response?.data?.error || error.message)
      );
      setSummary("");
    }
    setLoading(false);
  };

  const handleDownloadDocx = async () => {
    if (!summary) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Summary Report",
              heading: "Title",
            }),
            new Paragraph("\n"),
            new Paragraph({
              children: [
                new TextRun({ text: summary, rtl: language === "Urdu" }),
              ],
            }),
            new Paragraph("\n"),
            new Paragraph("Attached Notes:"),
            new Paragraph("(Canvas Image Below)"),
            ...(canvasImage
              ? [
                  new Paragraph({
                    children: [new TextRun("Canvas Image:")],
                  }),
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: canvasImage,
                        transformation: { width: 500, height: 300 },
                      }),
                    ],
                  }),
                ]
              : []),
            ...(image
              ? [
                  new Paragraph({
                    children: [new TextRun("Uploaded Image:")],
                  }),
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: image,
                        transformation: { width: 500, height: 300 },
                      }),
                    ],
                  }),
                ]
              : []),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "summary.docx");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e8fff9]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Header Section */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2A2A72] to-[#009FFD] bg-clip-text text-transparent">
            AI-Powered Summary Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Transform your lecture notes into concise, meaningful summaries
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Text Input Card */}
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 
              shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineDocumentText className="text-2xl text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Input Text
                </h2>
              </div>
              <textarea
                className="w-full p-4 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-200 
                  focus:border-blue-500 transition-all duration-300 min-h-[200px] bg-white/50"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter or paste your text here..."
              />
            </div>

            {/* Settings Card */}
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 
              shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiOutlineTranslate className="text-xl text-blue-500" />
                    <h3 className="font-medium text-gray-700">
                      Output Language
                    </h3>
                  </div>
                  <select
                    className="w-full p-3 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-200 
                      focus:border-blue-500 transition-all duration-300 bg-white/50"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiClock className="text-xl text-blue-500" />
                    <h3 className="font-medium text-gray-700">
                      Summary Length
                    </h3>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setLength("short")}
                      className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300
                        ${
                          length === "short"
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-blue-100 text-gray-600 hover:bg-blue-50"
                        }`}
                    >
                      <FiMinimize2 /> Concise
                    </button>
                    <button
                      onClick={() => setLength("long")}
                      className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300
                        ${
                          length === "long"
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-blue-100 text-gray-600 hover:bg-blue-50"
                        }`}
                    >
                      <FiMaximize2 /> Detailed
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSummarize}
              disabled={loading}
              className="w-full p-4 bg-gradient-to-r from-[#2A2A72] to-[#009FFD] text-white rounded-xl
                font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50
                disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <BsRobot className="text-xl" />
                  Generate Summary
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 
              shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[600px]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BsRobot className="text-2xl text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Generated Summary
                  </h2>
                </div>
                {summary && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownloadDocx}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2A2A72] to-[#009FFD] 
                      text-white rounded-lg hover:opacity-90 transition-all duration-300"
                  >
                    <HiOutlineDownload className="text-lg" />
                    Download DOCX
                  </motion.button>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 mb-4"
                >
                  {error}
                </motion.div>
              )}

              {summary ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div
                    className="p-4 rounded-xl bg-gradient-to-br from-[#f8faff] to-[#f0f9ff] 
                    border border-blue-100/50"
                  >
                    <p className="whitespace-pre-line text-gray-700">
                      {summary}
                    </p>
                  </div>

                  {(image || canvasImage) && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <BsImages className="text-xl text-blue-500" />
                        <h3 className="font-medium text-gray-700">
                          Attached Images
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {canvasImage && (
                          <img
                            src={canvasImage}
                            alt="Canvas Notes"
                            className="rounded-lg border border-blue-100 object-cover w-full h-40"
                          />
                        )}
                        {image && (
                          <img
                            src={image}
                            alt="Uploaded"
                            className="rounded-lg border border-blue-100 object-cover w-full h-40"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                  <BsRobot className="text-6xl mb-4 text-blue-200" />
                  <p>Your summary will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SummarizationPage;
