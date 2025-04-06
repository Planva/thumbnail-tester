import React, { useState, useCallback } from 'react';
import { Menu, Search, Mic, Cast, Bell, User, Video, Grid, List, Smartphone, Monitor, Maximize2, Minimize2, LayoutGrid, Columns, SplitSquareHorizontal } from 'lucide-react';
import { Thumbnail } from '../types';
import { useStore } from '../store';
import { useFullscreen, useToggle } from 'react-use';

interface YouTubeSimulatorProps {
  thumbnails: Thumbnail[];
}

type ViewMode = 'grid' | 'list' | 'double' | 'search' | 'ab';
type DeviceMode = 'desktop' | 'mobile';

export function YouTubeSimulator({ thumbnails }: YouTubeSimulatorProps) {
  const [isFullscreen, toggleFullscreen] = useToggle(false);
  const [view, setView] = useState<ViewMode>('grid');
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentLanguage } = useStore();
  const ref = React.useRef(null);
  useFullscreen(ref, isFullscreen, {onClose: () => toggleFullscreen(false)});

  // When switching to mobile, force list view
  React.useEffect(() => {
    if (device === 'mobile') {
      setView('list');
    }
  }, [device]);

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
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=480&q=80"
    },
    {
      title: "I Tried Butler Academy",
      channel: "Michelle Khare",
      views: "9M",
      time: "1 year ago",
      image: "https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=480&q=80"
    },
    {
      title: "SIDEMEN HIDE AND SEEK IN BETA SQUAD HOUSE",
      channel: "Sidemen",
      views: "20M",
      time: "4 years ago",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=480&q=80"
    },
    {
      title: "20 WOMEN VS 1 SIDEMEN: JIDION EDITION",
      channel: "Sidemen",
      views: "19M",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=480&q=80"
    },
    {
      title: "20 WOMEN VS 1 SIDEMEN: LOGAN PAUL EDITION",
      channel: "Sidemen",
      views: "24M",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=480&q=80"
    },
    {
      title: "SIDEMEN $100,000 HOLIDAY MUKBANG",
      channel: "Sidemen",
      views: "15M",
      time: "3 months ago",
      image: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=480&q=80"
    },
    {
      title: "How to Make a Digital Planner",
      channel: "Tech Tips",
      views: "123K",
      time: "1 hour ago",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=480&q=80"
    },
    {
      title: "SIDEMEN LOCKDOWN SHOWDOWN",
      channel: "Sidemen",
      views: "12M",
      time: "5 years ago",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=480&q=80"
    },
    {
      title: "SIDEMEN BLIND DATING 4",
      channel: "Sidemen",
      views: "31M",
      time: "1 year ago",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=480&q=80"
    },
    {
      title: "SIDEMEN TINDER IN REAL LIFE 4",
      channel: "Sidemen",
      views: "64M",
      time: "2 years ago",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=480&q=80"
    },
    {
      title: "SIDEMEN AMONG US IN REAL LIFE 2",
      channel: "Sidemen",
      views: "22M",
      time: "1 year ago",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=480&q=80"
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
        <div className="flex space-x-2 group cursor-pointer p-2">
          <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black px-1 rounded text-[10px]">
              {randomDuration}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-400">
              {title || 'Enter video title...'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{channelName}</p>
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
    bg-[#0f0f0f] text-white rounded-xl shadow-lg overflow-hidden w-full
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
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-800">
              <span className="text-sm text-gray-400">About 1,000,000 results</span>
              <button className="px-3 py-1 text-sm bg-gray-800 rounded-full hover:bg-gray-700">
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
                    <p className="text-sm text-gray-400 mt-1">
                      {formatViews(Math.random() * 1000000)} views • {Math.floor(Math.random() * 12)} months ago
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Channel Name</p>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
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
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {renderVideoCard(mainThumbnail, true, 'small')}
                {sampleThumbnails.slice(0, Math.ceil(sampleThumbnails.length / 2)).map((video, i) => (
                  <div key={i}>{renderVideoCard(video, false, 'small')}</div>
                ))}
              </div>
              <div className="space-y-4">
                {secondThumbnail && renderVideoCard(secondThumbnail, true, 'small')}
                {sampleThumbnails.slice(Math.ceil(sampleThumbnails.length / 2)).map((video, i) => (
                  <div key={i}>{renderVideoCard(video, false, 'small')}</div>
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
                <div className="mt-4 bg-gray-800 rounded-lg p-4">
                  <p className="text-2xl font-bold">12.4%</p>
                  <p className="text-sm text-gray-400">Click-through rate</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">Views: {formatViews(randomViews)}</p>
                    <p className="text-sm">Impressions: {formatViews(randomViews * 8)}</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Version B</h3>
                {renderVideoCard(secondThumbnail, true)}
                <div className="mt-4 bg-gray-800 rounded-lg p-4">
                  <p className="text-2xl font-bold">14.8%</p>
                  <p className="text-sm text-gray-400">Click-through rate</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">Views: {formatViews(randomViews * 1.2)}</p>
                    <p className="text-sm">Impressions: {formatViews(randomViews * 8)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="space-y-4">
            {thumbnails.map((thumb, i) => (
              <div key={i} className="flex space-x-4 group cursor-pointer">
                <div className="relative w-60 aspect-video rounded-xl overflow-hidden">
                  <img
                    src={thumb.preview}
                    alt={thumb.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black px-1 rounded text-xs">
                    {randomDuration}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg group-hover:text-blue-400">
                    {thumb.title || 'Enter video title...'}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatViews(randomViews)} views • 2 hours ago
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Your Channel</p>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    Video description would appear here...
                  </p>
                </div>
              </div>
            ))}

            {sampleThumbnails.map((video, i) => (
              <div key={i} className="flex space-x-4 group cursor-pointer">
                <div className="relative w-60 aspect-video rounded-xl overflow-hidden">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black px-1 rounded text-xs">
                    {randomDuration}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg group-hover:text-blue-400">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {video.views} views • {video.time}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{video.channel}</p>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    Video description would appear here...
                  </p>
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
      <div className="border-b border-gray-800 sticky top-0 bg-[#0f0f0f] z-10">
        <div className={`flex items-center justify-between p-2 ${device === 'mobile' ? 'text-sm' : ''}`}>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <Menu className={`${device === 'mobile' ? 'h-5 w-5' : 'h-6 w-6'}`} />
            </button>
            <span className={`${device === 'mobile' ? 'text-lg' : 'text-xl'} font-semibold`}>YouTube</span>
          </div>
          
          {device === 'desktop' && (
            <div className="flex-1 max-w-2xl mx-4">
              <div className="flex">
                <div className="flex-1 flex items-center bg-[#121212] border border-gray-700 rounded-l-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <button className="px-6 bg-[#222222] border border-l-0 border-gray-700 rounded-r-full hover:bg-[#313131]">
                  <Search className="h-5 w-5" />
                </button>
                <button className="ml-2 p-2 hover:bg-gray-800 rounded-full">
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {device === 'mobile' ? (
              <>
                <button className="p-2 hover:bg-gray-800 rounded-full">
                  <Search className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full">
                  <User className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button className="p-2 hover:bg-gray-800 rounded-full">
                  <Video className="h-6 w-6" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full">
                  <Bell className="h-6 w-6" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full">
                  <User className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="border-b border-gray-800 p-2 sticky top-12 bg-[#0f0f0f] z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {device === 'desktop' ? (
              <>
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'grid' ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'list' ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setView('double')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'double' ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                  title="Double Column"
                >
                  <Columns className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setView('search')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'search' ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                  title="Search View"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setView('ab')}
                  className={`p-2 rounded-lg transition-colors ${
                    view === 'ab' ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                  title="A/B Testing"
                >
                  <SplitSquareHorizontal className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg transition-colors ${
                device === 'desktop' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <Monitor className="h-5 w-5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg transition-colors ${
                device === 'mobile' ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <Smartphone className="h-5 w-5" />
            </button>
            <button
              onClick={() => toggleFullscreen()}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`p-4 ${isFullscreen ? 'h-[calc(100vh-120px)] overflow-y-auto' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
}