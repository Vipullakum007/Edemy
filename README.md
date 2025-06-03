# 🎓 Edemy - Full Stack Learning Management System (LMS)

This repository contains the complete codebase for a Full Stack Learning Management System (LMS) application. The system allows **educators** to create and manage courses, while **students** can enroll, track progress, and purchase courses online.

Built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), it integrates **Clerk** for authentication and **Stripe** for secure payments.

---

## 📚 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Deployment](#deployment)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [License](#license)

---

## 📌 Project Overview

This LMS application delivers a complete learning platform with separate interfaces for educators and students. Key functionalities include course creation, content delivery, secure payments, and progress tracking.

---

## ✅ Features

- 🔐 **User Authentication & Authorization**  
  Clerk-based login, registration, and role-based access control (student/educator).

- 📚 **Course Management**  
  Educators can add, edit, and manage courses with pricing, thumbnails, and content structure.

- 🎥 **Rich Content Support**  
  Courses include video lectures and rich-text descriptions.

- 💳 **Payment Integration**  
  Stripe integration for secure course purchasing.

- 📈 **Progress Tracking**  
  Students can enroll, complete lectures, and track their learning journey.

- ⭐ **Course Ratings**  
  Students can rate courses upon completion.

- 📱 **Responsive Design**  
  Optimized UI for desktop, tablet, and mobile.

- ☁️ **Cloud Storage**  
  Course thumbnails are managed via Cloudinary.

---

## 🧰 Technologies Used

### Frontend
- **React.js**
- **Clerk** (Auth UI)
- **Tailwind CSS**
- **Stripe.js**
- **Axios**
- **Vite**
- **React Router**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Clerk Webhooks**
- **Stripe Webhooks**
- **Cloudinary**
- **Multer**
- **Dotenv**
- **CORS**

---

## 🗂️ Project Structure

```

.
├── backend/                # Backend source code (Express, MongoDB)
│   └── README.md
├── frontend/               # Frontend source code (React)
│   └── README.md
├── .gitignore
└── README.md               # This file

````

Each part has its own detailed README:

- [`backend/README.md`](./backend/README.md)
- [`frontend/README.md`](./frontend/README.md)

---

## ⚙️ Setup and Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd <your-repo-name>
````

### 🔧 Backend Setup

```bash
cd backend
# Follow backend/README.md for:
# - Environment variables
# - Installation: npm install
# - Running: npm run server
```

### 🎨 Frontend Setup

```bash
cd frontend
# Follow frontend/README.md for:
# - Environment variables
# - Installation: npm install
# - Running: npm run dev
```

⚠️ Make sure both backend and frontend servers are running concurrently.

---

## ☁️ Deployment

Both parts are configured for **Vercel deployment**:

* 🔙 [Backend Deployment Instructions](./backend/README.md)
* 🔜 [Frontend Deployment Instructions](./frontend/README.md)

---

## 🌐 Live Demo

Access the live app here:
🔗 [https://edemy-frontend-omega.vercel.app](https://edemy-frontend-omega.vercel.app)

---

## 🤝 Contributing

We welcome contributions!

```bash
# Fork the repo
# Create a branch
git checkout -b feature/your-feature

# Make changes
git commit -m "feat: Add your feature"
git push origin feature/your-feature
# Open a pull request
```

See contributing notes in [`backend/README.md`](./backend/README.md) and [`frontend/README.md`](./frontend/README.md).
