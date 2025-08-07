// pages/api/post.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { content } = req.body;
      const BASE_URL = process.env.API_BASE_URL ;

      const backendRes = await fetch(`${process.env.API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: req.headers.cookie || '',
        },
        body: JSON.stringify({ content }),
      });

      const data = await backendRes.json();

      if (!backendRes.ok) {
        return res.status(backendRes.status).json({ error: data.error || 'Failed to create post' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('API /api/post error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
