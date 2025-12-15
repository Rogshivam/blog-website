# Blog Website Frontend

A modern **React / Next.js (TypeScript)** frontend for a blog platform featuring authentication, user profiles, and social interactions. The project is designed with scalability, clean UI, and secure API communication in mind.

---

## ✨ Features

* **Modern UI/UX** – Clean, responsive interface with dark mode support
* **Authentication** – Secure login & registration using JWT (HTTP-only cookies)
* **User Profiles** – Personal profiles with post management
* **Social Features** – Follow / unfollow users and view public profiles
* **Post Management** – Create, edit, and delete posts with instant UI updates
* **Search** – Search posts and users across the platform
* **Dark Mode** – Persistent light/dark theme toggle
* **Mobile Responsive** – Optimized for all screen sizes

---

## 🛠 Tech Stack

* **Framework**: Next.js (Pages Router) with TypeScript
* **Styling**: CSS-in-JS (styled-jsx) + global CSS
* **State Management**: React Hooks & Context API
* **Authentication**: Custom auth hook with JWT (handled via backend cookies)
* **Routing**: Next.js dynamic routing
* **API Integration**: RESTful backend APIs

---

## 🚀 Setup Instructions

### Option 1: Using Docker (Recommended)

Run containers:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Expected ports:

```text
Frontend (Next.js):  http://localhost:3000
Backend API:        http://localhost:4000
```

Stop containers:

```bash
docker compose down
```

---

### Option 2: Manual Setup

#### 1. Install dependencies

```bash
npm install
```

#### 2. Environment configuration

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

#### 3. Start development server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:3000
```

#### 4. Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure


```text
blog-website
├──backend/
|  ├── src/
|  │   ├── model/              # Database models
|  │   │   ├── user.js
|  │   │   ├── post.js
|  │   │   └── follow.js
|  │   ├── config.js              # App & DB configuration
|  │   ├── app.js               # Express app setup
|  ├── .env
|  ├── Dockerfile
|  ├── package.json
|  ├── package-lock.json
|  frontend/
|  ├── src/
|  │   ├── components/          # Reusable UI components
|  │   │   ├── DarkModeToggle.tsx
|  │   │   ├── LogoutToggle.tsx
|  │   │   ├── LoadingScreen.tsx
|  │   │   └── PostItem.tsx
|  │   ├── hooks/               # Custom React hooks
|  │   │   ├── useAuth.ts       # Authentication logic
|  │   │   ├── useLogout.ts     # Logout handler
|  │   │   └── useDarkMode.ts   # Dark mode hook
|  │   ├── pages/               # Next.js Pages Router
|  │   │   ├── api/             # Optional Next.js API helpers
|  │   │   ├── login.tsx
|  │   │   ├── register.tsx
|  │   │   ├── profile.tsx
|  │   │   ├── public-posts.tsx
|  │   │   ├── follow-page.tsx
|  │   │   ├── edit.tsx
|  │   │   └── 404.tsx
|  │   │   └──_app.tsx
|  │   │   └──_document.tsx
|  │   └── styles/
|  │       └── globals.css
|  ├── public/                  # Static assets
|  ├── package.json
|  ├── dockerfile
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 🔑 Key Components

### Authentication (`useAuth.ts`)

* Maintains authentication state
* Handles login, registration, and logout
* Relies on backend-managed HTTP-only cookies
* Protects private routes via auth checks

### Dark Mode

* System preference detection
* Persistent theme storage
* Smooth theme transitions

### Post Management

* Create, edit, and delete posts
* Input validation & confirmation dialogs
* Instant UI refresh after actions

### User Profiles

* Profile details with statistics
* Follow / unfollow users
* Public post history
* Fully responsive layout

---

## 🔌 API Integration

The frontend communicates with the backend using RESTful APIs:

* **Auth**: `/api/login`, `/api/register`, `/api/logout`
* **Users**: `/api/profile`, `/api/users/:id`
* **Posts**: `/api/posts`, `/api/public-posts`
* **Social**: `/api/toggle-follow/:id`

All requests include:

* Centralized error handling
* Loading states
* Secure cookie-based authentication

---

## 🔐 Security

* JWT stored in **HTTP-only cookies** (backend controlled)
* No sensitive tokens stored in localStorage
* Protected routes with auth guards
* Input validation & sanitization
* Proper CORS handling

---

## 🎨 Styling

* CSS custom properties for theming
* Mobile-first responsive design
* Consistent spacing & typography
* Dark mode support
* Smooth UI transitions

---

## 🧪 Development

### Available Scripts

* `npm run dev` – Start development server
* `npm run build` – Production build
* `npm start` – Start production server
* `npm run lint` – Run ESLint

### Code Quality

* TypeScript for strong typing
* ESLint for linting
* Prettier for formatting
* Component-based architecture

---

## 🚢 Deployment Options

* **Vercel** (Recommended for Next.js)
* **Netlify**
* **AWS Amplify**
* **Docker-based hosting**

---

## 🌍 Browser Support

* Chrome (latest)
* Firefox (latest)
* Safari (latest)
* Edge (latest)
* Mobile browsers

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Add tests if applicable
5. Open a pull request

---

## 📄 License

This project is licensed under the **MIT License**.
