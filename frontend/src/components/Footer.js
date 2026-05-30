import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-4">ANDYTUBE</h3>
            <p className="text-gray-400">
              Premium video streaming platform for creators and viewers.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-purple-400">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-purple-400">About</a></li>
              <li><a href="/login" className="text-gray-400 hover:text-purple-400">Login</a></li>
              <li><a href="/register" className="text-gray-400 hover:text-purple-400">Register</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-purple-400">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-purple-400">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-2xl">📘</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-2xl">🐦</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-2xl">📸</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-2xl">📹</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500">
            © 2024 ANDYTUBE. Made with ❤️ by andyaxceldcc-crypto
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;