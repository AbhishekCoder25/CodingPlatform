import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminProblemDetails() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [status, setStatus] = useState({
    loading: true,
    error: ""
  });
  const [form, setForm] = useState({
    title: "",
    difficulty: "easy",
    statement: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProblem() {
      try {
        const response = await fetch(`${apiBaseUrl}/problems/${problemId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load coding question.");
        }

        if (isMounted) {
          setProblem(data);
          setForm({
            title: data.title,
            difficulty: data.difficulty,
            statement: data.statement
          });
          setStatus({
            loading: false,
            error: ""
          });
        }
      } catch (error) {
        if (isMounted) {
          setStatus({
            loading: false,
            error: error.message
          });
        }
      }
    }

    loadProblem();

    return () => {
      isMounted = false;
    };
  }, [problemId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setIsSaving(true);
    setActionMessage("");
    setStatus((currentStatus) => ({
      ...currentStatus,
      error: ""
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/problems/${problemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update coding question.");
      }

      setProblem(data.problem);
      setForm({
        title: data.problem.title,
        difficulty: data.problem.difficulty,
        statement: data.problem.statement
      });
      setIsEditing(false);
      setActionMessage(data.message);
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: error.message
      }));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this coding question permanently?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setActionMessage("");
    setStatus((currentStatus) => ({
      ...currentStatus,
      error: ""
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/problems/${problemId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete coding question.");
      }

      navigate("/admin/problems");
    } catch (error) {
      setStatus((currentStatus) => ({
        ...currentStatus,
        error: error.message
      }));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="detail-page admin-detail-page">
      <section className="detail-card admin-detail-card">
        <p className="auth-kicker">Admin Question View</p>
        {status.loading ? <h1>Loading question...</h1> : null}
        {status.error ? <p className="form-status error">{status.error}</p> : null}

        {problem ? (
          <>
            {!isEditing ? (
              <>
                <div className="detail-hero">
                  <span className={`difficulty-pill ${problem.difficulty}`}>{problem.difficulty}</span>
                  <span className="question-meta">
                    Added {new Date(problem.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h1>{problem.title}</h1>
                <p className="detail-copy">
                  Review how students will see this prompt and confirm the question quality before
                  sharing more tasks.
                </p>

                <div className="detail-grid">
                  <article className="detail-block">
                    <h2>Problem Statement</h2>
                    <p>{problem.statement}</p>
                  </article>

                  <article className="detail-block">
                    <h2>Admin Notes</h2>
                    <ul className="detail-list">
                      <li>Difficulty is currently set to {problem.difficulty}.</li>
                      <li>Use concise, unambiguous prompts for better submissions.</li>
                      <li>Open the dashboard again to add more questions.</li>
                    </ul>
                  </article>
                </div>
              </>
            ) : (
              <form className="auth-form edit-problem-form" onSubmit={handleUpdate}>
                <label className="form-field" htmlFor="title">
                  Question title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  required
                />

                <label className="form-field" htmlFor="difficulty">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <label className="form-field" htmlFor="statement">
                  Problem statement
                </label>
                <textarea
                  id="statement"
                  name="statement"
                  rows="7"
                  value={form.statement}
                  onChange={handleChange}
                  required
                />

                <div className="detail-actions">
                  <button className="auth-button admin-button detail-link" type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    className="auth-button ghost-button detail-link"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setForm({
                        title: problem.title,
                        difficulty: problem.difficulty,
                        statement: problem.statement
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        ) : null}

        {actionMessage ? <p className="form-status success">{actionMessage}</p> : null}

        <div className="detail-actions">
          {problem && !isEditing ? (
            <>
              <button
                className="auth-button admin-button detail-link"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit question
              </button>
              <button
                className="auth-button danger-button detail-link"
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete question"}
              </button>
            </>
          ) : null}
          <Link className="auth-button admin-button detail-link" to="/admin/problems">
            Back to question list
          </Link>
          <Link className="auth-button ghost-button detail-link" to="/admin/dashboard">
            Back to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
