import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileImage, BarChart2, Target, Clock, Users, AlertTriangle } from 'lucide-react';

export function HowToPage() {
  return (
    <>
      <Helmet>
        <title>How to A/B Test YouTube Thumbnails - Complete Guide</title>
        <meta name="description" content="Learn how to effectively A/B test your YouTube thumbnails. Step-by-step guide with best practices and tips for better results." />
        <meta name="keywords" content="how to a/b test thumbnails, youtube thumbnail testing guide, thumbnail optimization" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-center">
            How to A/B Test YouTube Thumbnails
          </h1>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Step-by-Step Guide</h2>
            
            <ol className="space-y-6">
              <li className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <FileImage className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">1. Create Multiple Versions</h3>
                  <p className="text-gray-600">
                    Design 2-3 different thumbnail versions with varying elements:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    <li>Different text placement or styling</li>
                    <li>Alternative images or backgrounds</li>
                    <li>Varied color schemes</li>
                    <li>Different layouts and compositions</li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <Target className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">2. Test One Variable at a Time</h3>
                  <p className="text-gray-600">
                    Change only one element between versions to clearly identify what impacts performance:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    <li>Text size or font</li>
                    <li>Image composition</li>
                    <li>Color scheme</li>
                    <li>Call-to-action placement</li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <BarChart2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">3. Analyze Results</h3>
                  <p className="text-gray-600">
                    Monitor key metrics to determine the winning version:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    <li>Click-through rate (CTR)</li>
                    <li>View duration</li>
                    <li>Audience retention</li>
                    <li>Overall engagement</li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Best Practices</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <Clock className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Test Duration</h3>
                  <p className="text-gray-600">Run tests for at least 7-14 days to gather sufficient data for meaningful results.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Sample Size</h3>
                  <p className="text-gray-600">Aim for at least 1000 impressions per thumbnail version for statistically significant results.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Common Mistakes to Avoid</h3>
                <ul className="mt-2 list-disc list-inside text-yellow-700">
                  <li>Testing too many variables at once</li>
                  <li>Not running tests long enough</li>
                  <li>Ignoring mobile viewers</li>
                  <li>Making conclusions with insufficient data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}