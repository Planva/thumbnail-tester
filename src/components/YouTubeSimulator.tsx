import React, { useState, useCallback } from 'react';
import { Menu, Search, Mic, Cast, Bell, User, Video, Grid, List, Smartphone, Monitor, Maximize2, Minimize2, LayoutGrid, Columns, SplitSquareHorizontal } from 'lucide-react';
import { Thumbnail } from '../types';
import { useStore } from '../store';
import { useFullscreen, useToggle } from 'react-use';
import { analyzeImage, generateSmartSuggestions, predictCTR, ImageAnalysis, ComparisonSuggestion } from '../utils/imageAnalysis';
import { cleanupOCR } from '../utils/textAnalysis';
import { cleanupFaceDetection } from '../utils/faceDetection';
import { calculateThumbnailScore, ThumbnailScore } from '../utils/scoringAlgorithm';
import { ThumbnailScoreCard } from './ThumbnailScoreCard';

interface YouTubeSimulatorProps {
  thumbnails: Thumbnail[];
  isDarkMode?: boolean;
  view?: ViewMode;
  device?: DeviceMode;
  isFullscreen?: boolean;
  onViewChange?: (view: ViewMode) => void;
  onDeviceChange?: (device: DeviceMode) => void;
  onToggleFullscreen?: () => void;
}

type ViewMode = 'grid' | 'list' | 'double' | 'search' | 'ab';
type DeviceMode = 'desktop' | 'mobile';

