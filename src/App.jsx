import React, { useState, useEffect, useRef } from 'react';
import { Camera, TrendingUp, Award, Star, Upload, Heart, Users, Trophy, Flame, ChevronUp, ChevronDown, X, Menu } from 'lucide-react';

// Mock data for demonstration
const INITIAL_POSTS = [
  {
    id: 1,
    username: "styleking",
    avatar: "🔥",
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
    likes: 2847,
    caption: "Vintage vibes today",
    timestamp: Date.now() - 3600000,
    userPoints: 15420
  },
  {
    id: 2,
    username: "fitguru",
    avatar: "✨",
    imageUrl: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800",
    likes: 1923,
    caption: "Streetwear essentials",
    timestamp: Date.now() - 7200000,
    userPoints: 12100
  },
  {
    id: 3,
    username: "drip_master",
    avatar: "💎",
    imageUrl: "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=800",
    likes: 3421,
    caption: "Clean fit for the weekend",
    timestamp: Date.now() - 10800000,
    userPoints: 18900
  },
  {
    id: 4,
    username: "fashion_nova",
    avatar: "🌟",
    imageUrl: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800",
    likes: 4102,
    caption: "Monochrome Monday",
    timestamp: Date.now() - 14400000,
    userPoints: 21500
  },
  {
    id: 5,
    username: "urban_style",
    avatar: "⚡",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
    likes: 1567,
    caption: "Casual Friday done right",
    timestamp: Date.now() - 18000000,
    userPoints: 9800
  }
];

