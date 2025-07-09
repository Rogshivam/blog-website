import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const EditPost: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load dark mode script
    const script = document.createElement('script');
    script.src = '/js/darkmode.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    // Fetch post data from backend
    fetch(`http://localhost:3001/api/posts/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setContent(data.content || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load post');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
      });
      if (res.ok) {
        router.push('/profile');
      } else {
        setError('Failed to update post');
      }
    } catch (err) {
      setError('Failed to update post');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Edit Post</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <button id="darkModeToggle" className="dark-mode-toggle">🌙</button>
        <h1>Edit Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              name="content"
              required
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <div className="buttons">
            <a href="/profile" className="cancel-btn">Cancel</a>
            <button type="submit" className="save-btn">Save Changes</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </form>
      </div>
      <style jsx global>{`
        :root {
          --primary-color: #4299e1;
          --primary-hover: #3182ce;
          --bg-color: #f4f4f4;
          --text-color: #333;
          --container-bg: white;
          --input-border: #ddd;
        }
        .dark-mode {
          --bg-color: #1a202c;
          --text-color: #e2e8f0;
          --container-bg: #2d3748;
          --input-border: #4a5568;
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
          max-width: 600px;
          margin: 0 auto;
          background-color: var(--container-bg);
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          position: relative;
        }
        .dark-mode-toggle {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 5px;
        }
        h1 {
          text-align: center;
          color: var(--text-color);
          margin-bottom: 20px;
          margin-top: 30px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--input-border);
          border-radius: 4px;
          resize: vertical;
          min-height: 100px;
          background-color: var(--container-bg);
          color: var(--text-color);
        }
        .buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        button, .cancel-btn {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        .save-btn {
          background-color: var(--primary-color);
          color: white;
        }
        .cancel-btn {
          background-color: #f44336;
          color: white;
        }
        button:hover, .cancel-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
};

export default EditPost; 