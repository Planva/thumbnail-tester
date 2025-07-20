import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, AlertCircle } from 'lucide-react';
import { YouTubeSimulator } from '../components/YouTubeSimulator';
import { useStore } from '../store';
import { Thumbnail } from '../types';

export function ComparisonPage() {
  const { addThumbnail, thumbnails } = useStore();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        addThumbnail(file);
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <>
      <Helmet>
        <title>Compare YouTube Thumbnails | Thumbnail Test and Compare</title>
        <meta name="description" content="Compare different YouTube thumbnail designs side by side. Test their effectiveness and get insights on which performs better." />
        <meta name="keywords" content="thumbnail test and compare, youtube thumbnail test and compare" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Test Your YouTube Thumbnails
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your thumbnails to see how they look in different YouTube environments. Compare multiple versions and analyze their impact.
          </p>
        </div>

        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            } cursor-pointer`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('comparison-upload-input')?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              Drag and drop your thumbnails here
            </p>
            <p className="mt-2 text-sm text-gray-500">
              or
            </p>
            <span className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Select Files
            </span>
            <input
              id="comparison-upload-input"
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileInput}
            />
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG or GIF up to 5MB
            </p>
          </div>
        </div>

        {thumbnails.length > 0 ? (
          <YouTubeSimulator thumbnails={thumbnails} />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <p className="text-sm text-yellow-700">
              Upload thumbnails to see how they'll appear across different YouTube layouts and get insights on their performance.
            </p>
          </div>
        )}
      </div>
    </>
  );
}