const BADGES = {
  1000: { name: "Rising Star", icon: "⭐", color: "bg-yellow-500" },
  10000: { name: "Style Icon", icon: "💫", color: "bg-blue-500" },
  50000: { name: "Fashion Legend", icon: "👑", color: "bg-purple-500" },
  100000: { name: "Drip King", icon: "💎", color: "bg-pink-500" },
  1000000: { name: "Fit God", icon: "🔥", color: "bg-red-500" }
};

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [currentUser, setCurrentUser] = useState({
    username: "you",
    points: 5420,
    totalLikes: 8900,
    streak: 7,
    avatar: "😎"
  });
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showMenu, setShowMenu] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [newPost, setNewPost] = useState({ caption: '', image: null, preview: null });
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const scrollTimeout = useRef(null);

  const getUserBadge = (totalLikes) => {
    const badges = Object.keys(BADGES).map(Number).sort((a, b) => b - a);
    for (let threshold of badges) {
      if (totalLikes >= threshold) {
        return BADGES[threshold];
      }
    }
    return null;
  };

  const getLeaderboard = () => {
    const userScores = {};
    posts.forEach(post => {
      if (!userScores[post.username]) {
        userScores[post.username] = {
          username: post.username,
          avatar: post.avatar,
          points: post.userPoints,
          totalLikes: post.likes
        };
      } else {
        userScores[post.username].totalLikes += post.likes;
      }
    });
    
    if (!userScores[currentUser.username]) {
      userScores[currentUser.username] = currentUser;
    }

    return Object.values(userScores).sort((a, b) => b.points - a.points);
  };

  const handleLike = (postId) => {
    if (likedPosts.has(postId)) {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes - 1 } : p
      ));
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
      setLikedPosts(prev => new Set([...prev, postId]));
      setCurrentUser(prev => ({ ...prev, points: prev.points + 5 }));
    }
  };

  const navigatePost = (direction) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'down' && currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    
    setTimeout(() => setIsScrolling(false), 500);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    clearTimeout(scrollTimeout.current);
    
    scrollTimeout.current = setTimeout(() => {
      if (e.deltaY > 0) {
        navigatePost('down');
      } else {
        navigatePost('up');
      }
    }, 50);
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigatePost('down');
      } else {
        navigatePost('up');
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost(prev => ({
          ...prev,
          image: file,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = () => {
    if (newPost.preview) {
      const post = {
        id: posts.length + 1,
        username: currentUser.username,
        avatar: currentUser.avatar,
        imageUrl: newPost.preview,
        likes: 0,
        caption: newPost.caption,
        timestamp: Date.now(),
        userPoints: currentUser.points
      };
      setPosts([post, ...posts]);
      setCurrentUser(prev => ({ 
        ...prev, 
        points: prev.points + 100,
        streak: prev.streak + 1
      }));
      setNewPost({ caption: '', image: null, preview: null });
      setShowUpload(false);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentIndex]);

  const leaderboard = getLeaderboard();
  const userBadge = getUserBadge(currentUser.totalLikes);
  const currentPost = posts[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen overflow-hidden bg-black relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">FitCheck</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-semibold text-white text-sm">{currentUser.streak}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-white text-sm">{currentUser.points.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Post Display */}
      <div className="h-full w-full relative">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-all duration-500 ${
              index === currentIndex 
                ? 'opacity-100 scale-100' 
                : index < currentIndex 
                ? 'opacity-0 scale-95 -translate-y-full' 
                : 'opacity-0 scale-95 translate-y-full'
            }`}
          >
            <img
              src={post.imageUrl}
              alt="Fit"
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
        ))}

        {/* Post Info Overlay */}
        {currentPost && (
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <div className="flex items-end justify-between">
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl border-2 border-white">
                    {currentPost.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{currentPost.username}</p>
                    <p className="text-sm text-white/70 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      {currentPost.userPoints.toLocaleString()} pts
                    </p>
                  </div>
                </div>
                <p className="text-white text-lg mb-4 max-w-md">{currentPost.caption}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 items-center">
                <button
                  onClick={() => handleLike(currentPost.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`p-3 rounded-full transition-all ${
                    likedPosts.has(currentPost.id)
                      ? 'bg-pink-500 scale-110'
                      : 'bg-white/20 backdrop-blur-md group-hover:bg-pink-500/50'
                  }`}>
                    <Heart
                      className="w-7 h-7 text-white"
                      fill={likedPosts.has(currentPost.id) ? 'currentColor' : 'none'}
                    />
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {currentPost.likes.toLocaleString()}
                  </span>
                </button>

                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-yellow-500/50 transition-all">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white font-semibold text-xs">Rank</span>
                </button>

                <button
                  onClick={() => setShowUpload(true)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 group-hover:from-purple-700 group-hover:to-pink-700 transition-all">
                    <Upload className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white font-semibold text-xs">Post</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={() => navigatePost('up')}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-32 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all"
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>
        )}
        
        {currentIndex < posts.length - 1 && (
          <button
            onClick={() => navigatePost('down')}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all animate-bounce"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Progress Indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {posts.map((_, index) => (
            <div
              key={index}
              className={`w-1 rounded-full transition-all ${
                index === currentIndex 
                  ? 'h-8 bg-white' 
                  : 'h-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto">
          <div className="min-h-screen p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-8 h-8 text-yellow-400" />
                Leaderboard
              </h2>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <p className="text-white/70 mb-6">Weekly rankings • Resets Monday</p>

            <div className="space-y-3 max-w-2xl mx-auto">
              {leaderboard.map((user, index) => (
                <div
                  key={user.username}
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all ${
                    user.username === currentUser.username
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 scale-105'
                      : 'bg-white/10 backdrop-blur-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-white/20 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.username}</p>
                      <p className="text-sm text-white/70">{user.totalLikes?.toLocaleString() || 0} likes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-white">{user.points.toLocaleString()}</p>
                    <p className="text-xs text-white/70">points</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="mt-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your Badges
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {Object.entries(BADGES).map(([threshold, badge]) => {
                  const achieved = currentUser.totalLikes >= Number(threshold);
                  return (
                    <div
                      key={threshold}
                      className={`p-4 rounded-xl text-center transition-all ${
                        achieved ? badge.color + ' text-white scale-105' : 'bg-white/10 text-white/30'
                      }`}
                    >
                      <div className="text-3xl mb-1">{badge.icon}</div>
                      <p className="font-semibold text-xs">{badge.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Post Your Fit</h2>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setNewPost({ caption: '', image: null, preview: null });
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {!newPost.preview ? (
              <label className="border-2 border-dashed border-white/30 rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-white/5 transition-all">
                <Upload className="w-16 h-16 text-white/50 mb-3" />
                <p className="text-white/70">Tap to upload</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div>
                <img
                  src={newPost.preview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-2xl mb-4"
                />
                <textarea
                  placeholder="Add a caption..."
                  value={newPost.caption}
                  onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-purple-400 transition-all"
                  rows="3"
                />
                <button
                  onClick={handlePostSubmit}
                  className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Post Fit (+100 points)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;