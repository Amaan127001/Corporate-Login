import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, X, ArrowRight, Linkedin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded';
}

const ProfileCompletion = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const navigate = useNavigate();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress] = useState(60);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes > 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
    return `${Math.round(bytes / 1024)}KB`;
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (type.includes('wordprocessingml')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('presentationml')) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    if (files.length > 5) {
      showAlert('You can upload a maximum of 5 files.');
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showAlert(`File "${file.name}" is too large (max 5MB)`);
        return;
      }

      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];

      if (!validTypes.includes(file.type)) {
        showAlert(`File "${file.name}" has an invalid type (only PDF, DOCX, PPTX allowed)`);
        return;
      }

      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload completion
      setTimeout(() => {
        setUploadedFiles(prev =>
          prev.map(f => f.id === newFile.id ? { ...f, status: 'uploaded' } : f)
        );
      }, 1500);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const showAlert = (message: string) => {
    // In a real app, you'd use a proper toast/notification system
    alert(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl.trim()) {
      alert('LinkedIn URL is required.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token');
      return;
    }

    const payload = {
      token,
      profileDetails: {
        linkedin: linkedinUrl.trim(),
        documents: uploadedFiles.map(f => ({
          name: f.name,
          type: f.type,
          size: f.size
        }))
      },
      complete: true
    };

    try {
      const resp = await fetch('http://localhost:4000/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (data.success) {
        localStorage.setItem('profileCompleted', 'true');
        navigate('/dashboard');
      } else {
        alert('Error saving profile info. Please try again.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Animated Gradient Blobs */}
      <div className="">
        <div className="absolute top-[20%] left-[5%] w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[40%] left-[30%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[30%] right-[12%] w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-30 animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Navbar toggleTheme={toggleTheme} />

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Your Ingenium Profile
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                Help Ingenium understand you (or your organisation) better by providing the following details.
                This will improve campaign personalization and lead generation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* LinkedIn URL Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    LinkedIn Profile URL
                  </label>
                  <span className="text-2xl text-red-500 dark:text-red-400">*</span>
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    id="linkedin"
                    value={linkedinUrl}
                    required
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Provide your personal LinkedIn profile URL
                </p>
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Additional Documents
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Optional</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload any additional documents that can help us understand your business better
                  (e.g., sales brochures, case studies, product documentation).
                  Supported formats: PDF, DOCX, PPTX.
                </p>

                <div
                  className={`relative rounded-md px-6 pt-8 pb-8 border-2 border-dashed text-center cursor-pointer mt-3 transition-all duration-300 ${isDragActive
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-gray-700'
                    }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 animate-pulse" />
                    </div>
                    <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                        <span className="font-semibold">Drag and drop files here</span>
                        <span className="block text-xs mt-1 text-gray-500 dark:text-gray-400">
                          or click to browse your files
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="sr-only"
                          multiple
                          accept=".pdf,.docx,.pptx"
                          onChange={handleFileSelect}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Maximum file size: 5MB per file • Up to 5 files
                    </p>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md px-4 py-3 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file.type)}
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                              {file.name}
                            </span>
                            <span className={`text-xs ${file.status === 'uploaded'
                                ? 'text-green-500 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                              }`}>
                              {formatFileSize(file.size)} • {file.status === 'uploaded' ? 'Uploaded' : 'Uploading...'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Complete Registration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-4 px-4 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm lg:text-md order-2 md:order-1 mt-4 md:mt-0">
            &copy; 2025 Ingenium. All rights reserved.
          </div>
          <div className="order-1 md:order-2 flex flex-wrap justify-center gap-4 md:gap-8 text-sm lg:text-md">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              About Us
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfileCompletion;