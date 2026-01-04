import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    pendingComments: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For now, we'll use placeholder stats since we don't have dedicated stats endpoints
        // In a real app, you'd have a /admin/stats endpoint
        const [postsRes, commentsRes] = await Promise.all([
          api.get('/posts?page=1&limit=1'), // Get pagination info
          api.get('/comments?status=pending') // Get pending comments
        ]);

        setStats({
          totalPosts: postsRes.data.pagination.totalItems,
          totalComments: 0, // Would need separate endpoint
          pendingComments: commentsRes.data.comments.length,
          totalUsers: 0 // Would need separate endpoint
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Posts</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalPosts}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Comments</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalComments}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Comments</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingComments}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/posts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
          >
            Create New Post
          </Link>
          <Link
            to="/admin/posts"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center"
          >
            Manage Posts
          </Link>
          <Link
            to="/admin/comments"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-center"
          >
            Moderate Comments ({stats.pendingComments})
          </Link>
        </div>
      </div>

      {/* Additional Admin Links */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/posts"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
          >
            Manage All Posts
          </Link>
          <Link
            to="/admin/comments"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
          >
            All Comments
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">Activity feed coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;
