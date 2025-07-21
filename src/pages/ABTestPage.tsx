import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Upload, BarChart2, Zap, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { YouTubeSimulator } from '../components/YouTubeSimulator';
import { useStore } from '../store';

export function ABTestPage() {
  const { addThumbnail, thumbnails } = useStore();
  const navigate = useNavigate();
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
    Array.from(files).slice(0, 2).forEach(file => {
      if (file.type.startsWith('image/')) {
        addThumbnail(file);
      }
    });
    // Navigate to testing page after upload
    navigate('/thumbnail-tester-online-free');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <>
      <Helmet>
        <title>YouTube Thumbnail A/B Testing | thumbnail-tester.com</title>
        <meta name="description" content="Free AI tool for quick YouTube thumbnail A/B testing. Upload two images, get real CTR insights, and pick the design that earns more clicks and views." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            YouTube Thumbnail A/B Testing Tool - Compare and Optimize Your Thumbnails
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare different versions of your YouTube thumbnails side by side. Test designs, analyze performance metrics, and choose the best performing thumbnail.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">What is A/B Testing?</h2>
            <p className="text-gray-600 mb-6">
              A/B testing (also known as split testing) is a method of comparing two versions of a thumbnail 
              to see which one performs better. It helps you make data-driven decisions about your thumbnail design.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Compare Performance</h3>
                  <p className="text-sm text-gray-500">See which thumbnail gets more clicks</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Optimize CTR</h3>
                  <p className="text-sm text-gray-500">Increase your click-through rate</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Grow Your Channel</h3>
                  <p className="text-sm text-gray-500">Get more views and subscribers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">How to A/B Test</h2>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">1</span>
                <div className="ml-4">
                  <h3 className="font-medium">Create Two Versions</h3>
                  <p className="text-sm text-gray-500">Design two different thumbnails for your video</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">2</span>
                <div className="ml-4">
                  <h3 className="font-medium">Upload Both</h3>
                  <p className="text-sm text-gray-500">Upload both versions to our tester</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">3</span>
                <div className="ml-4">
                  <h3 className="font-medium">Analyze Results</h3>
                  <p className="text-sm text-gray-500">Compare performance metrics and choose the winner</p>
                </div>
              </li>
            </ol>
          </div>
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
            onClick={() => document.getElementById('ab-upload-input')?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              Upload your thumbnails for A/B testing
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Upload two different versions to compare
            </p>
            <span className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Select Files
            </span>
            <input
              id="ab-upload-input"
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
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
              <p className="text-sm text-yellow-700">
                Upload two thumbnail versions to start A/B testing and see which one performs better.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}