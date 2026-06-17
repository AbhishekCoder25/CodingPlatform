import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveStudentSession } from "../../utils/session";

const initialForm = {
  fullName: "",
  email: ""
};

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function StudentLogin() {
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
      const response = await fetch(`${apiBaseUrl}/users/student-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save student login.");
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: data.message
      });
      saveStudentSession(data.user);

      navigate("/student/dashboard", {
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
    <main className="auth-page student-auth-page">
      <section className="auth-panel student-panel">
        <div className="auth-intro">
          <p className="auth-kicker">Student Access</p>
          <h1>Start solving, shipping, and learning.</h1>
          <p className="auth-copy">
            Enter your name and email to create a student record directly in PostgreSQL.
          </p>
        </div>

        <div className="auth-badge-row">
          <span className="auth-badge">Practice tracks</span>
          <span className="auth-badge">Weekly contests</span>
          <span className="auth-badge">Progress snapshots</span>
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
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <button className="auth-button student-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Enter student dashboard"}
          </button>
        </form>

        {status.message ? (
          <p className={`form-status ${status.type}`}>{status.message}</p>
        ) : null}
      </section>

      <aside className="auth-side student-side">
        <p className="auth-side-label">Student space</p>
        <h2>Build consistency before complexity.</h2>
        <p className="login-copy">
          Track your sessions, keep your practice identity in the database, and move into the
          dashboard with your saved profile.
        </p>
      </aside>
    </main>
  );
}
