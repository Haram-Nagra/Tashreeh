import { create } from "zustand";

const useSummarizationStore = create((set) => ({
  transcriptionText: "", // Stores the text from AudioRecorder
  setTranscriptionText: (text) => set({ transcriptionText: text }),
}));

export default useSummarizationStore;
