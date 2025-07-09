import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoutToggle from '@/components/LogoutToggle';

interface Post {
  _id: string;
  content: string;
  user: { _id: string; name: string };
  createdAt: string;
  likes?: string[];
}

const PublicPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = (searchQuery = '') => {
    setLoading(true);
    fetch(`http://localhost:3001/api/public-posts?search=${encodeURIComponent(searchQuery)}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(search);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Public Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-content">
            <div className="header-top">
              <h1>Public Blog</h1>
              <div className="nav-buttons">
                <a href="/profile" className="profile-btn">My Profile</a>
                <div>
                  <a href="/login" className="logout-btn"><LogoutToggle /></a>
                </div>
              </div>

            </div>
            <DarkModeToggle />
            <div className="header-bottom">
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search posts or users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button className="search-button" type="submit">Search</button>
              </form>

            </div>
          </div>
        </div>
        <div className="posts">
          {posts.length > 0 ? (
            posts.map(post => (
              <div className="post" key={post._id}>
                <div className="post-header">
                  <span className="post-author">{post.user.name}</span>
                  <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="post-content">{post.content}</div>
                <div className="post-footer">
                  <div className="post-actions">
                    <a href={`/like/${post._id}`}>Like</a>
                  </div>
                  <span className="likes-count">{post.likes ? post.likes.length : 0} Likes</span>
                </div>
              </div>
            ))
          ) : (
            <div className="post">
              <p>No posts found.</p>
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
        
        .header-top{
          display: flex;
          -webkit-box-pack: justify;
          justify-content: space-between;
          -webkit-box-align: center;
          align-items: flex-end;
        }
        .header {
          display: flex;
          -webkit-box-pack: justify;
          justify-content: space-evenly;
          align-items: center;
          margin-bottom: 20px;
          align-items: stretch;
          margin-bottom: 20px;
          flex-direction: column;
          flex-wrap: nowrap;

        }
        .nav-buttons {
          display: flex;
          gap: 10px;
          margin-right: 2rem;
          align-items: center;
        }
        .nav-buttons a {
          padding: 8px 8px;
          border-radius: 4px;
          text-decoration: none;
          align-items: center;
          color: white;
        }

        .public-blog-btn {
          background-color: var(--primary-color);
        }
        .logout-btn {
          // font-size: 10px;
          top: 20px;
          background-color: #f44336;
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
        .header-bottom{
          display: flex;
        }
        .search-form{
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
        .dark-mode-toggle {
          top: 1.09rem;
        }
      `}</style>
    </>
  );
};

export default PublicPosts; 