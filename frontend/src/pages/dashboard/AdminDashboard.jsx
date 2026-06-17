import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const location = useLocation();
  const user = location.state?.user;
  const [problems, setProblems] = useState([]);
  const [problemStatus, setProblemStatus] = useState({
    loading: true,
    error: ""
  });

  useEffect(() => {
    loadProblems();
  }, []);

  async function loadProblems() {
    try {
      const response = await fetch(`${apiBaseUrl}/problems`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load coding questions.");
      }

      setProblems(data);
      setProblemStatus(() => ({
        loading: false,
        error: ""
      }));
    } catch (error) {
      setProblemStatus(() => ({
        loading: false,
        error: error.message
      }));
    }
  }

  return (
    <main className="dashboard-page admin-dashboard-page">
      <section className="dashboard-card admin-dashboard-card">
        <p className="auth-kicker">Admin Dashboard</p>
        <h1>{user ? `Welcome, ${user.full_name}.` : "Admin dashboard is ready."}</h1>
        <p className="dashboard-copy">
          {user
            ? `Your admin record has been saved for ${user.email}.`
            : "Open the admin login page to create or update an admin record."}
        </p>

        <div className="dashboard-stats">
          <article>
            <span>Role</span>
            <strong>{user?.role || "admin"}</strong>
          </article>
          <article>
            <span>Mode</span>
            <strong>Oversight</strong>
          </article>
          <article>
            <span>Access</span>
            <strong>System controls</strong>
          </article>
        </div>

        <section className="question-panel">
          <div className="question-panel-header">
            <div>
              <p className="auth-kicker">Question Manager</p>
              <h2>Manage the problem bank</h2>
            </div>
            <span className="question-count">{problems.length} total</span>
          </div>
          <p className="dashboard-copy">
            Open the add-question page to create a new coding problem, or open the list page to
            inspect existing questions one by one.
          </p>

          <div className="panel-action-row">
            <Link className="auth-button admin-button panel-action-button" to="/admin/problems/new">
              Add question
            </Link>
            <Link className="auth-button admin-button panel-action-button" to="/admin/problems">
              View question list
            </Link>
          </div>

          {problemStatus.error ? <p className="form-status error">{problemStatus.error}</p> : null}
          {problemStatus.loading ? <p className="dashboard-copy">Loading coding questions...</p> : null}
        </section>

        <div className="dashboard-actions">
          <Link className="auth-button admin-button dashboard-link" to="/admin/login">
            Back to admin login
          </Link>
        </div>
      </section>
    </main>
  );
}
