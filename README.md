# Blog Website - Next.js + Express API

A modern blog website built with Next.js frontend and Express.js backend API.

## Project Structure

```
blog_website/
├── frontend/          # Next.js React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Next.js pages
│   │   └── styles/        # Global styles
├── backend/           # Express.js API server
│   ├── model/         # MongoDB models
│   ├── public/        # Static files
│   └── views/         # Legacy EJS views (not used)
└── README.md
```

## Features

- **User Authentication**: Login/Register with JWT tokens
- **Blog Posts**: Create, edit, and view posts
- **User Profiles**: View user profiles and posts
- **Follow System**: Follow/unfollow other users
- **Search**: Search posts and users
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Frontend
- **Next.js 14**: React framework with TypeScript
- **React Hooks**: Custom hooks for dark mode and data fetching
- **CSS-in-JS**: Styled components with global CSS variables

### Backend
- **Express.js**: RESTful API server
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication with cookies
- **bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog_website
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blog_website
   JWT_SECRET=your_jwt_secret_key_here
   PORT=3001
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Run the application**
   
   In one terminal (backend):
   ```bash
   cd backend
   npm start
   ```
   
   In another terminal (frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout

### User Management
- `GET /api/profile` - Get current user profile
- `GET /api/users/:id` - Get user profile by ID
- `POST /api/toggle-follow/:id` - Follow/unfollow user

### Posts
- `GET /api/public-posts` - Get all public posts
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post

## Migration from Express to Next.js

This project was migrated from a traditional Express.js application with EJS templates to a modern Next.js frontend with a separate Express.js API backend.

### Key Changes

1. **Frontend Migration**
   - Converted EJS templates to React components
   - Implemented client-side routing with Next.js
   - Added TypeScript for better type safety
   - Created reusable components and hooks

2. **Backend Changes**
   - Removed EJS rendering
   - Converted all routes to API endpoints
   - Added CORS support for frontend communication
   - Implemented proper JSON responses

3. **Dark Mode**
   - Created React hook for dark mode functionality
   - Replaced vanilla JS with React state management
   - Added global CSS variables for theming

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev  # if nodemon is configured
# or
npm start
```

### Database
The application uses MongoDB. Make sure MongoDB is running and accessible at the URI specified in your `.env` file.

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy to your preferred platform
3. Update frontend API URLs to production backend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
