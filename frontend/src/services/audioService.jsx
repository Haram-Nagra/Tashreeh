// audioService.jsx
import axios from "axios";
import API_ENDPOINTS from "../config/api";

// Function to handle the audio file upload and get the summary
export const uploadAudioAndSummarize = async (file) => {
  try {
    const formData = new FormData();
    formData.append("audio", file);

    // Post the file to the demo endpoint
    const response = await axios.post(
      `${API_ENDPOINTS.AUDIO.BASE}/demo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return the summary data from the response
    return response.data;
  } catch (error) {
    console.error("Error in uploading and summarizing audio:", error);
    throw new Error(
      error.response?.data?.error || "Failed to upload and summarize audio."
    );
  }
};
