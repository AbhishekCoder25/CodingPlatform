import { Link } from "react-router-dom";

const languages = [
  {
    name: "C++",
    summary: "Fast problem-solving for contests, data structures, and systems thinking."
  },
  {
    name: "Java",
    summary: "Reliable object-oriented workflows for structured coding rounds and backend logic."
  },
  {
    name: "Python",
    summary: "Readable syntax for algorithms, automation, and rapid experimentation."
  },
  {
    name: "JavaScript",
    summary: "Full-stack practice from logic building to interactive frontend projects."
  }
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-shell">
        <div className="landing-hero">
          <p className="landing-kicker">Coding Platform</p>
          <h1>Practice coding, manage problems, and move faster from one clean home page.</h1>
          <p className="landing-copy">
            Choose whether you are a student or admin, then jump directly into the right workflow.
            Students can explore problems and practice consistently, while admins can curate the
            problem bank and guide the platform.
          </p>

          <div className="landing-actions">
            <Link className="landing-role-card student-role-card" to="/student/login">
              <span className="landing-role-label">Student</span>
              <strong>Open student login</strong>
              <p>Practice questions, open problem details, and build regular coding habits.</p>
            </Link>

            <Link className="landing-role-card admin-role-card" to="/admin/login">
              <span className="landing-role-label">Admin</span>
              <strong>Open admin login</strong>
              <p>Add coding questions, review the problem bank, and manage platform flow.</p>
            </Link>
          </div>
        </div>

        <section className="language-panel">
          <div className="language-panel-header">
            <p className="landing-kicker">Languages</p>
            <h2>Core tracks available on the platform</h2>
          </div>

          <div className="language-grid">
            {languages.map((language) => (
              <article className="language-card" key={language.name}>
                <h3>{language.name}</h3>
                <p>{language.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
