import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  HiOutlineDocument,
  HiOutlineDocumentAdd,
  HiOutlineFolder,
  HiOutlineFolderAdd,
  HiOutlineMicrophone,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../config/api";
import useAuthStore from "../store/authStore";

function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      console.error("User ID is not available. Redirecting to login.");
      navigate("/login");
      return;
    }
    fetchUserFolders();
  }, [user?.id, navigate]);

  const fetchUserFolders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found. Redirecting to login.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_ENDPOINTS.FILES.FOLDERS}/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching folders:", response.status, errorData);
        if (response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
          navigate("/login");
        } else {
          toast.error(
            `Failed to fetch folders: ${
              errorData?.error || response.statusText
            }`
          );
        }
        return;
      }

      const data = await response.json();
      setFolders(data);
      console.log("Folders fetched successfully:", data.length);
    } catch (error) {
      console.error("Network error while fetching folders:", error);
      toast.error("Unable to connect to the server. Please try again later.");
    }
  };

  const handleCreateFolder = async () => {
    if (!user?.id) {
      console.error("User ID not available for creating folder.");
      toast.error("User session invalid. Please log in again.");
      return;
    }
    if (!newFolderName.trim()) {
      toast.warn("Please enter a folder name.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn(
          "No token found during folder creation. Redirecting to login."
        );
        navigate("/login");
        return;
      }

      const response = await fetch(API_ENDPOINTS.FILES.FOLDER, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newFolderName, user: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating folder:", response.status, errorData);
        toast.error(
          `Failed to create folder: ${errorData?.error || response.statusText}`
        );
        return;
      }

      const newFolder = await response.json();
      setFolders([...folders, newFolder]);
      setShowNewFolderModal(false);
      setNewFolderName("");
      toast.success("Folder created successfully!");
      console.log("Folder created on server:", newFolder);
    } catch (error) {
      console.error("Network error while creating folder:", error);
      toast.error("Failed to create folder. Please try again.");
    }
  };
  const handleCreateFile = async () => {
    console.log("handleCreateFile called!");
    if (!selectedFolder) {
      toast.warn("Please select a folder first.");
      console.log("No folder selected");
      return;
    }
    if (!newFileName) {
      toast.warn("Please select a file to upload.");
      console.log("No file selected");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn(
          "No token found during file creation. Redirecting to login."
        );
        toast.error("Authentication failed. Please log in again.");
        navigate("/login");
        return;
      }

      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0];
      console.log("Selected file:", {
        name: file?.name,
        size: file?.size,
        type: file?.type,
      });

      if (!file) {
        toast.warn("Please select a file to upload.");
        console.log("File input is empty");
        return;
      }

      if (file.size === 0) {
        toast.warn(
          "Cannot upload an empty file. Please select a valid .docx file."
        );
        console.log("Selected file is empty");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderId", selectedFolder._id || selectedFolder.id);
      formData.append("userId", user._id || user.id);

      console.log("Sending upload request to server...");
      const response = await fetch(API_ENDPOINTS.FILES.UPLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Server response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating file:", response.status, errorData);
        toast.error(
          `Failed to create file: ${errorData?.error || response.statusText}`
        );
        return;
      }

      const result = await response.json();
      setFolders((prevFolders) =>
        prevFolders.map((folder) => {
          const folderIdToCheck = folder._id
            ? folder._id.toString()
            : folder.id;
          const selectedFolderId = selectedFolder._id
            ? selectedFolder._id.toString()
            : selectedFolder.id;
          if (folderIdToCheck === selectedFolderId) {
            return {
              ...folder,
              files: [...(folder.files || []), result.file],
            };
          }
          return folder;
        })
      );

      setShowNewFileModal(false);
      setNewFileName("");
      toast.success("File uploaded successfully!");
      console.log("File uploaded to server:", result.file);
    } catch (error) {
      console.error("Network error while creating file:", error);
      toast.error("Failed to upload file. Please try again.");
    }
  };

  const handleViewFile = async (fileId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_ENDPOINTS.FILES.FILE}/view/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response is JSON (error) or blob (file)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load file");
      }

      if (!response.ok) {
        throw new Error("Failed to load file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Open in a new window/tab
      window.open(url, "_blank");

      // Cleanup the URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error(
        error.message || "Failed to load the file. Please try again."
      );
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this folder?")) return;
    const res = await fetch(`${API_ENDPOINTS.FILES.FOLDER}/${folderId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setFolders(folders.filter((f) => (f._id || f.id) !== folderId));
      toast.success("Folder deleted!");
    } else {
      toast.error("Failed to delete folder");
    }
  };

  const handleDeleteFile = async (fileId, folderId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    const res = await fetch(`${API_ENDPOINTS.FILES.FILE}/${fileId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setFolders(
        folders.map((folder) =>
          (folder._id || folder.id) === folderId
            ? {
                ...folder,
                files: folder.files.filter((f) => (f._id || f.id) !== fileId),
              }
            : folder
        )
      );
      toast.success("File deleted!");
    } else {
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e8fff9] px-8 py-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2A2A72] to-[#009FFD] bg-clip-text text-transparent">
              Welcome, {user?.email || "User"}
            </h1>
            <p className="text-gray-600 mt-2">Manage your lectures and notes</p>
          </div>
          <Link to="/work">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-[#2A2A72] to-[#009FFD] text-white 
                rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <HiOutlineMicrophone className="text-xl" />
              Start New Lecture
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Folders Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Folders</h2>
              <motion.button
                key="add-folder-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewFolderModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#2A2A72] to-[#009FFD] text-white rounded-xl
                  flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <HiOutlineFolderAdd className="text-xl" />
                Add a Subject
              </motion.button>
            </div>

            {/* Folders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {folders.map((folder) => (
                <motion.div
                  key={folder._id || folder.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-[#f8faff] to-[#f0f9ff]
                    border border-blue-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <HiOutlineFolder className="text-2xl text-blue-500" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {folder.files?.length || 0} files
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        key={`add-file-${folder._id || folder.id}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedFolder(folder);
                          setShowNewFileModal(true);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <HiOutlineDocumentAdd className="text-xl" />
                      </motion.button>
                      <motion.button
                        key={`delete-folder-${folder._id || folder.id}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleDeleteFolder(folder._id || folder.id)
                        }
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <HiOutlineTrash className="text-xl" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Files List */}
                  {folder.files && folder.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {folder.files.map((file) => (
                        <div
                          key={file._id || file.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50"
                        >
                          <div className="flex items-center gap-2">
                            <HiOutlineDocument className="text-gray-500" />
                            <button
                              onClick={() => handleViewFile(file.fileId)}
                              className="text-sm text-gray-700 hover:text-blue-500 transition-colors duration-200 text-left"
                            >
                              {file.name}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              key={`work-${file._id || file.id}`}
                              to={`/work/${file._id || file.id}`}
                              className="p-1 text-green-500 hover:bg-green-50 rounded"
                            >
                              <HiOutlineMicrophone className="text-lg" />
                            </Link>
                            <button
                              key={`edit-${file._id || file.id}`}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                            >
                              <HiOutlinePencil className="text-lg" />
                            </button>
                            <button
                              key={`delete-${file._id || file.id}`}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              onClick={() =>
                                handleDeleteFile(
                                  file._id || file.id,
                                  folder._id || folder.id
                                )
                              }
                            >
                              <HiOutlineTrash className="text-lg" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#f8faff] to-[#f0f9ff] border border-blue-100">
                <p className="text-sm text-gray-600">Total Folders</p>
                <p className="text-2xl font-bold text-gray-800">
                  {folders.length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#f8faff] to-[#f0f9ff] border border-blue-100">
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-800">
                  {folders.reduce(
                    (acc, folder) => acc + (folder.files?.length || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div
          key="new-folder-modal"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4"
              placeholder="Folder name"
            />
            <div className="flex justify-end gap-3">
              <button
                key="cancel-create-folder"
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                key="confirm-create-folder"
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-gradient-to-r from-[#2A2A72] to-[#009FFD] text-white rounded-xl"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showNewFileModal && (
        <div
          key="new-file-modal"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-semibold mb-4">Upload New File</h3>
            <input
              type="file"
              accept=".docx"
              onChange={(e) => setNewFileName(e.target.files[0]?.name || "")}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                key="cancel-create-file"
                onClick={() => {
                  setShowNewFileModal(false);
                  setNewFileName("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                key="confirm-create-file"
                onClick={handleCreateFile}
                className="px-4 py-2 bg-gradient-to-r from-[#2A2A72] to-[#009FFD] text-white rounded-xl"
              >
                Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
