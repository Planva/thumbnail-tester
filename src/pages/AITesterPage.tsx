import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Brain, Eye, Layout, Zap, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

export function AITesterPage() {
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
    if (files[0] && files[0].type.startsWith('image/')) {
      addThumbnail(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI YouTube Thumbnail Analysis | Thumbnail Tester</title>
        <meta name="description" content="Get AI-powered insights on your YouTube thumbnails. Analyze engagement potential and get recommendations for improvement." />
        <meta name="keywords" content="ai youtube thumbnail tester, thumbnail tester ai, youtube thumbnail analysis" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            AI Thumbnail Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get AI-powered insights on your thumbnails. Our advanced algorithms analyze key elements 
            and predict engagement potential.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">AI Analysis Features</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Brain className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Visual Analysis</h3>
                  <p className="text-sm text-gray-500">
                    Our AI analyzes composition, colors, contrast, and visual hierarchy
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Eye className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Attention Prediction</h3>
                  <p className="text-sm text-gray-500">
                    See where viewers are most likely to look first
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Layout className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Layout Optimization</h3>
                  <p className="text-sm text-gray-500">
                    Get suggestions for better element placement
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Performance Prediction</h3>
                  <p className="text-sm text-gray-500">
                    Estimated click-through rate based on design elements
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
                Upload a thumbnail for AI analysis
              </p>
              <p className="mt-2 text-sm text-gray-500">
                or
              </p>
              <label className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                Select File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG or GIF up to 5MB
              </p>
            </div>

            {thumbnails.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">AI Analysis Results</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Visual Composition</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Balance</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Color Analysis</h3>
                    <p className="text-sm text-gray-600">
                      Good contrast ratio, vibrant color palette
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Predicted CTR</h3>
                    <p className="text-2xl font-bold text-indigo-600">8.5%</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                <p className="text-sm text-yellow-700">
                  Upload a thumbnail to get AI-powered insights and optimization suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}