import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

interface CompetitorData {
  title: string;
  thumbnailUrl: string;
  views: string;
  ctr: number;
}

const SAMPLE_COMPETITORS: CompetitorData[] = [
  {
    title: "How I Gained 1M Subscribers",
    thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=480&q=80",
    views: "1.2M",
    ctr: 12.5,
  },
  {
    title: "YouTube Success Secrets",
    thumbnailUrl: "https://images.unsplash.com/photo-1610552050890-fe99536c2615?w=480&q=80",
    views: "850K",
    ctr: 9.8,
  },
];

export function CompetitorComparison() {
  const [url, setUrl] = useState('');
  const [competitors] = useState<CompetitorData[]>(SAMPLE_COMPETITORS);
  const { currentLanguage } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would fetch competitor data
    setUrl('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter competitor's YouTube video URL"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">Sample data shown for demonstration</p>
        </div>

        {competitors.map((competitor, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex gap-4">
              <img
                src={competitor.thumbnailUrl}
                alt={competitor.title}
                className="w-40 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{competitor.title}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Views: {competitor.views}</p>
                  <p>Estimated CTR: {competitor.ctr}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}