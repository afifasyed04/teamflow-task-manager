TeamFlow – Role-Based Task Management System

--------------------------------------------------

OVERVIEW
TeamFlow is a full-stack project and task management application that allows users to create, assign, and track tasks using a Kanban-style dashboard. It includes authentication, project handling, and role-based access control.

--------------------------------------------------

FEATURES

Authentication
- User Signup and Login (JWT-based)
- Secure password handling
- Role-based access (Admin/User)

Project Management
- Create projects
- Assign projects
- View projects

Task Management
- Create tasks
- Assign tasks
- Track status (Backlog, To Do, Done)

Dashboard
- Kanban-style layout
- Tasks grouped by status
- Interactive UI

--------------------------------------------------

TECH STACK

Frontend
- React (Vite)
- Axios
- CSS

Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

Deployment
- Backend: Railway
- Frontend: Railway / Vercel
- Database: MongoDB Atlas

--------------------------------------------------

PROJECT STRUCTURE

teamflow/
  backend/
    models/
    routes/
    middleware/
    server.js
    package.json

  frontend/
    src/
      App.jsx
      App.css
      main.jsx
    package.json

--------------------------------------------------

SETUP INSTRUCTIONS

1. Clone Repository
git clone https://github.com/your-username/teamflow-task-manager.git
cd teamflow-task-manager

2. Backend Setup
cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

Run backend:
npm start

3. Frontend Setup
cd frontend
npm install
npm run dev

--------------------------------------------------

API ENDPOINTS

Auth
POST /api/auth/signup
POST /api/auth/login

Projects
GET /api/projects
POST /api/projects

Tasks
GET /api/tasks
POST /api/tasks

Dashboard
GET /api/dashboard

--------------------------------------------------

DEPLOYMENT

Backend (Railway)
- Uses environment variables:
  MONGO_URI
  JWT_SECRET

Frontend
- Built using Vite
- Connected to backend API

--------------------------------------------------

LIVE LINKS

Frontend: https://your-frontend-link
Backend: https://your-backend-link

--------------------------------------------------

DEMO VIDEO

(Add your video link here)

--------------------------------------------------

FUTURE IMPROVEMENTS

- Drag and drop Kanban board
- Notifications
- Real-time updates
- File uploads
- Team collaboration

--------------------------------------------------

AUTHOR

Afifa Syed

--------------------------------------------------
