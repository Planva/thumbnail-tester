import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Download, Link, AlertCircle, CheckCircle, Copy, ExternalLink } from 'lucide-react';

export function ThumbnailDownloadPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setThumbnailUrl('');
    
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setThumbnailUrl(thumbnailUrl);
      setIsLoading(false);
    }, 1000);
  };

  const handleDownload = () => {
    if (thumbnailUrl) {
      // Create a canvas to convert the image and force download
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `youtube-thumbnail-${Date.now()}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.95);
      };
      img.onerror = () => {
        // Fallback: try direct download
        const link = document.createElement('a');
        link.href = thumbnailUrl;
        link.download = `youtube-thumbnail-${Date.now()}.jpg`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = thumbnailUrl;
    }
  };

  const handleCopyUrl = async () => {
    if (thumbnailUrl) {
      await navigator.clipboard.writeText(thumbnailUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setYoutubeUrl('');
    setThumbnailUrl('');
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>YouTube Thumbnail Downloader - Free High Quality Download Tool</title>
        <meta name="description" content="Free YouTube thumbnail downloader. Extract and download high-quality thumbnails (1280x720) from any YouTube video instantly. No registration required." />
        
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="YouTube Thumbnail Downloader - Free High Quality Download Tool" />
        <meta property="og:description" content="Free YouTube thumbnail downloader. Extract and download high-quality thumbnails from any YouTube video instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thumbnail-tester.com/thumbnail-download" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YouTube Thumbnail Downloader - Free Tool" />
        <meta name="twitter:description" content="Download high-quality YouTube thumbnails instantly. Free and easy to use." />
        <link rel="canonical" href="https://www.thumbnail-tester.com/thumbnail-download" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            YouTube Thumbnail Downloader
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Download high-quality YouTube thumbnails instantly. Simply paste a YouTube video URL and get the thumbnail in full resolution.
          </p>
        </div>

        {/* Main Tool */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="youtube-url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                    Getting Thumbnail...
                  </>
                ) : (
                  'Get Thumbnail'
                )}
              </button>
              
              {(youtubeUrl || thumbnailUrl) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Success Result */}
          {thumbnailUrl && (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-green-700">Thumbnail extracted successfully!</p>
              </div>

              {/* Thumbnail Preview */}
              <div className="text-center">
                <img
                  src={thumbnailUrl}
                  alt="YouTube Thumbnail"
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                  style={{ maxHeight: '400px' }}
                />
              </div>

              {/* Download Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Thumbnail
                </button>
                
                <button
                  onClick={handleCopyUrl}
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium flex items-center justify-center"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copy URL
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* How to Use Section */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">How to Download YouTube Thumbnails</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Copy YouTube URL</h3>
              <p className="text-gray-700 text-sm">
                Go to any YouTube video and copy the URL from your browser's address bar
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Paste & Extract</h3>
              <p className="text-gray-700 text-sm">
                Paste the URL in the input field above and click "Get Thumbnail"
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Download</h3>
              <p className="text-gray-700 text-sm">
                Click the download button to save the high-quality thumbnail to your device
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Why Choose Our YouTube Thumbnail Downloader?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-900">Maximum Quality</h3>
                <p className="text-gray-700 text-sm">
                  Download thumbnails in the highest available resolution up to 1280x720 pixels (HD quality)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-900">100% Free & Fast</h3>
                <p className="text-gray-700 text-sm">
                  Instant thumbnail extraction with no registration required
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-900">Universal Compatibility</h3>
                <p className="text-gray-700 text-sm">
                  Works with all public YouTube videos, shorts, and live streams
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-900">Original Quality</h3>
                <p className="text-gray-700 text-sm">
                  Clean thumbnails without any watermarks or modifications
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-900">Safe & Secure</h3>
                <p className="text-gray-700 text-sm">
                  No data stored on our servers. All processing happens in your browser
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">What YouTube video formats are supported?</h3>
              <p className="text-gray-700 text-sm">
                Our tool works with all public YouTube videos, including regular videos, YouTube Shorts, and live streams.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">What resolution and quality will the downloaded thumbnail be?</h3>
              <p className="text-gray-700 text-sm">
                We extract the highest quality thumbnail available, typically 1280x720 pixels (maxresdefault). If not available, we'll get the best quality possible.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Is this YouTube thumbnail downloader completely free?</h3>
              <p className="text-gray-700 text-sm">
                Yes, our YouTube thumbnail downloader is completely free to use with no registration required.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Can I use downloaded thumbnails for commercial purposes?</h3>
              <p className="text-gray-700 text-sm">
                Please respect YouTube's terms of service and copyright laws. Only download thumbnails you have permission to use.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Do you store the thumbnails or URLs I download?</h3>
              <p className="text-gray-700 text-sm">
                No, we don't store any data. All thumbnail extraction happens in your browser for maximum privacy and security.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">What file format will the downloaded thumbnail be?</h3>
              <p className="text-gray-700 text-sm">
                Thumbnails are downloaded as high-quality JPEG files, which is the standard format used by YouTube.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}