import React, { useState } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  content: string;
  user: { _id: string; name: string; username?: string };
  createdAt: string;
  likes?: string[];
}

interface Props {
  post: Post;
}

const PostItem: React.FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState(post.likes?.includes('me') || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <Link
          href={post.user ? `/follow-page/${post.user._id}` : '#'}
          className="user-link"
        >
          <strong>{post.user?.name || "Unknown User"}</strong>
          {post.user?.username && (
            <span className="username">@{post.user.username}</span>
          )}
        </Link>

        <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-footer">
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={handleToggleLike}
        >
          {liked ? '💔 Unlike' : '❤️ Like'}
        </button>
        <span className="like-count">{likeCount} Likes</span>
      </div>
    </div>
  );
};

export default PostItem;
