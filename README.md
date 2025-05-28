# Blog Website

A full-stack blog platform built with Node.js, Express.js, EJS, and MongoDB. This application allows users to create, read, update, and delete blog posts in a clean, responsive interface.

🔗 **Live Demo**: [https://blog-website-pga1.onrender.com](https://blog-website-pga1.onrender.com)

---

## 🚀 Features

- 📝 Create and manage blog posts
- 🔍 View all posts on the homepage
- 🖼️ Dynamic rendering with EJS templates
- 🗃️ MongoDB for data persistence
- 🧩 Modular architecture with MVC pattern
- 🌐 Responsive design for all devices

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, HTML, CSS, JavaScript
- **Database**: MongoDB
- **Templating**: EJS
- **Hosting**: Render

---

## 📂 Project Structure

```structure
blog_website/
├── model/ # Mongoose schemas
├── public/ # Static assets (CSS, JS)
├── views/ # EJS templates
├── app.js # Main server file
├── config.js # Configuration settings
├── package.json # Project metadata and dependencies


```

---

## 🧑‍💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Installation

1. **Clone the repository:**
  ```bash
   
   git clone https://github.com/Rogshivam/blog_website.git
   cd blog_website
  ```
2. **Install dependencies:**

  ```bash
  
  npm install
  ```
3. **Configure environment variables:**

Create a .env file in the root directory and add your MongoDB URI:

  ```env
  
  MONGODB_URI=your_mongodb_connection_string
  ```
4. **Start the server:**

  ```bash
  
  node app.js
  ```
The application will be running at http://localhost:3000.

📸 Screenshots

Homepage displaying all blog posts.
![ Screenshot](https://res.cloudinary.com/dn0bmsj49/image/upload/v1746998202/bszpuuqoyc1db2lshwl9.png)

Form to create a new blog post.
![ Screenshot](https://res.cloudinary.com/dn0bmsj49/image/upload/v1748438672/otqnbvnydpgihvnzjmiw.png)
## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License
This project is licensed under the MIT License.
