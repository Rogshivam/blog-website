import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DarkModeToggle from '../components/DarkModeToggle';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/profile');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isAuthenticated) {
    return <div className="loading">Redirecting...</div>;
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        <div className="header">
          <h2>Login</h2>
          <DarkModeToggle />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="register-link">
          <p>Don't have an account? <Link href="/register">Register here</Link></p>
        </div>
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
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          transition: background-color 0.3s, color 0.3s;
        }

        .container {
          background-color: var(--container-bg);
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        h2 {
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
          color: var(--text-color);
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--input-border);
          border-radius: 4px;
          box-sizing: border-box;
          background-color: var(--container-bg);
          color: var(--text-color);
          font-size: 14px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
        }

        input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn {
          width: 100%;
          padding: 12px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: var(--error-color);
          margin-bottom: 15px;
          padding: 10px;
          background-color: rgba(229, 62, 62, 0.1);
          border-radius: 4px;
          border: 1px solid rgba(229, 62, 62, 0.3);
          font-size: 14px;
        }

        .register-link {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--input-border);
        }

        .register-link p {
          margin: 0;
          color: var(--text-color);
        }

        a {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
        }

        a:hover {
          text-decoration: underline;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: var(--text-color);
        }

        @media (max-width: 480px) {
          .container {
            padding: 20px;
            margin: 10px;
          }
          
          .header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default Login; 