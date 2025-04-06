import React from 'react';
import { Thumbnail } from '../types';

interface YouTubeMockupProps {
  thumbnail: Thumbnail;
  variant: 'desktop' | 'mobile';
}

export function YouTubeMockup({ thumbnail, variant }: YouTubeMockupProps) {
  const containerClass = variant === 'desktop'
    ? 'w-[360px] h-[202px]'
    : 'w-[160px] h-[90px]';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`relative ${containerClass}`}>
        <img
          src={thumbnail.preview}
          alt="Thumbnail"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 right-0 bg-black bg-opacity-80 text-white text-xs px-1">
          8:24
        </div>
      </div>
      <div className={`p-2 ${variant === 'mobile' ? 'text-sm' : 'text-base'}`}>
        <h3 className="font-medium line-clamp-2">{thumbnail.title || 'Enter your video title...'}</h3>
        <p className="text-gray-600 text-sm mt-1">Your Channel</p>
        <p className="text-gray-600 text-xs">2.5K views • 3 hours ago</p>
      </div>
    </div>
  );
}