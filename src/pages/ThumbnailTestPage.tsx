import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Grid, List, Columns, Search, SplitSquareHorizontal, Monitor, Smartphone, Maximize2, Minimize2, AlertCircle, Plus, X, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { YouTubeSimulator } from '../components/YouTubeSimulator';
import { useStore } from '../store';

export function ThumbnailTestPage() {
  const { addThumbnail, thumbnails, removeThumbnail, updateTitle, isTestPageDarkMode, toggleTestPageDarkMode } = useStore();
  const [dragActive, setDragActive] = useState(false);
  const [showUpload, setShowUpload] = useState(thumbnails.length === 0);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [view, setView] = useState<'grid' | 'list' | 'double' | 'search' | 'ab'>('grid');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

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
    setShowUpload(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  if (showUpload || thumbnails.length === 0) {
    return (
      <>
        <Helmet>
          <title>Test Your YouTube Thumbnails | Thumbnail Tester</title>
          <meta name="description" content="Test your YouTube thumbnails in a realistic environment. See how they look in different YouTube layouts and get instant feedback." />
        </Helmet>

        <div className={`max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 ${isTestPageDarkMode ? 'bg-[#0f0f0f] text-white' : ''}`}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Test Your YouTube Thumbnails
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${isTestPageDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              See how your thumbnails look in different YouTube environments and get instant feedback on their effectiveness.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : isTestPageDarkMode 
                    ? 'border-gray-600 bg-[#1a1a1a]' 
                    : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className={`mx-auto h-12 w-12 ${isTestPageDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className="mt-4 text-lg font-medium text-gray-700">
                Upload your thumbnails to test
              </p>
              <p className={`mt-2 text-sm ${isTestPageDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
              <p className={`mt-2 text-xs ${isTestPageDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                PNG, JPG or GIF up to 5MB
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Test Your YouTube Thumbnails | Thumbnail Tester</title>
        <meta name="description" content="Test your YouTube thumbnails in a realistic environment. See how they look in different YouTube layouts and get instant feedback." />
      </Helmet>

      <div className={`h-screen flex ${isTestPageDarkMode ? 'bg-[#0f0f0f]' : 'bg-gray-100'}`}>
        {/* Main YouTube Simulator - Full Screen */}
        <div className="flex-1 overflow-y-auto">
          <YouTubeSimulator 
            thumbnails={thumbnails} 
            isDarkMode={isTestPageDarkMode}
            view={view}
            device={device}
            isFullscreen={isFullscreen}
            onViewChange={setView}
            onDeviceChange={setDevice}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>

        {/* Collapsible Toggle Button */}
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          className={`fixed top-1/2 transform -translate-y-1/2 z-50 p-2 rounded-l-lg shadow-lg transition-all ${
            isPanelCollapsed ? 'right-0' : 'right-80'
          } ${isTestPageDarkMode ? 'bg-[#212121] text-white border-l border-gray-600' : 'bg-white text-gray-600 border-l border-gray-200'}`}
        >
          {isPanelCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>

        {/* Right Sidebar - Control Panel */}
        <div className={`w-80 shadow-lg border-l flex flex-col transition-transform duration-300 ${
          isPanelCollapsed ? 'transform translate-x-full' : 'transform translate-x-0'
        } ${isTestPageDarkMode ? 'bg-[#212121] border-gray-600' : 'bg-white border-gray-200'}`}>
          {/* Header */}
          <div className={`p-4 border-b ${isTestPageDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className={`text-lg font-semibold ${isTestPageDarkMode ? 'text-white' : 'text-gray-900'}`}>Thumbnails</h2>
              <button
                onClick={toggleTestPageDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isTestPageDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isTestPageDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isTestPageDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
            <p className={`text-sm ${isTestPageDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your uploaded thumbnails</p>
          </div>

          {/* View Controls */}
          <div className={`p-4 border-b ${isTestPageDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isTestPageDarkMode ? 'text-white' : 'text-gray-900'}`}>View Options</h3>
            <div className="space-y-3">
              {/* A/B Test Button - Always visible */}
              <div>
                <p className={`text-xs mb-2 ${isTestPageDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analysis</p>
                <button
                  onClick={() => setView('ab')}
                  className={`w-full p-2 rounded-lg transition-colors flex items-center justify-center ${
                    view === 'ab' 
                      ? (isTestPageDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600') 
                      : (isTestPageDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                  }`}
                  title="A/B Testing"
                >
                  <SplitSquareHorizontal className="h-4 w-4 mr-2" />
                  <span className="text-xs">A/B Test</span>
                </button>
              </div>
              
              <div>
                <p className={`text-xs mb-2 ${isTestPageDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Layout</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      view === 'grid' 
                        ? (isTestPageDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600') 
                        : (isTestPageDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                    }`}
                    title="Grid View"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('double')}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      view === 'double' 
                        ? (isTestPageDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600') 
                        : (isTestPageDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                    }`}
                    title="Double Column View"
                  >
                    <Columns className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('search')}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      view === 'search' 
                        ? (isTestPageDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600') 
                        : (isTestPageDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                    }`}
                    title="Search Results View"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <p className={`text-xs mb-2 ${isTestPageDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Device</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDevice('desktop')}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      device === 'desktop' 
                        ? (isTestPageDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600') 
                        : (isTestPageDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                    }`}
                    title="Desktop View"
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDevice('mobile')}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      device === 'mobile' 
                        ? (isTestPageDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600') 
                        : (isTestPageDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                    }`}
                    title="Mobile View"
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <p className={`text-xs mb-2 ${isTestPageDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Display</p>
                <button
                  onClick={() => toggleFullscreen()}
                  className={`w-full p-2 rounded-lg transition-colors flex items-center justify-center ${isTestPageDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4 mr-2" />
                      <span className="text-xs">Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4 mr-2" />
                      <span className="text-xs">Fullscreen</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnails List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {thumbnails.map((thumbnail, index) => (
              <div key={thumbnail.id} className={`rounded-lg p-3 border ${isTestPageDarkMode ? 'bg-[#2a2a2a] border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start space-x-3">
                  <img
                    src={thumbnail.preview}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-16 h-10 object-cover rounded border"
                  />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={thumbnail.title}
                      onChange={(e) => updateTitle(thumbnail.id, e.target.value)}
                      placeholder={`Video Title ${index + 1}`}
                      className={`w-full text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0 ${isTestPageDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                    />
                    <p className={`text-xs mt-1 ${isTestPageDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Estimated CTR: {thumbnail.ctr.toFixed(1)}%
                    </p>
                  </div>
                  <button
                    onClick={() => removeThumbnail(thumbnail.id)}
                    className={`transition-colors ${isTestPageDarkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : isTestPageDarkMode 
                    ? 'border-gray-600 hover:border-indigo-400 bg-[#1a1a1a]' 
                    : 'border-gray-300 hover:border-indigo-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('upload-input')?.click()}
            >
              <Plus className={`mx-auto h-6 w-6 mb-2 ${isTestPageDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className={`text-sm mb-2 ${isTestPageDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Add more thumbnails</p>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md ${isTestPageDarkMode ? 'text-indigo-400 bg-indigo-900/30' : 'text-indigo-600 bg-indigo-50'}`}>
                Upload
              </span>
              <input
                id="upload-input"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileInput}
              />
            </div>
          </div>

          {/* Titles Section */}
          <div className={`border-t p-4 ${isTestPageDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 ${isTestPageDarkMode ? 'text-white' : 'text-gray-900'}`}>Titles</h3>
            <div className="space-y-2">
              {thumbnails.map((thumbnail, index) => (
                <input
                  key={thumbnail.id}
                  type="text"
                  value={thumbnail.title}
                  onChange={(e) => updateTitle(thumbnail.id, e.target.value)}
                  placeholder={`Video Title ${index + 1}`}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${isTestPageDarkMode ? 'bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}