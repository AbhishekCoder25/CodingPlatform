import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAdminSession } from "../../utils/session";

const initialForm = {
  fullName: "",
  email: ""
};

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({
    type: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({
      type: "",
      message: ""
    });

    try {
      const response = await fetch(`${apiBaseUrl}/users/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save admin login.");
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: data.message
      });
      saveAdminSession(data.user);

      navigate("/admin/dashboard", {
        state: {
          user: data.user
        }
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page admin-auth-page">
      <aside className="auth-side admin-side">
        <p className="auth-side-label">Control room</p>
        <h2>Review the platform from the operations seat.</h2>
        <p className="login-copy">
          Admin access stores a distinct record in PostgreSQL so your management flow stays
          separate from the student experience.
        </p>
      </aside>

      <section className="auth-panel admin-panel">
        <div className="auth-intro">
          <p className="auth-kicker">Admin Access</p>
          <h1>Configure, review, and steer the platform.</h1>
          <p className="auth-copy">
            Save an admin login directly to PostgreSQL and continue to the admin dashboard.
          </p>
        </div>

        <div className="auth-badge-row">
          <span className="auth-badge">Role oversight</span>
          <span className="auth-badge">User review</span>
          <span className="auth-badge">Platform control</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label className="form-field" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your admin email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <button className="auth-button admin-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Enter admin dashboard"}
          </button>
        </form>

        {status.message ? (
          <p className={`form-status ${status.type}`}>{status.message}</p>
        ) : null}
      </section>
    </main>
  );
}
