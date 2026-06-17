import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const initialProblemForm = {
  title: "",
  difficulty: "easy",
  statement: ""
};

export default function AdminProblemCreate() {
  const navigate = useNavigate();
  const [problemForm, setProblemForm] = useState(initialProblemForm);
  const [status, setStatus] = useState({
    message: "",
    error: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setProblemForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({
      message: "",
      error: ""
    });

    try {
      const response = await fetch(`${apiBaseUrl}/problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(problemForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add coding question.");
      }

      setStatus({
        message: data.message,
        error: ""
      });
      setProblemForm(initialProblemForm);

      navigate("/admin/problems", {
        state: {
          createdProblem: data.problem
        }
      });
    } catch (error) {
      setStatus({
        message: "",
        error: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="detail-page admin-detail-page">
      <section className="detail-card admin-detail-card">
        <div className="list-header">
          <div>
            <p className="auth-kicker">Admin Question Creator</p>
            <h1>Add a new coding question.</h1>
            <p className="detail-copy">
              Fill in the title, difficulty, and statement. After saving, the question list will
              open automatically.
            </p>
          </div>
        </div>

        <form className="auth-form admin-problem-form" onSubmit={handleSubmit}>
          <label className="form-field" htmlFor="title">
            Question title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter the coding question title"
            value={problemForm.title}
            onChange={handleChange}
            required
          />

          <label className="form-field" htmlFor="difficulty">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={problemForm.difficulty}
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
            placeholder="Describe the problem for students"
            value={problemForm.statement}
            onChange={handleChange}
            rows="6"
            required
          />

          <button className="auth-button admin-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add coding question"}
          </button>
        </form>

        {status.message ? <p className="form-status success">{status.message}</p> : null}
        {status.error ? <p className="form-status error">{status.error}</p> : null}

        <div className="detail-actions">
          <Link className="auth-button admin-button detail-link" to="/admin/problems">
            View question list
          </Link>
          <Link className="auth-button ghost-button detail-link" to="/admin/dashboard">
            Back to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
