import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Brain, Eye, Layout, Zap, AlertCircle, BarChart3 } from 'lucide-react';
import { useStore } from '../store';
import { analyzeImage } from '../utils/imageAnalysis';
import { calculateThumbnailScore } from '../utils/scoringAlgorithm';
import { ThumbnailScoreCard } from '../components/ThumbnailScoreCard';
import type { ImageAnalysis, ThumbnailScore } from '../utils/imageAnalysis';

export function AITesterPage() {
  const { addThumbnail } = useStore();
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysis | null>(null);
  const [thumbnailScore, setThumbnailScore] = useState<ThumbnailScore | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const newThumbnail = {
        id: Math.random().toString(36).substring(7),
        file: files[0],
        preview: URL.createObjectURL(files[0]),
        title: '',
      };
      setThumbnails([newThumbnail]);
      analyzeUploadedImage(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const analyzeUploadedImage = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setThumbnailScore(null);

    try {
      console.log('Starting comprehensive analysis for:', file.name);
      
      // 进行完整的图像分析
      const analysis = await analyzeImage(file, true, true);
      console.log('Analysis completed:', analysis);
      
      setAnalysisResult(analysis);
      
      // 计算评分
      const score = calculateThumbnailScore(analysis);
      console.log('Score calculated:', score);
      
      setThumbnailScore(score);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Analysis failed, please try again or try another image');
    } finally {
      setIsAnalyzing(false);
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
            Upload your thumbnail to get AI-powered deep analysis. Our algorithm analyzes visual quality, text effectiveness, 
            person presence and other key elements, providing detailed optimization recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">AI Analysis Features</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Comprehensive Scoring System</h3>
                  <p className="text-sm text-gray-500">
                    Four-dimensional scoring: Visual quality, text effectiveness, person presence, engagement prediction
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Brain className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Smart Analysis</h3>
                  <p className="text-sm text-gray-500">
                    Analyzes brightness, contrast, colors, text readability, person coverage and other key metrics
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Eye className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Optimization Recommendations</h3>
                  <p className="text-sm text-gray-500">
                    Provides specific improvement suggestions and priority ranking based on analysis results
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Layout className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">CTR Prediction</h3>
                  <p className="text-sm text-gray-500">
                    Predicts thumbnail click-through rate performance based on analysis results
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Upload Canvas */}
            {thumbnails.length === 0 ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center min-h-[400px] flex flex-col justify-center ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-red-300 border-2'
                } cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('ai-upload-input')?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-lg font-medium text-gray-700">
                  Upload thumbnail for AI analysis
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  or
                </p>
                <span className="mt-4 inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 min-w-[120px]">
                  Select File
                </span>
                <input
                  id="ai-upload-input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
                <p className="mt-2 text-xs text-gray-500">
                  PNG, JPG or GIF up to 5MB
                </p>
              </div>
            ) : (
              <div className="border-2 border-red-300 rounded-lg p-4 min-h-[400px]">
                <div className="relative w-full h-full">
                  <img
                    src={thumbnails[0].preview}
                    alt="Uploaded thumbnail"
                    className="w-full h-auto max-h-[350px] object-contain rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setThumbnails([]);
                      setAnalysisResult(null);
                      setThumbnailScore(null);
                      setError(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Status */}
            {isAnalyzing && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Analyzing...</h3>
                  <p className="text-gray-600">
                    Performing visual analysis, text recognition, person detection and multi-dimensional analysis
                  </p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {thumbnailScore && !isAnalyzing && (
              <ThumbnailScoreCard 
                score={thumbnailScore}
                thumbnailIndex={0}
                isDarkMode={false}
              />
            )}

            {/* Detailed Analysis Data */}
            {analysisResult && !isAnalyzing && (
              <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                <h3 className="text-xl font-semibold mb-4">📊 Detailed Analysis Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Visual Analysis */}
                  <div>
                    <h4 className="font-medium mb-3 text-purple-600">🎨 Visual Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Brightness:</span>
                        <span>{Math.round(analysisResult.brightness)}/255</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contrast:</span>
                        <span>{Math.round(analysisResult.contrast)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Colorfulness:</span>
                        <span>{Math.round(analysisResult.colorfulness)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visual Impact:</span>
                        <span>{Math.round(analysisResult.visualImpact)}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Text Analysis */}
                  {analysisResult.textAnalysis && (
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">📝 Text Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Text Regions:</span>
                          <span>{analysisResult.textAnalysis.textCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Font Size:</span>
                          <span>{analysisResult.textAnalysis.averageFontSize.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Readability Score:</span>
                          <span>{analysisResult.textAnalysis.readabilityScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Has Title:</span>
                          <span>{analysisResult.textAnalysis.hasTitle ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Title Quality:</span>
                          <span>{analysisResult.textAnalysis.titleQuality}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Text Coverage:</span>
                          <span>{analysisResult.textAnalysis.textCoverage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Person Analysis */}
                  {analysisResult.faceAnalysis && (
                    <div>
                      <h4 className="font-medium mb-3 text-orange-600">👤 Person Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Person Coverage:</span>
                          <span>{analysisResult.faceAnalysis.personCoverage.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Person Size:</span>
                          <span>{analysisResult.faceAnalysis.averageFaceSize.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dominant Expression:</span>
                          <span>{analysisResult.faceAnalysis.dominantExpression}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Has Close-up:</span>
                          <span>{analysisResult.faceAnalysis.hasCloseUpFace ? 'Yes' : 'No'}</span>
                        </div>
                        {analysisResult.faceAnalysis.averageAge && (
                          <div className="flex justify-between">
                            <span>Avg Age:</span>
                            <span>{analysisResult.faceAnalysis.averageAge.toFixed(0)} years</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dominant Colors */}
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">🎨 Dominant Colors</h4>
                    <div className="flex space-x-2">
                      {analysisResult.dominantColors.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Default Hint */}
            {!thumbnails.length && !isAnalyzing && !error && !thumbnailScore && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                <p className="text-sm text-yellow-700">
                  Upload a thumbnail to get AI-powered deep analysis and optimization recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}