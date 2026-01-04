import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TagSidebar from '../components/TagSidebar';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const tag = searchParams.get('tag');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 5 };
        if (tag) params.tag = tag;

        const res = await api.get('/posts', { params });
        setPosts(res.data.data || []);
        setPagination(res.data.pagination || null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPosts([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, tag]);

  const goToPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    window.history.replaceState({}, '', `?${newParams.toString()}`);
    window.location.reload(); // Simple way to trigger re-fetch
  };

  if (loading) {
    return <div className="text-center py-10">Loading posts...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {!tag && (
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-md border-b border-white/10 text-white shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-bounce"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>


          <div className="relative container mx-auto px-6 py-20 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block mb-6">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                  ✨ Welcome to the future of blogging
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-fade-in">
                BlogSpace
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl mb-12 opacity-90 font-light leading-relaxed animate-fade-in-delay">
                Where ideas come alive. Discover extraordinary stories, groundbreaking insights, and meaningful connections from creators worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/register"
                  className="group relative bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Link>

                <Link
                  to="/login"
                  className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="flex items-center gap-2">
                    Sign In
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Floating Stats */}
              <div className="flex justify-center gap-8 mt-16 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-float">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-sm opacity-80">Stories Shared</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-float-delay">
                  <div className="text-3xl font-bold">5K+</div>
                  <div className="text-sm opacity-80">Active Writers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-float-delay-2">
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-sm opacity-80">Monthly Readers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                {tag ? `Posts tagged #${tag}` : 'Featured Stories'}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                {tag
                  ? `Discover all stories related to ${tag}`
                  : 'Handpicked stories that inspire, educate, and entertain'
                }
              </p>
            </div>

            {posts.length === 0 && (
              <div className="text-center py-20 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce border border-white/10">
                  <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {tag ? `No stories found for #${tag}` : 'No stories yet'}
                </h3>
                <p className="text-gray-300 text-lg mb-8">
                  {tag
                    ? `Be the first to write about ${tag}!`
                    : 'Be the first to share your story with the world.'
                  }
                </p>
                {!tag && !user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Write Your First Story
                  </Link>
                )}
              </div>
            )}

            <div className="grid gap-8 lg:gap-10">
              {posts.map((post, index) => (
                <article
                  key={post._id}
                  className="group bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-blue-300/50 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {(post.author?.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {post.author?.username || 'Unknown Author'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        <Link to={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      {post.content && (
                        <p className="text-gray-700 text-lg leading-relaxed mb-6 line-clamp-3">
                          {post.content.replace(/[#*`]/g, '').substring(0, 200)}...
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                          {post.tags?.slice(0, 4).map((tag) => (
                            <Link
                              key={tag._id}
                              to={`/?tag=${tag.slug}`}
                              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium hover:from-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105 border border-blue-200/50"
                            >
                              #{tag.name}
                            </Link>
                          ))}
                          {post.tags?.length > 4 && (
                            <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                              +{post.tags.length - 4} more
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/post/${post.slug}`}
                          className="group/btn flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-lg transition-all duration-300"
                        >
                          Read Story
                          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {pagination && posts.length > 0 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => goToPage(pagination.page - 1)}
                  className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold">
                  <span>Page {pagination.page}</span>
                  <span className="text-blue-200">of</span>
                  <span>{pagination.totalPages}</span>
                </div>

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => goToPage(pagination.page + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TagSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
