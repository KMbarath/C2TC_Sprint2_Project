import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './UserForm.css';

export default function UserForm({ onCreate, onUpdate, editingUser, cancelEdit }) {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (editingUser) {
      setUserId(editingUser.userId ?? '');
      setUsername(editingUser.username ?? '');
      setEmail(editingUser.email ?? '');
      setPassword(editingUser.password ?? '');
      setFullName(editingUser.fullName ?? '');
      setDob(editingUser.dob ?? '');
      setPhone(editingUser.phone ?? '');
      setAddress(editingUser.address ?? '');
      setFormError(null);
    } else {
      resetForm();
    }
  }, [editingUser]);

  const resetForm = () => {
    setUserId('');
    setUsername('');
    setEmail('');
    setPassword('');
    setFullName('');
    setDob('');
    setPhone('');
    setAddress('');
    setFormError(null);
  };

  const validate = () => {
    if (!username.trim()) return 'Username is required';
    if (!email.trim()) return 'Email is required';
    // basic email pattern
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email.trim())) return 'Enter a valid email address';
    if (!editingUser && !password.trim()) return 'Password is required';
    if (!editingUser && password.trim().length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const v = validate();
    if (v) {
      setFormError(v);
      return;
    }

    const payload = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      fullName: fullName.trim() || "",
      dob: dob || "",
      phone: phone.trim() || "",
      address: address.trim() || "",
    };
    
    // Only include userId for updates (omit for new users)
    if (editingUser && editingUser.userId) {
      payload.userId = editingUser.userId;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        await onUpdate(editingUser.userId, payload);
      } else {
        await onCreate(payload);
        resetForm();
      }
    } catch (err) {
      console.error('Save failed', err);
      // Show a concise error message (first line / 300 chars)
      const raw = err?.message || 'Failed to save user';
      const short = String(raw).split(/\n|\\r\\n/)[0].slice(0, 300);
      setFormError(short);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-form card">
      <h2>{editingUser ? 'Edit User' : 'New User'}</h2>
      <form onSubmit={handleSubmit}>
        {editingUser && (
          <label>
            User ID
            <input
              type="number"
              value={userId}
              readOnly
              placeholder="Auto-generated"
            />
          </label>
        )}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Full Name
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </label>

        <label>
          Phone
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        {formError && (
          <div className="form-error" role="alert">
            <button className="close" aria-label="Close error" onClick={() => setFormError(null)}>×</button>
            {formError}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {editingUser ? (submitting ? 'Updating…' : 'Update User') : (submitting ? 'Creating…' : 'Create User')}
          </button>
          {editingUser ? (
            <button type="button" className="secondary" onClick={cancelEdit} disabled={submitting}>
              Cancel
            </button>
          ) : (
            <button type="button" className="secondary" onClick={resetForm} disabled={submitting}>
              Reset
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

UserForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  editingUser: PropTypes.object,
  cancelEdit: PropTypes.func.isRequired,
};
