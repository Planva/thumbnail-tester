import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'ThumbnailPro',
    content: 'Great composition! The contrast really makes it pop.',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    author: 'VideoCreator',
    content: 'The text placement could be improved for better readability.',
    timestamp: '1 hour ago'
  }
];

export function Comments() {
  const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Math.random().toString(36).substring(7),
      author: 'You',
      content: newComment,
      timestamp: 'Just now'
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <MessageSquare className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Comments</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Post Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-900">{comment.author}</span>
              <span className="text-sm text-gray-500">{comment.timestamp}</span>
            </div>
            <p className="mt-1 text-gray-600">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}