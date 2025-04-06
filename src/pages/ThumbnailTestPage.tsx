import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Layout, Smartphone, BarChart2, AlertCircle } from 'lucide-react';
import { YouTubeSimulator } from '../components/YouTubeSimulator';
import { useStore } from '../store';

export function ThumbnailTestPage() {
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
        <title>Test Your YouTube Thumbnails | Thumbnail Tester</title>
        <meta name="description" content="Test your YouTube thumbnails in a realistic environment. See how they look in different YouTube layouts and get instant feedback." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Test Your YouTube Thumbnails
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how your thumbnails look in different YouTube environments and get instant feedback on their effectiveness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Preview Features</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Layout className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Multiple Layouts</h3>
                  <p className="text-sm text-gray-500">Test in search, suggested, and homepage views</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Smartphone className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Device Preview</h3>
                  <p className="text-sm text-gray-500">See how thumbnails look on mobile and desktop</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Performance Analysis</h3>
                  <p className="text-sm text-gray-500">Get insights on potential click-through rate</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              Upload your thumbnails to test
            </p>
            <p className="mt-2 text-sm text-gray-500">
              or
            </p>
            <label className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
              Select Files
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileInput}
              />
            </label>
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