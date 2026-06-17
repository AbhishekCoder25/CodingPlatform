CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  role VARCHAR(30) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(180) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(180) NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  statement TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  language VARCHAR(30) NOT NULL CHECK (language IN ('cpp', 'java', 'python', 'javascript')),
  source_code TEXT NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('accepted', 'wrong_answer', 'time_limit')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
