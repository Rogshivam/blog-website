import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DarkModeToggle from '../../components/DarkModeToggle';

const EditPost: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (!id) return;
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${baseURL}/api/posts/${id}`, {
        credentials: 'include'
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load post');
      }

      const data = await res.json();
      setContent(data.content || '');
      setLoading(false);
    } catch (err) {
      console.error('Fetch post error:', err);
      setError('Failed to load post');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!content.trim()) {
      setError('Post content cannot be empty');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (res.status === 403) {
        setError('You are not authorized to edit this post');
        setSaving(false);
        return;
      }

      if (res.ok) {
        router.push('/profile');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update post');
      }
    } catch (err) {
      console.error('Update post error:', err);
      setError('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Head>
        <title>Edit Post</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <div className="dark-toggle-wrapper">
          <DarkModeToggle />
        </div>

        <div className="header">
          <h1>Edit Post</h1>
        </div>


        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Post Content</label>
            <textarea
              id="content"
              name="content"
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={1000}
              placeholder="Write your post content here..."
            />
            <div className="char-count">{content.length}/1000</div>
          </div>

          <div className="buttons">
            <Link href="/profile" className="cancel-btn">Cancel</Link>
            <button
              type="submit"
              className="save-btn"
              disabled={saving || !content.trim()}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
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
          --error-color: #e53e3e;
          --success-color: #38a169;
          --bg-height: 100vh;
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
          padding: 0; /* remove padding */
          height: 100vh; /* ensure body fills screen */
        }

        #__next {
          height: 100%; /* make Next.js root element fill screen */
        }

        .full-screen {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          max-width: 600px;
          background-color: var(--container-bg);
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          position: relative;
          margin: auto;
        }

        .dark-toggle-wrapper {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 1000;
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
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        h1 {
          text-align: center;
          color: var(--text-color);
          margin: 0;
          flex: 1;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: var(--text-color);
        }
        
        textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--input-border);
          border-radius: 4px;
          resize: vertical;
          min-height: 150px;
          background-color: var(--container-bg);
          color: var(--text-color);
          font-family: inherit;
          font-size: 14px;
          line-height: 1.5;
        }
        
        textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
        }
        
        .char-count {
          text-align: right;
          font-size: 0.8rem;
          color: var(--text-color);
          opacity: 0.7;
          margin-top: 5px;
        }
        
        .buttons {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        
        button, .cancel-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .save-btn {
          background-color: var(--primary-color);
          color: white;
        }
        
        .save-btn:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }
        
        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .cancel-btn {
          background-color: #6c757d;
          color: white;
        }
        
        .cancel-btn:hover {
          background-color: #5a6268;
        }
        
        .error-message {
          color: var(--error-color);
          margin-top: 15px;
          padding: 12px;
          background-color: rgba(229, 62, 62, 0.1);
          border-radius: 4px;
          border: 1px solid rgba(229, 62, 62, 0.3);
          font-size: 14px;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: var(--text-color);
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          
          .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .buttons {
            flex-direction: column;
          }
          
          button, .cancel-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default EditPost; 