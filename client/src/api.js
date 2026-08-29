const BASE = '/api';

function getToken() {
  return localStorage.getItem('izicripto_token');
}

async function req(path, options = {}) {
  const token = getToken();
  const res = await fetch(BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error || `${path} -> ${res.status}`);
  return body;
}

export const api = {
  // Auth
  register: (data) => req('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => req('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => req('/auth/me'),

  // Courses
  listCourses: () => req('/courses'),
  getCourse: (id) => req(`/courses/${encodeURIComponent(id)}`),
  createCourse: (data) => req('/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id, data) => req(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id) => req(`/courses/${id}`, { method: 'DELETE' }),

  addModule: (courseId, title) => req(`/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify({ title }) }),
  updateModule: (courseId, moduleId, title) => req(`/courses/${courseId}/modules/${moduleId}`, { method: 'PUT', body: JSON.stringify({ title }) }),
  deleteModule: (courseId, moduleId) => req(`/courses/${courseId}/modules/${moduleId}`, { method: 'DELETE' }),

  addLesson: (courseId, moduleId, data) => req(`/courses/${courseId}/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(data) }),
  updateLesson: (courseId, moduleId, lessonId, data) => req(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLesson: (courseId, moduleId, lessonId) => req(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, { method: 'DELETE' }),

  // Progress
  getProgress: () => req('/progress'),
  markComplete: (lessonId) => req(`/progress/${lessonId}`, { method: 'POST' }),
  markIncomplete: (lessonId) => req(`/progress/${lessonId}`, { method: 'DELETE' }),

  // Billing
  billingStatus: () => req('/billing/status'),
  checkout: () => req('/billing/checkout', { method: 'POST' }),
};

export const tokenStorage = {
  get: getToken,
  set: (token) => localStorage.setItem('izicripto_token', token),
  clear: () => localStorage.removeItem('izicripto_token'),
};
