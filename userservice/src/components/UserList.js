import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './UserList.css';

export default function UserList({ users = [], onEdit, onDelete }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) =>
      [
        String(u.userId ?? ''),
        u.username ?? '',
        u.email ?? '',
        u.fullName ?? '',
        u.phone ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [users, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const display = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handlePage = (n) => {
    setPage(Math.max(1, Math.min(totalPages, n)));
  };

  return (
    <div className="user-list card">
      <div className="user-list-header">
        <h2>Users</h2>
        <div className="controls">
          <input
            className="search"
            placeholder="Search by username, email, name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <label>
            <span>Per page</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </label>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {display.map((u) => (
            <tr key={u.userId}>
              <td>{u.userId}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.fullName}</td>
              <td>{u.dob}</td>
              <td>{u.phone}</td>
              <td>{u.address}</td>
              <td>
                <button className="btn edit" onClick={() => onEdit(u)}>
                  Edit
                </button>
                <button className="btn delete" onClick={() => onDelete(u.userId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {display.length === 0 && (
            <tr className="empty-row">
              <td colSpan="8">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="list-footer">
        <div>
          Showing <strong>{display.length}</strong> of <strong>{total}</strong>
        </div>
        <div className="pager">
          <button onClick={() => handlePage(1)} disabled={page <= 1}>
            «
          </button>
          <button onClick={() => handlePage(page - 1)} disabled={page <= 1}>
            ‹
          </button>
          <span>
            {page}/{totalPages}
          </span>
          <button onClick={() => handlePage(page + 1)} disabled={page >= totalPages}>
            ›
          </button>
          <button onClick={() => handlePage(totalPages)} disabled={page >= totalPages}>
            »
          </button>
        </div>
      </div>
    </div>
  );
}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
