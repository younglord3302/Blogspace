import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const TagSidebar = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTag = searchParams.get('tag');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/tags');
        setTags(res.data.tags || []);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  const handleTagClick = (tagSlug) => {
    const newParams = new URLSearchParams(searchParams);
    if (tagSlug) {
      newParams.set('tag', tagSlug);
    } else {
      newParams.delete('tag');
    }
    newParams.delete('page'); // Reset to first page
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold">#</span>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Discover Topics
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Discover Topics
          </h3>
          <p className="text-sm text-gray-600">Explore stories by category</p>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleTagClick('')}
          className={`group w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
            !currentTag
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 border border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              !currentTag
                ? 'bg-white/20'
                : 'bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200'
            }`}>
              <svg className={`w-4 h-4 transition-colors ${
                !currentTag ? 'text-white' : 'text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="font-semibold">All Stories</span>
          </div>
        </button>

        {tags.map((tag, index) => (
          <button
            key={tag._id}
            onClick={() => handleTagClick(tag.slug)}
            className={`group w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in ${
              currentTag === tag.slug
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                currentTag === tag.slug
                  ? 'bg-white/20'
                  : 'bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200'
              }`}>
                <span className={`text-sm font-bold transition-colors ${
                  currentTag === tag.slug ? 'text-white' : 'text-blue-600'
                }`}>#</span>
              </div>
              <div className="flex-1">
                <span className="font-semibold capitalize">{tag.name}</span>
                <div className={`text-xs mt-1 transition-colors ${
                  currentTag === tag.slug ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  Explore {tag.name} stories
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No topics available yet</p>
          <p className="text-gray-400 text-xs mt-1">Create your first post to get started</p>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">{tags.length} topics available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSidebar;
