import { useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://teamflow-task-manager-production-65e8.up.railway.app";

export default function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const signup = async () => {
    try {
      await axios.post(`${API}/api/auth/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "admin",
      });
      alert("Signup successful. Please login.");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const createProject = async () => {
    try {
      const res = await axios.post(
        `${API}/api/projects`,
        {
          name: `Project ${projects.length + 1}`,
          description: "Team collaboration project",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([...projects, res.data]);
    } catch {
      alert("Create project failed");
    }
  };

  const createTask = async () => {
    if (projects.length === 0) return alert("Create a project first");

    try {
      const res = await axios.post(
        `${API}/api/tasks`,
        {
          title: `Task ${tasks.length + 1}`,
          description: "Assigned team task",
          project: projects[0]._id,
          dueDate: "2026-06-01",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
    } catch {
      alert("Create task failed");
    }
  };

  const completed = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.length - completed;

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="logo">TF</div>
          <h1>TeamFlow</h1>
          <p className="subtitle">Role-based project and task management app</p>

          <div className="tabs">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Login
            </button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
              Signup
            </button>
          </div>

          {mode === "signup" && (
            <input name="name" placeholder="Full name" onChange={handleChange} />
          )}

          <input name="email" placeholder="Email address" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />

          <button className="primary-btn" onClick={mode === "login" ? login : signup}>
            {mode === "login" ? "Login to Dashboard" : "Create Account"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo small">TF</div>
          <h2>TeamFlow</h2>
        </div>

        <nav>
          <span className="nav-active">Dashboard</span>
          <span>Projects</span>
          <span>Tasks</span>
          <span>Team</span>
        </nav>

        <button className="logout" onClick={() => setToken("")}>Logout</button>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name || "Admin"}.</p>
          </div>
          <div className="role-pill">{user?.role || "admin"}</div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <p>Total Projects</p>
            <h2>{projects.length}</h2>
          </div>
          <div className="stat-card">
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
          </div>
          <div className="stat-card">
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>
          <div className="stat-card">
            <p>Completed</p>
            <h2>{completed}</h2>
          </div>
        </section>

        <section className="actions">
          <button onClick={createProject}>+ Create Project</button>
          <button onClick={createTask}>+ Create Task</button>
        </section>

        <section className="grid">
          <div className="panel">
            <h3>Projects</h3>
            {projects.length === 0 ? (
              <p className="empty">No projects yet. Create one to begin.</p>
            ) : (
              projects.map((p) => (
                <div className="list-item" key={p._id}>
                  <div>
                    <strong>{p.name}</strong>
                    <p>{p.description}</p>
                  </div>
                  <span className="tag">Active</span>
                </div>
              ))
            )}
          </div>

          <div className="panel">
            <h3>Tasks</h3>
            {tasks.length === 0 ? (
              <p className="empty">No tasks yet. Create a task after creating a project.</p>
            ) : (
              tasks.map((t) => (
                <div className="list-item" key={t._id}>
                  <div>
                    <strong>{t.title}</strong>
                    <p>{t.description}</p>
                  </div>
                  <span className="tag todo">{t.status}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}