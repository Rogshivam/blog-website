import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DarkModeToggle from '../components/DarkModeToggle';
import LogoutToggle from '@/components/LogoutToggle';
import PostItem from '@/components/PostItem';

interface Post {
  _id: string;
  content: string;
  user: { _id: string; name: string; username?: string };
  createdAt: string;
  likes?: string[];
}

  const PublicPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchPosts = (searchQuery = '') => {
    setLoading(true);
    fetch(`${baseURL}/api/public-posts?search=${encodeURIComponent(searchQuery)}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
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

  if (loading) return <div className="loading"><div className="spinner"></div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Public Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="container">
        <header className="main-header">
          <h1>Public Blog</h1>

          <div className="toggles">
          <div className="actions">
            <Link href="/profile" className="btn">My Profile</Link>
            <LogoutToggle />
            </div>
          </div>
            <div className="dark-mode-toggle">
              <DarkModeToggle />
            
            </div>
        </header>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts or users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="posts">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map(post => <PostItem key={post._id} post={post} />)
          ) : (
            <p className="no-posts">No posts found.</p>
          )}
        </div>

        {error && <div className="error">{error}</div>}
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
          --link-color: #007bff;
          --link-hover: #0056b3;
        }
        
        .dark-mode {
          --bg-color: #1a202c;
          --text-color: #e2e8f0;
          --container-bg: #2d3748;
          --input-border: #4a5568;
          --post-bg: #4a5568;
          --link-color: #63b3ed;
          --link-hover: #4299e1;
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
          padding: 20px;
          background-color: var(--container-bg);
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--input-border);
        }

        .main-header h1 {
          margin: 0;
          color: var(--text-color);
        }

        .actions {
          display: flex;
          gap: 10px;
          align-items: center;
          //  margin-left: 50px;
        }
        .toggles{
           padding-right: 45px;
        }

        .btn {
          padding: 8px 16px;
          background: var(--primary-color);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }

        .btn:hover {
          background: var(--primary-hover);
        }

        .search-form {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }

        .search-form input {
          flex: 1;
          padding: 12px;
          border: 1px solid var(--input-border);
          border-radius: 4px;
          background-color: var(--container-bg);
          color: var(--text-color);
          font-size: 14px;
        }

        .search-form input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
        }

        .search-form button {
          padding: 12px 20px;
          background: var(--success-color);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .search-form button:hover {
          background: #2f855a;
        }

        .posts {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .post {
          border: 1px solid var(--input-border);
          border-radius: 8px;
          padding: 20px;
          background-color: var(--post-bg);
          transition: box-shadow 0.3s;
        }

        .post:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          font-size: 14px;
        }

        .user-link {
          text-decoration: none;
          color: var(--link-color);
          transition: color 0.3s;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-link:hover {
          color: var(--link-hover);
        }

        .user-link strong {
          font-size: 16px;
        }

        .username {
          font-size: 12px;
          opacity: 0.7;
          font-weight: normal;
        }

        .post-date {
          color: var(--text-color);
          opacity: 0.7;
          font-size: 12px;
        }

        .post-content {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 15px;
          color: var(--text-color);
          word-wrap: break-word;
        }

        .post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .like-btn {
          padding: 8px 16px;
          background-color: transparent;
          border: 1px solid var(--link-color);
          color: var(--link-color);
          cursor: pointer;
          border-radius: 20px;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .like-btn:hover {
          background-color: var(--link-color);
          color: white;
        }

        .like-btn.liked {
          background-color: var(--link-color);
          color: white;
        }

        .like-count {
          color: var(--text-color);
          opacity: 0.7;
        }

        .error {
          color: #e53e3e;
          margin-top: 20px;
          padding: 12px;
          background-color: rgba(229, 62, 62, 0.1);
          border-radius: 4px;
          border: 1px solid rgba(229, 62, 62, 0.3);
        }

        .no-posts {
          text-align: center;
          color: var(--text-color);
          opacity: 0.7;
          font-size: 16px;
          padding: 40px;
        }

        .loader {
          text-align: center;
          font-size: 18px;
          padding: 40px;
          color: var(--text-color);
        }
        
        .dark-mode-toggle {
          position: absolute;
          top: 8px;
    right: 7px;
          padding-bottom: 25px;
          z-index: 1000;
        }

        @media (max-width: 600px) {
          .main-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .search-form {
            flex-direction: column;
          }

          .search-form input,
          .search-form button {
            width: 100%;
          }
          
          .post-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
          
          .post-footer {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
};

export default PublicPosts;
