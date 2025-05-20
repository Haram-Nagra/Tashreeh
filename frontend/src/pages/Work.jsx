import { useEffect, useRef, useState } from "react";
import { BiUndo } from "react-icons/bi";
import { BsLightbulbFill } from "react-icons/bs";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { MdClear, MdSave } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ReactSketchCanvas } from "react-sketch-canvas";
import WaveSurfer from "wavesurfer.js";
import API_ENDPOINTS from "../config/api";
import "../index.css"; // Import CSS file for animations

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [dynamicText, setDynamicText] = useState(""); // Transcription text from SpeechRecognition
  const [listening, setListening] = useState(false); // State for SpeechRecognition
  const recognitionRef = useRef(null); // Ref for SpeechRecognition
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [showWaveform, setShowWaveform] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [language, setLanguage] = useState("ur-PK"); // Add language state

  // Summarize Button Handler
  const handleSummarize = () => {
    canvasRef.current.exportImage("png").then((canvasImage) => {
      navigate("/summarization", {
        state: {
          transcription: dynamicText,
          image: image, // Pass uploaded image
          canvasImage: canvasImage, // Pass canvas as image
        },
      });
    });
  };

  // Notepad Ref
  const canvasRef = useRef(null);

  // Image Upload States
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.lang = language; // Use language state
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Enable interim results

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.trim();

        if (result.isFinal) {
          finalTranscript +=
            text.charAt(0).toUpperCase() + text.slice(1) + ".\n";
        } else {
          interimTranscript += text;
        }
      }

      // Update the transcript state while preserving previous content
      setDynamicText((prev) => {
        // Remove previous interim results (lines ending with "...")
        const prevFinalTranscript = prev
          .split("\n")
          .filter((line) => !line.endsWith("..."))
          .join("\n");
        // Append new final and interim results
        return (
          prevFinalTranscript +
          finalTranscript +
          (interimTranscript ? interimTranscript + "..." : "")
        );
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Make sure a microphone is attached and permission is granted.");
      setListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [language]);

  // Initialize WaveSurfer
  useEffect(() => {
    if (audioURL) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#AAA",
        progressColor: "#FFF",
        cursorColor: "#FFF",
        barWidth: 2,
        height: 100,
        responsive: true,
      });

      wavesurferRef.current.load(audioURL);
      if (!isRecording) setShowWaveform(true);
    }

    return () => {
      if (wavesurferRef.current) wavesurferRef.current.destroy();
    };
  }, [audioURL, isRecording]);

  // Start/Stop SpeechRecognition
  const toggleRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setListening((prev) => !prev);
  };

  // Start/Stop Audio Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setShowWaveform(true);
    };

    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
    setIsPaused(false);
    setShowWaveform(false);
    toggleRecognition(); // Start SpeechRecognition
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
    toggleRecognition(); // Stop SpeechRecognition
  };

  // Save Recording and Upload to Backend
  const saveRecording = async () => {
    if (audioChunksRef.current.length === 0) return;

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });

    setIsLoading(true);
    await uploadAudio(file);
    setIsLoading(false);
  };

  const uploadAudio = async (file) => {
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch(API_ENDPOINTS.AUDIO.UPLOAD, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully!");
      } else {
        console.error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  // Handle Image Upload
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => setImage(null);

  // Add language toggle function
  const toggleLanguage = () => {
    const newLanguage = language === "ur-PK" ? "en-US" : "ur-PK";
    setLanguage(newLanguage);
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage;
    }
    if (listening) {
      recognitionRef.current.stop();
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e8fff9]">
      {/* Left Panel - Transcription */}
      <div className="flex flex-col w-1/2 p-8 space-y-6 mt-20">
        <div
          className="rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 
          shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 h-[600px] flex flex-col"
        >
          <h2
            className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#1f2041] to-[#119da4] 
            bg-clip-text text-transparent animate-gradient"
          >
            Voice Transcription
          </h2>
          <div
            className="flex-grow mb-4 p-4 rounded-xl bg-gradient-to-br from-[#f8faff] to-[#f0f9ff] 
            border border-blue-100/50 shadow-sm overflow-auto"
          >
            <p className="text-gray-700 whitespace-pre-wrap">{dynamicText}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 
                flex items-center gap-2 hover:shadow-md hover:transform hover:-translate-y-0.5
                bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600"
            >
              {language === "ur-PK" ? "اردو" : "English"}
            </button>
            <button
              onClick={
                isRecording
                  ? isPaused
                    ? resumeRecording
                    : pauseRecording
                  : startRecording
              }
              className={`px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 
                flex items-center gap-2 hover:shadow-md hover:transform hover:-translate-y-0.5 ${
                  isRecording
                    ? isPaused
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600"
                      : "bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600"
                    : "bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600"
                }`}
            >
              {isRecording ? (
                isPaused ? (
                  <>
                    <FaPlay className="text-lg" /> Resume
                  </>
                ) : (
                  <>
                    <FaPause className="text-lg" /> Pause
                  </>
                )
              ) : (
                <>
                  <FaPlay className="text-lg" /> Start
                </>
              )}
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className={`px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 
                flex items-center gap-2 hover:shadow-md hover:transform hover:-translate-y-0.5 ${
                  isRecording
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600"
                    : "bg-gradient-to-r from-slate-300 to-slate-400 cursor-not-allowed"
                }`}
            >
              <FaStop className="text-lg" /> Stop
            </button>
            <button
              onClick={saveRecording}
              disabled={!audioURL}
              className={`px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 
                flex items-center gap-2 hover:shadow-md hover:transform hover:-translate-y-0.5 ${
                  audioURL
                    ? "bg-gradient-to-r from-violet-400 to-violet-500 hover:from-violet-500 hover:to-violet-600"
                    : "bg-gradient-to-r from-slate-300 to-slate-400 cursor-not-allowed"
                }`}
            >
              <MdSave className="text-lg" /> Save
            </button>
            <button
              onClick={handleSummarize}
              disabled={!dynamicText}
              className={`px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 
                flex items-center gap-2 hover:shadow-md hover:transform hover:-translate-y-0.5 ${
                  dynamicText
                    ? "bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600"
                    : "bg-gradient-to-r from-slate-300 to-slate-400 cursor-not-allowed"
                }`}
            >
              <BsLightbulbFill className="text-lg" /> Summarize
            </button>
          </div>

          <div className="mt-4">
            {!showWaveform && isLoading && (
              <div className="loading-bar">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
            {showWaveform && audioURL && (
              <div
                className="rounded-lg overflow-hidden bg-gradient-to-br from-[#f8faff] to-[#f0f9ff] p-3 
                border border-blue-100/50"
              >
                <div ref={waveformRef} className="w-full h-24" />
                <audio controls src={audioURL} className="w-full mt-2" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Notepad & Image Upload */}
      <div className="flex flex-col w-1/2 p-8 space-y-4 mt-20">
        {/* Notepad Section */}
        <div
          className="rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 
          shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6"
        >
          <h2
            className="text-xl font-semibold mb-4 bg-gradient-to-r from-[#1f2041] to-[#119da4] 
            bg-clip-text text-transparent"
          >
            Notepad
          </h2>
          <div
            className="rounded-xl bg-gradient-to-br from-[#f8faff] to-[#f0f9ff] p-2 
            border border-blue-100/50 overflow-auto max-h-[400px]"
          >
            <ReactSketchCanvas
              ref={canvasRef}
              strokeWidth={3}
              strokeColor="#1f2041"
              width="100%"
              height="800px"
              style={{
                borderRadius: "0.75rem",
                border: "1px solid rgba(219, 234, 254, 0.2)",
                minHeight: "400px",
              }}
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => canvasRef.current.clearCanvas()}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl 
                hover:from-rose-500 hover:to-rose-600 transition-all duration-300 flex items-center gap-2 
                hover:shadow-md hover:transform hover:-translate-y-0.5 font-medium"
            >
              <MdClear className="text-lg" /> Clear
            </button>
            <button
              onClick={() => canvasRef.current.undo()}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white rounded-xl 
                hover:from-indigo-500 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2 
                hover:shadow-md hover:transform hover:-translate-y-0.5 font-medium"
            >
              <BiUndo className="text-lg" /> Undo
            </button>
          </div>
        </div>

        {/* Image Upload Section */}
        <div
          className="rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-100 
          shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6"
        >
          <h2
            className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#1f2041] to-[#119da4] 
            bg-clip-text text-transparent"
          >
            Upload Image
          </h2>
          <div
            className="border border-blue-100/50 bg-gradient-to-br from-[#f8faff] to-[#f0f9ff] p-4 
              text-center cursor-pointer rounded-xl transition-all duration-300 
              hover:shadow-lg hover:border-blue-200"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current.click()}
          >
            {image ? (
              <div className="relative group">
                <img
                  src={image}
                  alt="Uploaded"
                  className="max-h-32 mx-auto rounded-lg shadow-sm object-contain"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30 rounded-lg 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                  flex items-center justify-center"
                >
                  <p className="text-white font-medium">
                    Click to change image
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <FiUploadCloud className="w-10 h-10 text-blue-500 animate-pulse" />
                <div>
                  <p className="text-gray-600 font-medium text-sm mb-1">
                    Drag & drop an image or click to upload
                  </p>
                  <p className="text-blue-500 text-xs">
                    Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {image && (
            <button
              onClick={clearImage}
              className="mt-4 px-4 py-2.5 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl 
                hover:from-rose-500 hover:to-rose-600 transition-all duration-300 flex items-center gap-2 
                mx-auto hover:shadow-md hover:transform hover:-translate-y-0.5 font-medium"
            >
              <MdClear className="text-lg" /> Remove Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
