import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import CommentForm from '../components/CommentForm';

const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async (postId) => {
    try {
      const res = await api.get(`/comments/post/${postId}`);
      setComments(res.data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      try {
        const postRes = await api.get(`/posts/${slug}`);
        setPost(postRes.data.post);
        await fetchComments(postRes.data.post._id);
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [slug]);

  const handleCommentAdded = () => {
    if (post) {
      fetchComments(post._id);
    }
  };

  if (loading) return <div className="py-10 text-center">Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Article Card */}
        <article className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          <div className="p-8 md:p-12">
            {/* Header */}
            <header className="mb-10 text-center">
              <div className="flex justify-center gap-3 mb-6">
                {post.tags?.map((tag) => (
                  <span
                    key={tag._id}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100/50"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-center gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {(post.author?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">{post.author?.username || 'Unknown'}</span>
                </div>
                <span>•</span>
                <time>{new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</time>
              </div>
            </header>

            {/* Divider */}
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-10 opacity-50"></div>

            {/* Content */}
            <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Previous/Next Navigation (Placeholder for now) or Share */}
        
        {/* Comments Section */}
        <section className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Discussion</h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
              {comments.length}
            </span>
          </div>

          <div className="mb-10">
            <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
              <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {comments.map((c) => (
                <li key={c._id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {(c.author?.username || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{c.author?.username || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed pl-13 ml-12">{c.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Post;
