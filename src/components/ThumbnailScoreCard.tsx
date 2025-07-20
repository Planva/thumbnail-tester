import React from 'react';
import { ThumbnailScore } from '../utils/scoringAlgorithm';
import { Star, TrendingUp, AlertTriangle, CheckCircle, Target, Zap } from 'lucide-react';

interface ThumbnailScoreCardProps {
  score: ThumbnailScore;
  thumbnailIndex: number;
  isDarkMode?: boolean;
}

export function ThumbnailScoreCard({ score, thumbnailIndex, isDarkMode = true }: ThumbnailScoreCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'B+':
      case 'B':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'C+':
      case 'C':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return isDarkMode ? 'text-red-400' : 'text-red-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 70) return isDarkMode ? 'text-blue-400' : 'text-blue-600';
    if (score >= 60) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100';
      case 'medium':
        return isDarkMode ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-600 bg-yellow-100';
      case 'low':
        return isDarkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-100';
      default:
        return isDarkMode ? 'text-gray-400 bg-gray-900/30' : 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* 头部 - 总分和等级 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Version {String.fromCharCode(65 + thumbnailIndex)} Score
          </h3>
          <div className="flex items-center space-x-3">
            <span className={`text-3xl font-bold ${getScoreColor(score.overallScore)}`}>
              {score.overallScore}
            </span>
            <span className={`text-2xl font-bold ${getGradeColor(score.grade)}`}>
              {score.grade}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            <Target className="h-4 w-4 text-indigo-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Predicted CTR</span>
          </div>
          <span className="text-2xl font-bold text-indigo-500">{score.predictedCTR}%</span>
        </div>
      </div>

      {/* 分类评分 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Visual Quality</span>
            <span className={`font-bold ${getScoreColor(score.categoryScores.visual)}`}>
              {score.categoryScores.visual}
            </span>
          </div>
          <div className={`w-full bg-gray-600 rounded-full h-2 mt-2`}>
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${score.categoryScores.visual}%` }}
            />
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Text Quality</span>
            <span className={`font-bold ${getScoreColor(score.categoryScores.text)}`}>
              {score.categoryScores.text}
            </span>
          </div>
          <div className={`w-full bg-gray-600 rounded-full h-2 mt-2`}>
            <div 
              className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${score.categoryScores.text}%` }}
            />
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Person Quality</span>
            <span className={`font-bold ${getScoreColor(score.categoryScores.person)}`}>
              {score.categoryScores.person}
            </span>
          </div>
          <div className={`w-full bg-gray-600 rounded-full h-2 mt-2`}>
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${score.categoryScores.person}%` }}
            />
          </div>
        </div>

        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Engagement</span>
            <span className={`font-bold ${getScoreColor(score.categoryScores.engagement)}`}>
              {score.categoryScores.engagement}
            </span>
          </div>
          <div className={`w-full bg-gray-600 rounded-full h-2 mt-2`}>
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${score.categoryScores.engagement}%` }}
            />
          </div>
        </div>
      </div>

      {/* 优势 */}
      {score.strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Strengths</h4>
          </div>
          <div className="space-y-2">
            {score.strengths.slice(0, 3).map((strength, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {strength}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 改进建议 */}
      {score.recommendations.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recommendations</h4>
          </div>
          <div className="space-y-3">
            {score.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                rec.priority === 'high' 
                  ? 'border-red-500 bg-red-900/10' 
                  : rec.priority === 'medium'
                  ? 'border-yellow-500 bg-yellow-900/10'
                  : 'border-blue-500 bg-blue-900/10'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {rec.title}
                      </h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority === 'high' ? 'High' : rec.priority === 'medium' ? 'Med' : 'Low'}
                      </span>
                    </div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {rec.description}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      💡 {rec.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 劣势 */}
      {score.weaknesses.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Areas to Improve</h4>
          </div>
          <div className="space-y-2">
            {score.weaknesses.slice(0, 3).map((weakness, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {weakness}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}