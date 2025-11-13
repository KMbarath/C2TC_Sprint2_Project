import React, { useEffect, useState } from "react";
import { apiFetch } from "./api";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (user) => {
    await apiFetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    await fetchUsers();
  };

  const handleUpdate = async (id, user) => {
    await apiFetch(`/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    setEditingUser(null);
    await fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await apiFetch(`/${id}`, { method: "DELETE" });
    await fetchUsers();
  };

  return (
    <div className="app">
      <header>
        <h1>User Management</h1>
      </header>

      <main className="main-container">
        <section className="form-section">
          <UserForm
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            editingUser={editingUser}
            cancelEdit={() => setEditingUser(null)}
          />
        </section>

        <section className="list-section">
          {loading && <div role="status">Loading users…</div>}
          {error && <div className="error">{error}</div>}
          <UserList
            users={users}
            onEdit={(user) => setEditingUser(user)}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer>
        <small>Frontend for User Service</small>
      </footer>
    </div>
  );
}

export default App;
