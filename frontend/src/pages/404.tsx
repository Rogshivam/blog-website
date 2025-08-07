import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div style={styles.container}>
        <h1 style={styles.title}>404</h1>
        <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <Link href="/" style={styles.link}>Go back home</Link>
      </div>
    </>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center' as const,
    backgroundColor: '#ddddd',
    color: '#111',
    padding: '2rem',
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold' as const,
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
  },
  link: {
    fontSize: '1.2rem',
    color: '#11111',
    textDecoration: 'underline',
  }
};
