import React from 'react';

const Profile = ({ user, onLogout }) => {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                user.isPremium ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-gray-300'
              }`}>
                {user.isPremium ? '⭐ Premium Member' : 'Free Member'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Member since</span>
                <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              
              {user.subscriptionEnd && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Subscription ends</span>
                  <span className="text-white">{new Date(user.subscriptionEnd).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">Total videos watched</span>
                <span className="text-white">{user.videosWatched?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {!user.isPremium && (
              <button className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition">
                Upgrade to Premium 💎
              </button>
            )}
            <button 
              onClick={onLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;