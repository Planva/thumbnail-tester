import React, { useEffect, useRef } from 'react';
import { Thumbnail } from '../types';

interface BrightnessAnalysisProps {
  thumbnail: Thumbnail;
}

export function BrightnessAnalysis({ thumbnail }: BrightnessAnalysisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = thumbnail.preview;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let brightness = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        brightness += (r + g + b) / 3;
      }

      brightness = brightness / (data.length / 4);
      thumbnail.brightness = brightness;
    };
  }, [thumbnail]);

  const getTip = (brightness: number) => {
    if (brightness < 85) return 'Consider increasing brightness for better visibility';
    if (brightness > 170) return 'The image might be too bright, try reducing exposure';
    return 'Brightness levels look good!';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-2">Brightness Analysis</h3>
      <canvas ref={canvasRef} className="hidden" />
      <div className="mt-2">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${(thumbnail.brightness / 255) * 100}%` }}
            />
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {Math.round((thumbnail.brightness / 255) * 100)}%
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{getTip(thumbnail.brightness)}</p>
      </div>
    </div>
  );
}