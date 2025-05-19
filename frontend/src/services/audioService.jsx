// audioService.jsx
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/audio';

// Function to handle the audio file upload and get the summary
export const uploadAudioAndSummarize = async (file) => {
  try {
    const formData = new FormData();
    formData.append('audio', file);

    // Post the file to the backend
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the summary data from the response
    return response.data;
  } catch (error) {
    console.error('Error in uploading and summarizing audio:', error);
    throw new Error('Failed to upload and summarize audio.');
  }
};


