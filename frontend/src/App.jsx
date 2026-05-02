import { useState, useCallback } from "react";
import "./App.css";

const COLS = [
  { id: "backlog", title: "Backlog", color: "#888780" },
  { id: "inprogress", title: "In Progress", color: "#534AB7" },
  { id: "review", title: "Review", color: "#BA7517" },
  { id: "done", title: "Done", color: "#1D9E75" },
];

const INITIAL_TASKS = [
  { id: 1, title: "Design new onboarding flow", col: 0, priority: "high", date: "May 02" },
  { id: 2, title: "Fix login redirect bug", col: 0, priority: "medium", date: "May 03" },
  { id: 3, title: "Update API documentation", col: 1, priority: "low", date: "May 04" },
  { id: 4, title: "Implement search feature", col: 1, priority: "high", date: "May 05" },
  { id: 5, title: "Write unit tests for auth module", col: 2, priority: "medium", date: "May 06" },
  { id: 6, title: "Deploy v2.1 to staging", col: 3, priority: "low", date: "Apr 30" },
];

function today() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">
            <span className="logo-dot" />
            <span className="logo-dot sm" />
            <span className="logo-dot" />
          </div>
          <span className="logo-name">TeamFlow</span>
        </div>
        <p className="login-sub">Sign in to your workspace</p>
        <label className="tf-label">Email</label>
        <input className="tf-input" type="email" defaultValue="demo@teamflow.app" placeholder="you@company.com" />
        <label className="tf-label">Password</label>
        <input className="tf-input" type="password" defaultValue="password" placeholder="••••••••" onKeyDown={e => e.key === "Enter" && onLogin()} />
        <button className="tf-btn-primary" onClick={onLogin}>Sign in</button>
        <p className="login-hint">Use any credentials — this is a demo</p>
      </div>
    </div>
  );
}

// ─── Task Card ───────────────────────────────────────────────────────────────
function TaskCard({ task, onDelete, onEdit, onDragStart, onDragEnd }) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(task.title);

  const commitEdit = () => {
    const v = editVal.trim();
    if (v) onEdit(task.id, v);
    setEditing(false);
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
    >
      <div className="card-top">
        {editing ? (
          <textarea
            className="card-edit-input"
            rows={2}
            value={editVal}
            autoFocus
            onChange={e => setEditVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitEdit(); }
              if (e.key === "Escape") { setEditVal(task.title); setEditing(false); }
            }}
          />
        ) : (
          <div className="card-title">{task.title}</div>
        )}
        {!editing && (
          <div className="card-menu">
            <button className="card-action" title="Edit" onClick={() => setEditing(true)}>✎</button>
            <button className="card-action del" title="Delete" onClick={() => onDelete(task.id)}>✕</button>
          </div>
        )}
      </div>
      {!editing && (
        <div className="card-footer">
          <span className={`priority-tag p-${task.priority}`}>{task.priority}</span>
          <span className="card-date">{task.date}</span>
        </div>
      )}
    </div>
  );
}

// ─── Kanban Column ───────────────────────────────────────────────────────────
function KanbanColumn({ col, colIndex, tasks, onDelete, onEdit, onDragStart, onDragEnd, onDrop, onQuickAdd }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`column${dragOver ? " drag-over" : ""}`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => { setDragOver(false); onDrop(colIndex); }}
    >
      <div className="col-head">
        <div className="col-title-row">
          <span className="col-indicator" style={{ background: col.color }} />
          <span className="col-title">{col.title}</span>
        </div>
        <div className="col-head-right">
          <span className="col-count">{tasks.length}</span>
          <button className="col-add-btn" onClick={() => onQuickAdd(colIndex)} title={`Add to ${col.title}`}>+</button>
        </div>
      </div>
      <div className="cards-list">
        {tasks.length === 0 && <div className="empty-col">Drop tasks here</div>}
        {tasks.map(t => (
          <TaskCard
            key={t.id}
            task={t}
            onDelete={onDelete}
            onEdit={onEdit}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [nextId, setNextId] = useState(INITIAL_TASKS.length + 1);
  const [taskInput, setTaskInput] = useState("");
  const [colTarget, setColTarget] = useState(0);
  const [priority, setPriority] = useState("medium");
  const [dragId, setDragId] = useState(null);

  const total = tasks.length;
  const done = tasks.filter(t => t.col === 3).length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const active = tasks.filter(t => t.col !== 3).length;

  const addTask = useCallback(() => {
    const title = taskInput.trim();
    if (!title) return;
    setTasks(prev => [...prev, { id: nextId, title, col: colTarget, priority, date: today() }]);
    setNextId(n => n + 1);
    setTaskInput("");
  }, [taskInput, colTarget, priority, nextId]);

  const deleteTask = useCallback(id => setTasks(prev => prev.filter(t => t.id !== id)), []);

  const editTask = useCallback((id, title) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title } : t));
  }, []);

  const dropTask = useCallback(colIndex => {
    if (dragId === null) return;
    setTasks(prev => prev.map(t => t.id === dragId ? { ...t, col: colIndex } : t));
    setDragId(null);
  }, [dragId]);

  return (
    <div className="board-app">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            <span className="logo-dot" />
            <span className="logo-dot sm" />
          </div>
          <span className="topbar-title">TeamFlow</span>
          <span className="topbar-badge">Product Roadmap</span>
        </div>
        <div className="topbar-right">
          <div className="avatar" title="demo@teamflow.app">D</div>
          <button className="logout-btn" onClick={onLogout}>Sign out</button>
        </div>
      </div>

      <div className="app-body">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Workspace</div>
            <div className="sidebar-item active">
              <span className="dot" style={{ background: "#534AB7" }} />
              Board
            </div>
            <div className="sidebar-item">
              <span className="dot" style={{ background: "#1D9E75" }} />
              My Tasks
              <span className="sidebar-badge">{active}</span>
            </div>
            <div className="sidebar-item">
              <span className="dot" style={{ background: "#D85A30" }} />
              Calendar
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">Stats</div>
            <div className="sidebar-stats">
              <div className="stat-label">Total tasks</div>
              <div className="stat-number">{total}</div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="stat-label">{done} done</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="main-header">
            <div>
              <h1>Project Board</h1>
              <p className="main-sub">Drag cards between columns to update status</p>
            </div>
          </div>

          <div className="add-bar">
            <input
              className="add-input"
              type="text"
              placeholder="Add a new task..."
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
            />
            <select className="col-select" value={colTarget} onChange={e => setColTarget(Number(e.target.value))}>
              {COLS.map((c, i) => <option key={c.id} value={i}>{c.title}</option>)}
            </select>
            <select className="col-select" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button className="add-btn" onClick={addTask}>+ Add</button>
          </div>

          <div className="kanban">
            {COLS.map((col, ci) => (
              <KanbanColumn
                key={col.id}
                col={col}
                colIndex={ci}
                tasks={tasks.filter(t => t.col === ci)}
                onDelete={deleteTask}
                onEdit={editTask}
                onDragStart={id => setDragId(id)}
                onDragEnd={() => {}}
                onDrop={dropTask}
                onQuickAdd={i => setColTarget(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn
    ? <Dashboard onLogout={() => setLoggedIn(false)} />
    : <LoginScreen onLogin={() => setLoggedIn(true)} />;
}