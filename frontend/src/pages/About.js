import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">About ANDYTUBE</h1>
        
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">🎬 What We Do</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            ANDYTUBE is a premium video streaming platform where content creators 
            can share their videos and viewers can access exclusive content through 
            secure payments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-semibold text-white mb-2">For Creators</h3>
            <p className="text-gray-400">Upload and manage your video content easily</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-white mb-2">For Viewers</h3>
            <p className="text-gray-400">Access premium content with secure payments</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure</h3>
            <p className="text-gray-400">Your data and payments are always protected</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">🛠️ Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {['React', 'Node.js', 'MongoDB', 'Stripe', 'Cloudinary', 'Tailwind CSS'].map(tech => (
              <span key={tech} className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;