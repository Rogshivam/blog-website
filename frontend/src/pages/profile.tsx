import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoutToggle from '@/components/LogoutToggle';

interface Post {
  _id: string;
  content: string;
}
interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  posts: Post[];
  followers?: string[];
  following?: string[];
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();


  useEffect(() => {
    fetch('http://localhost:3001/api/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });
      if (res.ok) {
        setContent('');
        // Reload posts
        const data = await res.json();
        setUser(data.user);
      } else {
        setError('Failed to create post');
      }
    } catch (err) {
      setError('Failed to create post');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
      
        <div className="header">
          <h1>Welcome, {user.name}</h1>
          <div className="nav-buttons">
            <a href="/public-posts" className="public-blog-btn">Public Blog</a> 
            <div className="logout-btn">
              <a href="/login" className="logout-btn">
                <LogoutToggle />
              </a>
            </div>
            
          </div>
          
          <DarkModeToggle />
        </div>
        <div className="main-header">
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{user.posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.followers ? user.followers.length : 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.following ? user.following.length : 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          <div className="profile-stats">
            <div className="user-info">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
        </div>
        <br />
        <div className="post-form">
          <form onSubmit={handlePost}>
            <textarea
              name="content"
              placeholder="What's on your mind?"
              required
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </div>
        <div className="posts">
          <h2>Your Posts</h2>
          {user.posts && user.posts.length > 0 ? (
            user.posts.map(post => (
              <div className="post" key={post._id}>
                <div className="post-header">
                  <p>{post.content}</p>
                  <div className="post-actions">
                    <a href={`/like/${post._id}`}>Like</a>
                    <a href={`/edit/${post._id}`}>Edit</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="post">
              <p>No posts yet.</p>
            </div>
          )}
        </div>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
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
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .nav-buttons {
          display: flex;
          gap: 10px;
        }
        .nav-buttons a {
          padding: 8px 15px;
          border-radius: 4px;
          text-decoration: none;
          color: white;
        }
        .public-blog-btn {
          background-color: var(--primary-color);
        }
        .logout-btn {
          background-color: #da3036 ;
        } 
        .user-info {
          margin-bottom: 20px;
        }
        .post-form {
          margin-bottom: 20px;
        }
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--input-border);
          border-radius: 4px;
          margin-bottom: 10px;
          resize: vertical;
          background-color: var(--container-bg);
          color: var(--text-color);
        }
        
        .posts {
          margin-top: 20px;
        }
        .post {
          background-color: var(--post-bg);
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        .post-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .post-actions {
          display: flex;
          gap: 10px;
        }
        .post-actions a {
          color: var(--primary-color);
          text-decoration: none;
        }
        .post-actions a:hover {
          text-decoration: underline;
        }
        .profile-stats {
          display: flex;
          gap: 20px;
          margin-top: 10px;
        }
        .main-header {
          justify-content: space-between;
          display: flex;
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
        .nav-buttons {
        margin-right: 2rem;
        }
        .dark-mode-toggle {
        top: 20px;
        }
      `}</style>
    </>
  );
};

export default Profile; 