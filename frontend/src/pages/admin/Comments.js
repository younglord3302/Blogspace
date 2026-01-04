import { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/comments', { params: { status: filter } });
      setComments(res.data.comments);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchComments();
  }, [filter, fetchComments]);

  const handleStatusChange = async (commentId, newStatus) => {
    try {
      await api.put(`/comments/${commentId}`, { status: newStatus });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      setError('Failed to update comment status');
      console.error('Error updating comment:', err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Comment Moderation</h1>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex space-x-4 mb-4">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({comments.filter(c => c.status === status).length})
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>{comment.author?.username || 'Anonymous'}</strong> on{' '}
                    <a
                      href={`/post/${comment.post?.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {comment.post?.title || 'Unknown Post'}
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(comment._id, 'approved')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(comment._id, 'rejected')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No {filter} comments found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
