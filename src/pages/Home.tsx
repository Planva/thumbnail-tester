import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../store';

export function Home() {
  const { addThumbnail } = useStore();
  const navigate = useNavigate();
  const [dragActive, setDragActive] = React.useState(false);

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
    // Navigate to testing page after upload
    navigate('/thumbnail-tester-online-free');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleTrySample = () => {
    // Create a sample thumbnail for demonstration
    fetch('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1280&q=80')
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'sample-thumbnail.jpg', { type: 'image/jpeg' });
        addThumbnail(file);
        navigate('/thumbnail-tester-online-free');
      });
  };

  return (
    <>
      <Helmet>
        <title>YouTube Thumbnail Tester - Free Online Tool for Testing Thumbnails</title>
        <meta name="description" content="Test and optimize your YouTube thumbnails with our free online tool. Preview in different layouts, A/B test designs, and get AI-powered insights to improve click-through rates." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">
            YouTube Thumbnail Tester - Free Online Tool for Testing Thumbnails
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Test and optimize your YouTube thumbnails with our free online tool. Preview in different layouts, A/B test designs, and get AI-powered insights to improve click-through rates.
          </p>
          
          {/* Upload Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              } cursor-pointer`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('home-upload-input')?.click()}
            >
              {/* Upload Icon */}
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <ImageIcon className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">
                Click below or drag & drop thumbnails to start
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload
                </span>
                <input
                  id="home-upload-input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                />
                
               
              </div>
              
              <p className="mt-4 text-sm text-gray-500">
                PNG, JPG or GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Free Thumbnail Preview</h2>
            <p className="text-gray-600 mb-4">
              Preview your thumbnails in different YouTube layouts before publishing
            </p>
            <Link to="/thumbnail-tester-online-free" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Try Free Preview →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">A/B Testing Tool</h2>
            <p className="text-gray-600 mb-4">
              Compare different versions to find the best performing thumbnail
            </p>
            <Link to="/youtube-b/b-test" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Start A/B Testing →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
            <p className="text-gray-600 mb-4">
              Get AI-powered insights to improve your thumbnail performance
            </p>
            <Link to="/thumbnail-tester-ai" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Try AI Analysis →
            </Link>
          </div>
        </div>

        <section className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Why Use Our Tool?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Real-Time Preview</h3>
              <p className="text-gray-600">
                See how your thumbnails look across different YouTube layouts instantly
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Free Online Tool</h3>
              <p className="text-gray-600">
                No download required, start testing your thumbnails right away
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">How to Use</h2>
          <div className="prose max-w-none">
            <ol className="space-y-4">
              <li>Upload your thumbnail(s)</li>
              <li>Preview in different layouts</li>
              <li>Compare performance metrics</li>
              <li>Choose the best version</li>
            </ol>
          </div>
        </section>
      </div>
    </>
  );
}