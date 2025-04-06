import React from 'react';
import { useStore } from '../store';

export function TutorialAccordion() {
  const { currentLanguage } = useStore();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Preview your Thumbnails live on YouTube
        </h1>
        
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          Test and preview your video thumbnail designs inside YouTube in real time. Ensure your 
          content stands out and attracts viewers with our easy-to-use and customizable tool. 
          Optimize your click-through rates and drive more traffic to your videos with Thumbnail 
          Preview.
        </p>

        

        <h2 className="text-xl font-semibold mb-4">
          Click below or drag & drop thumbnails to start
        </h2>

       
      </div>
    </div>
  );
}