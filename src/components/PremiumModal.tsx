import React from 'react';
import { Crown, X } from 'lucide-react';
import { useStore } from '../store';

interface PremiumModalProps {
  onClose: () => void;
}

export function PremiumModal({ onClose }: PremiumModalProps) {
  const togglePremium = useStore((state) => state.togglePremium);

  const handleUpgrade = () => {
    togglePremium();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h2 className="text-2xl font-bold ml-2">Upgrade to Premium</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Premium Features</h3>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center">
              <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">✓</span>
              <span className="ml-3">Upload up to 5 thumbnails</span>
            </li>
            <li className="flex items-center">
              <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">✓</span>
              <span className="ml-3">Advanced analytics</span>
            </li>
            <li className="flex items-center">
              <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">✓</span>
              <span className="ml-3">Competitor analysis</span>
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <button
            onClick={handleUpgrade}
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upgrade Now
          </button>
          <p className="mt-2 text-sm text-gray-500 text-center">
            30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}