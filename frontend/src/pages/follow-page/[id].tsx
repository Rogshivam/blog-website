import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DarkModeToggle from '../../components/DarkModeToggle';
import LogoutToggle from '@/components/LogoutToggle';

interface Post {
  _id: string;
  content: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  posts: Post[];
  followers?: any[];
  following?: any[];
}

const FollowPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        credentials: 'include'
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await res.json();
      setUser(data.user);
      setCurrentUser(data.currentUser);
      setIsFollowing(data.isFollowing);
      setLoading(false);
    } catch (err) {
      console.error('User profile fetch error:', err);
      setError('Failed to load user profile');
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:5000/api/toggle-follow/${user._id}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        // Update the user's follower count
        if (user) {
          setUser(prev => prev ? {
            ...prev,
            followers: data.isFollowing
              ? [...(prev.followers || []), currentUser?._id]
              : (prev.followers || []).filter(id => id !== currentUser?._id)
          } : null);
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to toggle follow');
      }
    } catch (err) {
      console.error('Follow toggle error:', err);
      setError('Failed to toggle follow');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <>
      <Head>
        <title>{user.name} - Profile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <div className="header">
          <h1>{user.name}'s Profile</h1>
          <div className="nav-buttons">
            <Link href="/public-posts" className="nav-link">Public Blog</Link>
            <Link href="/profile" className="nav-link">My Profile</Link>
            {/* Sticky Logout Button */}
            <div className="logout-btn">
              <LogoutToggle />
            </div>
          </div>
        </div>
          <div className="dark-mode-toggler">
            <DarkModeToggle />
          </div>

        <div className="profile-header">
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <p className="username">@{user.username}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{user.posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.followers?.length || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.following?.length || 0}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>

          {currentUser && currentUser._id !== user._id && (
            <div className="follow-section">
              <button
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </div>

        <div className="posts-section">
          <h3>Posts</h3>
          {user.posts && user.posts.length > 0 ? (
            user.posts.map((post, index) => (
              <div className="post" key={`${post._id}-${index}`}>
                <div className="post-content">{post.content}</div>
                <div className="post-meta">
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="post no-posts" key="no-posts">
              <p>No posts yet.</p>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

      </div>

      <style jsx global>{`
        :root {
          --primary-color: #4299e1;
          --primary-hover: #3182ce;
          --bg-color: #f4f4f4;
          --text-color: #333;
          --container-bg: white;
          --input-border: #ddd;
          --post-bg: #f9f9f9;
          --error-color: #e53e3e;
          --success-color: #38a169;
        }
        
        .dark-mode {
          --bg-color: #1a202c;
          --text-color: #e2e8f0;
          --container-bg: #2d3748;
          --input-border: #4a5568;
          --post-bg: #4a5568;
        }
        .dark-mode-toggle {
        position: absolute;
        top: 8px;
        right: 7px;
        padding-bottom: 25px;
        z-index: 1000;
      }
        
        
        body {
          font-family: Arial, sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          margin: 0;
          padding: 20px;
          transition: background-color 0.3s, color 0.3s;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: var(--container-bg);
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          position: relative;
          min-height: 100vh;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          border-bottom: 1px solid var(--input-border);
          // position: relative;
          padding-right: 45px;
          padding-bottom: 20px;
        }
        
        .nav-buttons {
          display: flex;
          gap: 10px;
        }
        
        .nav-link {
          padding: 8px 10px;
          border-radius: 4px;
          text-decoration: none;
          color: white;
          background-color: var(--primary-color);
          transition: background-color 0.3s;
        }
        
        .nav-link:hover {
          background-color: var(--primary-hover);
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding: 20px;
          background-color: var(--post-bg);
          border-radius: 8px;
          border: 1px solid var(--input-border);
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .profile-info {
          flex: 1;
        }
        
        .profile-name {
          margin: 0 0 5px 0;
          color: var(--text-color);
        }
        
        .username {
          margin: 0 0 15px 0;
          color: var(--text-color);
          opacity: 0.7;
          font-size: 0.9rem;
        }
        
        .profile-stats {
          display: flex;
          gap: 20px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-color);
          opacity: 0.8;
        }
        
        .follow-section {
          flex-shrink: 0;
        }
        
        .follow-button {
          padding: 10px 20px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
          background-color: var(--primary-color);
          color: white;
        }
        
        .follow-button:hover {
          background-color: var(--primary-hover);
        }
        
        .follow-button.following {
          background-color: #38a169;
        }
        
        .follow-button.following:hover {
          background-color: #2f855a;
        }
        
        .posts-section {
          margin-top: 20px;
        }
        
        .posts-section h3 {
          margin-bottom: 15px;
          color: var(--text-color);
        }
        
        .post {
          background-color: var(--post-bg);
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
          border: 1px solid var(--input-border);
        }
        
        .post-content {
          margin: 0 0 10px 0;
          word-wrap: break-word;
        }
        
        .post-meta {
          margin-top: 10px;
        }
        
        .post-date {
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.7;
        }
        
        .no-posts {
          text-align: center;
          color: var(--text-color);
          opacity: 0.7;
        }
        
        .logout-btn {
          // position: fixed;
          bottom: 20px;
          right: 20px;
          // padding: 10px 15px;
          background-color: #299E1;
          color: white;
          border-radius: 4px;
          text-align: center;
          z-index: 1000;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .logout-btn:hover {
          background-color: #c53030;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: var(--text-color);
        }
        
        .error {
          text-align: center;
          padding: 40px;
          color: var(--error-color);
        }
        
        .error-message {
          color: var(--error-color);
          margin-top: 10px;
          padding: 10px;
          background-color: rgba(229, 62, 62, 0.1);
          border-radius: 4px;
          border: 1px solid rgba(229, 62, 62, 0.3);
        }
        
        @media (max-width: 768px) {
          .logout-btn {
            padding: 8px 12px;
            font-size: 14px;
          }
          
          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .profile-stats {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default FollowPage; 