export function YouTubeSimulator({ 
  thumbnails, 
  isDarkMode = true,
  view = 'grid',
  device = 'desktop',
  isFullscreen = false,
  onViewChange,
  onDeviceChange,
  onToggleFullscreen
}: YouTubeSimulatorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const ref = React.useRef(null);
  const [analysisResults, setAnalysisResults] = React.useState<ImageAnalysis[]>([]);
  const [suggestions, setSuggestions] = React.useState<ComparisonSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [thumbnailScores, setThumbnailScores] = React.useState<ThumbnailScore[]>([]);
  useFullscreen(ref, isFullscreen, {onClose: () => onToggleFullscreen?.()});

  // 分析缩略图
  React.useEffect(() => {
    if (thumbnails.length >= 2 && view === 'ab') {
      console.log('Starting A/B analysis for thumbnails...');
      setIsAnalyzing(true);
      setAnalysisResults([]);
      setSuggestions([]);
      setThumbnailScores([]);
      
      // Analyze images with error handling to prevent page redirect
      Promise.all(
        thumbnails.slice(0, 2).map(thumb => 
          analyzeImage(thumb.file, true, true)
            .catch(error => {
              console.error('Individual image analysis failed:', error);
              // Return a basic analysis instead of failing
              return {
                brightness: 128,
                contrast: 50,
                colorfulness: 30,
                dominantColors: ['rgb(128, 128, 128)'],
                textReadability: 50,
                visualImpact: 50
              };
            })
        )
      )
        .then(results => {
          console.log('Analysis results:', results);
          setAnalysisResults(results);
          
          // 计算评分
          const scores = results.map(result => calculateThumbnailScore(result));
          setThumbnailScores(scores);
          
          if (results.length === 2) {
            const smartSuggestions = generateSmartSuggestions(results[0], results[1]);
            console.log('Generated suggestions:', smartSuggestions);
            setSuggestions(smartSuggestions);
          }
          setIsAnalyzing(false);
        })
        .catch(error => {
          console.error('Analysis failed:', error);
          // Even if analysis fails completely, don't redirect - show error message
          setIsAnalyzing(false);
          setAnalysisResults([]);
          setSuggestions([{
            type: 'impact',
            message: 'Technical analysis unavailable, but you can still compare thumbnails visually',
            winner: 'A',
            improvement: 'Visual comparison is still effective for thumbnail optimization',
            score: 0,
            details: 'Basic visual comparison available'
          }]);
        });
    }
  }, [thumbnails, view]);

  // 清理OCR资源
  React.useEffect(() => {
    return () => {
      cleanupOCR();
      cleanupFaceDetection();
    };
  }, []);

  // When switching to mobile, force list view
  React.useEffect(() => {
    if (device === 'mobile') {
      // Keep current view for mobile, don't force list view
    }
  }, [device, onViewChange]);

  const formatViews = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const randomViews = Math.floor(Math.random() * 1000000);
  const randomDuration = "14:57";

  const sampleThumbnails = [
    {
      title: "20 WOMEN VS 1 SIDEMEN: SPEED EDITION",
      channel: "Sidemen",
      views: "73M",
      time: "1 year ago",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=480&q=80"
    },
    {
      title: "I Tried Butler Academy",
      channel: "Michelle Khare",
      views: "9M",
      time: "1 year ago",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=480&q=80"
    },
    {
      title: "SIDEMEN HIDE AND SEEK IN BETA SQUAD HOUSE",
      channel: "Sidemen",
      views: "20M",
      time: "4 years ago",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=80"
    },
    {
      title: "20 WOMEN VS 1 SIDEMEN: JIDION EDITION",
      channel: "Sidemen",
      views: "19M",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=480&q=80"
    },
    {
      title: "20 WOMEN VS 1 SIDEMEN: LOGAN PAUL EDITION",
      channel: "Sidemen",
      views: "24M",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=480&q=80"
    },
    {
      title: "SIDEMEN $100,000 HOLIDAY MUKBANG",
      channel: "Sidemen",
      views: "15M",
      time: "3 months ago",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=480&q=80"
    },
    {
      title: "How to Make a Digital Planner",
      channel: "Tech Tips",
      views: "123K",
      time: "1 hour ago",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=480&q=80"
    },
    {
      title: "SIDEMEN LOCKDOWN SHOWDOWN",
      channel: "Sidemen",
      views: "12M",
      time: "5 years ago",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=480&q=80"
    },
    {
      title: "SIDEMEN BLIND DATING 4",
      channel: "Sidemen",
      views: "31M",
      time: "1 year ago",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=480&q=80"
    },
    {
      title: "SIDEMEN TINDER IN REAL LIFE 4",
      channel: "Sidemen",
      views: "64M",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=80"
    },
    {
      title: "SIDEMEN AMONG US IN REAL LIFE 2",
      channel: "Sidemen",
      views: "22M",
      time: "1 year ago",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=480&q=80"
    },
    {
      title: "Learn King's Gambit with Hikaru!",
      channel: "GMHikaru",
      views: "210K",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=480&q=80"
    },
    {
      title: "Hikaru Nakamura Teaches Chess Tactics",
      channel: "GMHikaru",
      views: "121K",
      time: "3 years ago",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&q=80"
    },
    {
      title: "Dear YouTube, King's Gambit vs Magnus!!",
      channel: "GMHikaru",
      views: "213K",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?w=480&q=80"
    },
    {
      title: "Is This Proof That Hans Niemann Cheated?",
      channel: "GMHikaru",
      views: "1M",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=480&q=80"
    },
    {
      title: "SIDEMEN REACT TO KSI VS LOGAN PAUL",
      channel: "Sidemen",
      views: "45M",
      time: "3 years ago",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=480&q=80"
    },
    {
      title: "SIDEMEN EXTREME COOKING",
      channel: "Sidemen",
      views: "28M",
      time: "6 months ago",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&q=80"
    },
    {
      title: "Building the Ultimate Gaming Setup",
      channel: "Tech Tips",
      views: "2.1M",
      time: "1 week ago",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=480&q=80"
    },
    {
      title: "React vs Vue: Which is Better?",
      channel: "Code Academy",
      views: "890K",
      time: "2 weeks ago",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=480&q=80"
    },
    {
      title: "10 Minute Morning Workout",
      channel: "Fitness Pro",
      views: "3.2M",
      time: "1 month ago",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&q=80"
    },
    {
      title: "Cooking the Perfect Pasta",
      channel: "Chef's Kitchen",
      views: "1.5M",
      time: "3 days ago",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=480&q=80"
    }
  ];

  const renderVideoCard = useCallback((video: typeof sampleThumbnails[0] | Thumbnail, isUserVideo = false, size: 'normal' | 'small' = 'normal') => {
    const imageUrl = 'preview' in video ? video.preview : video.image;
    const title = video.title;
    const channelName = isUserVideo ? 'Your Channel' : ('channel' in video ? video.channel : '');
    const views = isUserVideo ? formatViews(randomViews) : ('views' in video ? video.views : '');
    const time = isUserVideo ? '2 hours ago' : ('time' in video ? video.time : '');

    if (device === 'mobile') {
      return (
        <div className="group cursor-pointer p-2">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 px-1 rounded text-xs text-white">
              {randomDuration}
            </div>
          </div>
          <div className="px-1">
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-400 mb-1">
              {title || 'Enter video title...'}
            </h3>
            <p className="text-xs text-gray-400">{channelName}</p>
            <p className="text-xs text-gray-400">
              {views} views • {time}
            </p>
          </div>
        </div>
      );
    }

    const containerClass = size === 'small' ? 'w-[240px]' : '';
    const imageClass = size === 'small' ? 'w-[240px] h-[135px]' : 'aspect-video';

    return (
      <div className={`group cursor-pointer ${containerClass}`}>
        <div className={`relative ${imageClass} rounded-xl overflow-hidden`}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black px-1 rounded text-xs">
            {randomDuration}
          </div>
        </div>
        <div className="mt-2 flex">
          <div className="flex-1">
            <h3 className={`font-medium line-clamp-2 group-hover:text-blue-400 ${size === 'small' ? 'text-sm' : ''}`}>
              {title || 'Enter video title...'}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{channelName}</p>
            <p className="text-sm text-gray-400">
              {views} views • {time}
            </p>
          </div>
        </div>
      </div>
    );
  }, [device]);

  const containerClasses = `
    ${isFullscreen ? 'fixed inset-0 z-50' : 'relative'}
    ${isDarkMode ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'} rounded-xl shadow-lg w-full
  `;

  const mobileContainerStyle = device === 'mobile' ? {
    maxWidth: '400px',
    margin: '0 auto',
    height: '600px',
    overflowY: 'auto'
  } : {};

  const renderContent = () => {
    const mainThumbnail = thumbnails[0];
    const secondThumbnail = thumbnails[1];

    switch (view) {
      case 'search':
        return (
          <div className="space-y-4">
            <div className={`space-y-4 pb-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>About 1,000,000 results</span>
              <button className={`px-3 py-1 text-sm rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Filter
              </button>
            </div>
            <div className="space-y-6">
              {[mainThumbnail, ...sampleThumbnails.map(v => ({preview: v.image, title: v.title}))].map((video, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="w-64 aspect-video rounded-xl overflow-hidden">
                    <img
                      src={'preview' in video ? video.preview : video.image}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg hover:text-blue-400">
                      {video.title}
                    </h3>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatViews(Math.random() * 1000000)} views • {Math.floor(Math.random() * 12)} months ago
                    </p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Channel Name</p>
                    <p className={`text-sm mt-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Video description would appear here with more details about the content...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'double':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                {renderVideoCard(mainThumbnail, true)}
                {sampleThumbnails.slice(0, Math.ceil(sampleThumbnails.length / 2)).map((video, i) => (
                  <div key={i}>{renderVideoCard(video)}</div>
                ))}
              </div>
              <div className="space-y-4">
                {secondThumbnail && renderVideoCard(secondThumbnail, true)}
                {sampleThumbnails.slice(Math.ceil(sampleThumbnails.length / 2)).map((video, i) => (
                  <div key={i}>{renderVideoCard(video)}</div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'ab':
        if (!secondThumbnail) {
          return (
            <div className="text-center py-8">
              <p className="text-lg text-gray-400">Please upload a second thumbnail for A/B testing</p>
            </div>
          );
        }

        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Version A</h3>
                {renderVideoCard(mainThumbnail, true)}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Version B</h3>
                {renderVideoCard(secondThumbnail, true)}
              </div>
            </div>
            
            {/* 智能分析建议 */}
            {thumbnailScores.length > 0 && !isAnalyzing && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {thumbnailScores.map((score, index) => (
                  <ThumbnailScoreCard 
                    key={index}
                    score={score}
                    thumbnailIndex={index}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            )}
            
            {isAnalyzing && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p>Analyzing thumbnails...</p>
              </div>
            )}
            
            {suggestions.length > 0 && !isAnalyzing && (
              <div className={`rounded-lg p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <h3 className="text-xl font-semibold mb-4">🤖 AI Analysis & Suggestions</h3>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      suggestion.winner === 'A' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">
                            🏆 Version {suggestion.winner} Wins - {suggestion.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {suggestion.message}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            💡 {suggestion.improvement}
                          </p>
                          {suggestion.details && (
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              📋 {suggestion.details}
                            </p>
                          )}
                        </div>
                        <div className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
                          suggestion.score > 70 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : suggestion.score > 40
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {Math.round(suggestion.score)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {analysisResults.length === 2 && (
                  <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <h4 className="font-medium mb-3">📊 Detailed Analysis Data</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Version A</h5>
                        <div className="space-y-1">
                          <p>Brightness: {Math.round(analysisResults[0].brightness)}/255</p>
                          <p>Contrast: {Math.round(analysisResults[0].contrast)}</p>
                          <p>Colorfulness: {Math.round(analysisResults[0].colorfulness)}%</p>
                          <p>Visual Impact: {Math.round(analysisResults[0].visualImpact)}/100</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Version B</h5>
                        <div className="space-y-1">
                          <p>Brightness: {Math.round(analysisResults[1].brightness)}/255</p>
                          <p>Contrast: {Math.round(analysisResults[1].contrast)}</p>
                          <p>Colorfulness: {Math.round(analysisResults[1].colorfulness)}%</p>
                          <p>Visual Impact: {Math.round(analysisResults[1].visualImpact)}/100</p>
                        </div>
                      </div>
                      
                      {/* 文字分析数据 */}
                      {analysisResults[0].textAnalysis && analysisResults[1].textAnalysis && (
                        <>
                          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <h5 className="font-medium mb-3">📝 Text Analysis Data</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>Text Count: {analysisResults[0].textAnalysis.textCount}</p>
                              <p>Avg Font Size: {analysisResults[0].textAnalysis.averageFontSize}%</p>
                              <p>Readability: {analysisResults[0].textAnalysis.readabilityScore}/100</p>
                              <p>Has Title: {analysisResults[0].textAnalysis.hasTitle ? 'Yes' : 'No'}</p>
                              <p>Title Quality: {analysisResults[0].textAnalysis.titleQuality}/100</p>
                              <p>Text Coverage: {analysisResults[0].textAnalysis.textCoverage}%</p>
                              <p>OCR Confidence: {analysisResults[0].textAnalysis.averageConfidence}%</p>
                            </div>
                            <div>
                              <p>Text Count: {analysisResults[1].textAnalysis.textCount}</p>
                              <p>Avg Font Size: {analysisResults[1].textAnalysis.averageFontSize}%</p>
                              <p>Readability: {analysisResults[1].textAnalysis.readabilityScore}/100</p>
                              <p>Has Title: {analysisResults[1].textAnalysis.hasTitle ? 'Yes' : 'No'}</p>
                              <p>Title Quality: {analysisResults[1].textAnalysis.titleQuality}/100</p>
                              <p>Text Coverage: {analysisResults[1].textAnalysis.textCoverage}%</p>
                              <p>OCR Confidence: {analysisResults[1].textAnalysis.averageConfidence}%</p>
                            </div>
                          </div>
                        </div>
                        </>
                      )}
                      
                      {/* 人脸分析数据 */}
                      {analysisResults[0].faceAnalysis && analysisResults[1].faceAnalysis && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <h5 className="font-medium mb-3">👤 Person Analysis Data</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>Person Coverage: {analysisResults[0].faceAnalysis.personCoverage.toFixed(1)}%</p>
                              <p>Avg Person Size: {analysisResults[0].faceAnalysis.averageFaceSize.toFixed(1)}%</p>
                              <p>Dominant Expression: {analysisResults[0].faceAnalysis.dominantExpression}</p>
                              <p>Has Close-up: {analysisResults[0].faceAnalysis.hasCloseUpFace ? 'Yes' : 'No'}</p>
                              {analysisResults[0].faceAnalysis.averageAge && (
                                <p>Avg Age: {analysisResults[0].faceAnalysis.averageAge.toFixed(0)} years</p>
                              )}
                            </div>
                            <div>
                              <p>Person Coverage: {analysisResults[1].faceAnalysis.personCoverage.toFixed(1)}%</p>
                              <p>Avg Person Size: {analysisResults[1].faceAnalysis.averageFaceSize.toFixed(1)}%</p>
                              <p>Dominant Expression: {analysisResults[1].faceAnalysis.dominantExpression}</p>
                              <p>Has Close-up: {analysisResults[1].faceAnalysis.hasCloseUpFace ? 'Yes' : 'No'}</p>
                              {analysisResults[1].faceAnalysis.averageAge && (
                                <p>Avg Age: {analysisResults[1].faceAnalysis.averageAge.toFixed(0)} years</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Debug info - show when no suggestions but analysis is complete */}
            {!isAnalyzing && suggestions.length === 0 && analysisResults.length === 2 && (
              <div className={`rounded-lg p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <h3 className="text-lg font-semibold mb-2">🔍 Analysis Complete</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Both thumbnails have been analyzed with visual and text recognition. The differences are minimal, so no specific suggestions are generated.
                </p>
              </div>
            )}
          </div>
        );

      case 'list':
        return (
          <div className={`space-y-4 ${device === 'mobile' ? 'max-w-md mx-auto' : ''}`}>
            {thumbnails.map((thumb, i) => (
              <div key={i}>{renderVideoCard(thumb, true)}</div>
            ))}
            {sampleThumbnails.map((video, i) => (
              <div key={i}>{renderVideoCard(video)}</div>
            ))}
          </div>
        );

      case 'grid':
        return (
          <div className={`${device === 'mobile' ? 'space-y-4 px-2' : 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {thumbnails.map((thumb, i) => (
              <div key={i}>{renderVideoCard(thumb, true)}</div>
            ))}
            {sampleThumbnails.map((video, i) => (
              <div key={i}>{renderVideoCard(video)}</div>
            ))}
          </div>
        );

      default: // list view
        return (
          <div className={`space-y-4 ${device === 'mobile' ? 'max-w-md mx-auto' : ''}`}>
            {thumbnails.map((thumb, i) => (
              <div key={i} className={`group cursor-pointer ${device === 'mobile' ? 'space-y-3' : 'flex space-x-4'}`}>
                <div className={`relative rounded-xl overflow-hidden ${device === 'mobile' ? 'w-full aspect-video' : 'w-60 aspect-video'}`}>
                  <img
                    src={thumb.preview}
                    alt={thumb.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-1.5 py-0.5 rounded text-xs text-white font-medium">
                    {randomDuration}
                  </div>
                </div>
                <div className={`${device === 'mobile' ? 'px-2' : 'flex-1'}`}>
                  <h3 className={`font-medium group-hover:text-blue-400 ${device === 'mobile' ? 'text-base line-clamp-2 mb-2' : 'text-lg'}`}>
                    {thumb.title || 'Enter video title...'}
                  </h3>
                  {device === 'mobile' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-xs text-white font-semibold">
                        Y
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Channel</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatViews(randomViews)} views • 2 hours ago
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatViews(randomViews)} views • 2 hours ago
                      </p>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Channel</p>
                      <p className={`text-sm mt-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Video description would appear here...
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}

            {sampleThumbnails.map((video, i) => (
              <div key={i} className={`group cursor-pointer ${device === 'mobile' ? 'space-y-3' : 'flex space-x-4'}`}>
                <div className={`relative rounded-xl overflow-hidden ${device === 'mobile' ? 'w-full aspect-video' : 'w-60 aspect-video'}`}>
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-1.5 py-0.5 rounded text-xs text-white font-medium">
                    {randomDuration}
                  </div>
                </div>
                <div className={`${device === 'mobile' ? 'px-2' : 'flex-1'}`}>
                  <h3 className={`font-medium group-hover:text-blue-400 ${device === 'mobile' ? 'text-base line-clamp-2 mb-2' : 'text-lg'}`}>
                    {video.title}
                  </h3>
                  {device === 'mobile' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-xs text-white font-semibold">
                        {video.channel.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{video.channel}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {video.views} views • {video.time}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {video.views} views • {video.time}
                      </p>
                      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{video.channel}</p>
                      <p className={`text-sm mt-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Video description would appear here...
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div ref={ref} className={containerClasses} style={mobileContainerStyle}>
      {/* YouTube Header */}
      <div className={`border-b ${isDarkMode ? 'border-gray-800 bg-[#0f0f0f]' : 'border-gray-200 bg-white'} sticky top-0 z-10`}>
        <div className={`flex items-center justify-between p-2 ${device === 'mobile' ? 'text-sm' : ''}`}>
          <div className="flex items-center space-x-4">
            <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <Menu className={`${device === 'mobile' ? 'h-5 w-5' : 'h-6 w-6'}`} />
            </button>
            <span className={`${device === 'mobile' ? 'text-lg' : 'text-xl'} font-semibold`}>YouTube</span>
          </div>
          
          {device === 'desktop' && (
            <div className="flex-1 max-w-2xl mx-4">
              <div className="flex">
                <div className={`flex-1 flex items-center rounded-l-full border ${isDarkMode ? 'bg-[#121212] border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className={`w-full px-4 py-2 bg-transparent focus:outline-none ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}`}
                  />
                </div>
                <button className={`px-6 border border-l-0 rounded-r-full ${isDarkMode ? 'bg-[#222222] border-gray-700 hover:bg-[#313131]' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
                  <Search className="h-5 w-5" />
                </button>
                <button className={`ml-2 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {device === 'mobile' ? (
              <>
                <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <Search className="h-5 w-5" />
                </button>
                <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <User className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <Video className="h-6 w-6" />
                </button>
                <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <Bell className="h-6 w-6" />
                </button>
                <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <User className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Left Sidebar - only show on desktop */}
        {device === 'desktop' && (
          <div className={`w-60 ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex-shrink-0`}>
            <div className="p-3 space-y-1">
              {/* Home Section */}
              <div className={`flex items-center space-x-6 px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span className="text-sm font-medium">Home</span>
              </div>
              
              <div className={`flex items-center space-x-6 px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.97 16.95L10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0-2c6.08 0 11 4.92 11 11s-4.92 11-11 11S1 18.08 1 12 5.92 1 12 1z"/>
                </svg>
                <span className="text-sm font-medium">Shorts</span>
              </div>
              
              <div className={`flex items-center space-x-6 px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 8v8l6-4-6-4zm8-5H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
                </svg>
                <span className="text-sm font-medium">Subscriptions</span>
              </div>
              
              {/* Divider */}
              <div className={`border-t my-3 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}></div>
              
              {/* You Section */}
              <div className={`flex items-center space-x-6 px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="text-sm font-medium">Your channel</span>
              </div>
              
              <div className={`flex items-center space-x-6 px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm font-medium">History</span>
              </div>
              
              <div className={`flex items-center space-x-6 px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 16v-11.5c0-.83-.67-1.5-1.5-1.5h-13c-.83 0-1.5.67-1.5 1.5v11.5c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5zm-10-7.5v7l5.5-3.5-5.5-3.5z"/>
                </svg>
                <span className="text-sm font-medium">Your videos</span>
              </div>
              
              <div className={`flex items-center space-x-6 px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.97 16.95L10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0-2c6.08 0 11 4.92 11 11s-4.92 11-11 11S1 18.08 1 12 5.92 1 12 1z"/>
                </svg>
                <span className="text-sm font-medium">Watch later</span>
              </div>
              
              <div className={`flex items-center space-x-6 px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer`}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-sm font-medium">Liked videos</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Content */}
          <div className={`p-4 overflow-y-auto ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'max-h-[80vh]'}`}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}