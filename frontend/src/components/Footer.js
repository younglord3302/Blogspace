import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="relative bg-gray-900 text-white mt-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                BlogSpace
              </span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              A premium platform for sharing ideas, stories, and insights with the world.
              Join our community of thought leaders.
            </p>
            <div className="flex space-x-6">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a key={social} href={`#${social}`} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 group">
                  <span className="text-gray-400 group-hover:text-white capitalize sr-only">{social}</span>
                  {/* Icon placeholder since we don't have font awesome */}
                  <div className="w-5 h-5 bg-gray-500 group-hover:bg-white rounded-sm"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 block">Home</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 block">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 block">Sign Up</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin" className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition-all duration-300 block">Admin Panel</Link></li>
              )}
            </ul>
          </div>

          {/* Newsletter (New) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white relative inline-block">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pink-500"></span>
            </h3>
            <p className="text-gray-400">Subscribe for the latest stories and updates.</p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} BlogSpace. All rights reserved. 
            <span className="mx-2">|</span>
            Made with <span className="text-red-500 animate-pulse">❤️</span> for creators.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
