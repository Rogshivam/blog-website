# Blog Website Frontend

A modern React/Next.js frontend for the blog website with authentication, user profiles, and social features.

## Features

- **Modern UI/UX**: Clean, responsive design with dark mode support
- **Authentication**: Secure login/register with JWT token management
- **User Profiles**: Personal profile pages with post management
- **Social Features**: Follow/unfollow users, view user profiles
- **Post Management**: Create, edit, delete posts with real-time updates
- **Search**: Search posts and users across the platform
- **Dark Mode**: Toggle between light and dark themes
- **Mobile Responsive**: Optimized for all device sizes

## Tech Stack

- **Framework**: Next.js with TypeScript
- **Styling**: CSS-in-JS with styled-jsx
- **State Management**: React hooks and context
- **Authentication**: Custom auth hook with JWT
- **Routing**: Next.js routing with dynamic routes
- **API**: RESTful API integration with backend

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be running at http://localhost:3000

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── DarkModeToggle.tsx
│   │   ├── LogoutToggle.tsx
|   |   ├──LoadingScreen.jsx
│   │   └── PostItem.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
|   |   ├── LogoutToggle.ts  #Logout hook
│   │   └── useDarkMode.ts  # Dark mode hook
│   ├── pages/              # Next.js pages
│   │   ├── api/           # API routes
│   │   ├── login.tsx      # Login page
│   │   ├── register.tsx   # Registration page
│   │   ├── 404.tsx
│   │   ├── profile.tsx    # User profile page
│   │   ├── public-posts.tsx # Public posts feed
│   │   ├── follow-page.tsx  # User profile view
│   │   └── edit.tsx       # Post edit page
│   └── styles/            # Global styles
│       └── globals.css
├── public/                # Static assets
└── package.json
```

## Key Components

### Authentication Hook (`useAuth.ts`)
- Manages user authentication state
- Handles login, logout, and registration
- Token management and refresh
- Automatic redirects for authenticated users

### Dark Mode Toggle
- Persistent theme preference
- Smooth transitions between themes
- CSS custom properties for theming

### Post Management
- Create new posts with character limits
- Edit existing posts with validation
- Delete posts with confirmation
- Real-time updates

### User Profiles
- Personal profile with stats
- Follow/unfollow functionality
- User post history
- Responsive design

## API Integration

The frontend communicates with the backend through RESTful APIs:

- **Authentication**: `/api/login`, `/api/register`, `/api/logout`
- **User Management**: `/api/profile`, `/api/users/:id`
- **Posts**: `/api/posts`, `/api/public-posts`
- **Social**: `/api/toggle-follow/:id`

All API calls include proper error handling and loading states.

## Security Features

- JWT token management with automatic refresh
- HTTP-only cookies for secure token storage
- Input validation and sanitization
- Protected routes with authentication checks
- CORS handling for cross-origin requests

## Styling

- CSS custom properties for theming
- Responsive design with mobile-first approach
- Smooth transitions and animations
- Consistent design system
- Dark mode support

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture

## Deployment

The frontend can be deployed to various platforms:

- **Vercel**: Optimized for Next.js
- **Netlify**: Static site hosting
- **AWS Amplify**: Full-stack hosting
- **Docker**: Containerized deployment

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
