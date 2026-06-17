const STUDENT_STORAGE_KEY = "coding_platform_student";
const ADMIN_STORAGE_KEY = "coding_platform_admin";

export function saveStudentSession(user) {
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(user));
}

export function getStudentSession() {
  const stored = localStorage.getItem(STUDENT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveAdminSession(user) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
}

export function getAdminSession() {
  const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}
