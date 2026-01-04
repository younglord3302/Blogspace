import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Post from './pages/Post';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import Posts from './pages/admin/Posts';
import PostCreate from './pages/admin/PostCreate';
import Comments from './pages/admin/Comments';
import InteractiveBackground from './components/InteractiveBackground';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Hide offline banner after 5 seconds
    if (showOfflineBanner) {
      const timer = setTimeout(() => setShowOfflineBanner(false), 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showOfflineBanner]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative text-gray-800">
          <InteractiveBackground />
          
          {/* Network Status Banner */}
          {showOfflineBanner && (
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 shadow-lg animate-fade-in">
              <div className="container mx-auto flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium">You're offline. Some features may not work.</span>
              </div>
            </div>
          )}

          <Header />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:slug" element={<Post />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/posts"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Posts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/posts/new"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <PostCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/comments"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Comments />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />

          {/* API Connection Status Indicator */}
          <div className="fixed bottom-4 right-4 z-40">
            <div className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} title={isOnline ? 'Connected to API' : 'API connection lost'}></div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
