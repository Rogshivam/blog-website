import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoutToggle from '@/components/LogoutToggle';
import PostItem from '@/components/PostItem';

interface Post {
  _id: string;
  content: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  posts: Post[];
  followers?: any[];
  following?: any[];
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ;
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${baseURL}/api/profile`, {
        credentials: 'include'
      });

      if (res.status === 401) {
        // Token expired or invalid, redirect to login
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      // Sort posts by createdAt in descending order (latest first)
      if (data.user && data.user.posts) {
        data.user.posts.sort((a: Post, b: Post) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      setUser(data.user);
      setLoading(false);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  // const handlePost = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');

  //   if (!content.trim()) {
  //     setError('Post content cannot be empty');
  //     return;
  //   }

  //   try {
  //     const res = await fetch(`${baseURL}/api/posts`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       credentials: 'include',
  //       body: JSON.stringify({ content }),
  //     });

  //     if (res.status === 401) {
  //       router.push('/login');
  //       return;
  //     }

  //     if (res.ok) {
  //       setContent('');
  //       const data = await res.json();

  //       // Sort posts by createdAt in descending order (latest first)
  //       if (data.user && data.user.posts) {
  //         data.user.posts.sort((a: Post, b: Post) => 
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //         );
  //       }
  //       setUser(data.user);
  //     } else {
  //       const errorData = await res.json();
  //       setError(errorData.error || 'Failed to create post');
  //     }
  //   } catch (err) {
  //     console.error('Create post error:', err);
  //     setError('Failed to create post');
  //   }
  // };
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    try {
      const res = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (res.ok) {
        const newPost = await res.json();
        setContent('');

        // Prepend the new post to existing posts
        if (user) {
          const updatedUser = {
            ...user,
            posts: [newPost, ...user.posts],
          };
          setUser(updatedUser);
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create post');
      }
    } catch (err) {
      console.error('Create post error:', err);
      setError('Failed to create post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (res.ok) {
        // Refresh profile data
        fetchProfile();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Delete post error:', err);
      setError('Failed to delete post');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <>
      <Head>
        <title>Profile - {user.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>


      <div className="container">
        <div className="header">
          <h1>Welcome, {user.name}</h1>
          <div className="nav-buttons">
            <Link href="/public-posts" className="nav-btn">Public Blog</Link>
            <LogoutToggle />
          </div>
        </div>

      <div className="dark-mode-toggle">
        <DarkModeToggle />
      </div>
        <div className="main-header">
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{user.posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.followers?.length ?? 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.following?.length ?? 0}</span>
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
              maxLength={1000}
            />
            <div className="form-footer">
              <span className="char-count">{content.length}/1000</span>
              <button type="submit" disabled={!content.trim()}>Post</button>
            </div>
          </form>
        </div>

        <div className="posts">
          <h2>Your Posts</h2>
          {user.posts && user.posts.length > 0 ? (
            user.posts.map((post, index) => (
              <div className="post" key={`${post._id}-${index}`}>
                <div className="post-header">
                  <p className="post-content">{post.content}</p>
                  <div className="post-actions">
                    <Link href={`/edit/${post._id}`} className="edit-link">Edit</Link>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="post-meta">
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="post no-posts" key="no-posts">
              <p>No posts yet. Start sharing your thoughts!</p>
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
          top: 6px;
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
        
        .nav-btn {
          display: inline-block;
          padding: 8px 10px;
          border-radius: 4px;
          background-color: var(--primary-color);
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s;
        }
        .nav-buttons{
        // position: relative;
        left: -50px;
        }
        .nav-btn:hover {
          background-color: var(--primary-hover);
        }
        
        .public-blog-btn {
          background-color: var(--primary-color);
        }
        
        .public-blog-btn:hover {
          background-color: var(--primary-hover);
        }
        
        .logout-btn {
          // position: fixed;
          top: 20px;
          right: 20px;
          // padding: 10px 15px;
          // background-color: #da3036;
          color: white;
          border-radius: 4px;
          text-align: center;
          // z-index: 1000;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .logout-btn:hover {
          background-color: #c53030;
        }
        
        .user-info {
          margin-bottom: 20px;
        }
        
        .post-form {
          margin-bottom: 20px;
        }
        
        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        
        .char-count {
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.7;
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
          min-height: 100px;
          font-family: inherit;
        }
        
        textarea:focus {
          outline: none;
          border-color: var(--primary-color);
        }
        
        button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: var(--primary-color);
          color: white;
          transition: background-color 0.3s;
        }
        
        button:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .posts {
          margin-top: 20px;
        }
        
        .post {
          background-color: var(--post-bg);
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
          border: 1px solid var(--input-border);
        }
        
        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          gap: 10px;
        }
        
        .post-content {
          flex: 1;
          margin: 0;
          word-wrap: break-word;
        }
        
        .post-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }
        
        .edit-link {
          color: var(--primary-color);
          text-decoration: none;
          padding: 4px 8px;
          border-radius: 3px;
          transition: background-color 0.3s;
        }
        
        .edit-link:hover {
          background-color: rgba(66, 153, 225, 0.1);
        }
        
        .delete-btn {
          background-color: #e53e3e;
          color: white;
          padding: 4px 8px;
          font-size: 0.9rem;
        }
        
        .delete-btn:hover {
          background-color: #c53030;
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
        
        .profile-stats {
          display: flex;
          gap: 20px;
          margin-top: 10px;
        }
        
        .main-header {
          justify-content: space-between;
          display: flex;
          flex-wrap: wrap;
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
            padding: 11px 10px;
            font-size: 14px;
          }
          
          .main-header {
            flex-direction: column;
          }
          
          .post-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .post-actions {
            margin-top: 10px;
          }
          .nav-buttons{
          position: relative;
          left: 6px;
          }
        }
      `}</style>
    </>
  );
};

export default Profile;
