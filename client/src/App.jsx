import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { CourseDetailPage } from './pages/CourseDetailPage.jsx';
import { LessonPage } from './pages/LessonPage.jsx';
import { GlossaryPage } from './pages/GlossaryPage.jsx';
import { PricingPage } from './pages/PricingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { AdminListPage } from './pages/AdminListPage.jsx';
import { AdminCourseEditorPage } from './pages/AdminCourseEditorPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cursos" element={<CatalogPage />} />
            <Route path="/cursos/:courseId" element={<CourseDetailPage />} />
            <Route path="/cursos/:courseId/aulas/:lessonId" element={<LessonPage />} />
            <Route path="/glossario" element={<GlossaryPage />} />
            <Route path="/precos" element={<PricingPage />} />
            <Route path="/entrar" element={<LoginPage />} />
            <Route path="/registrar" element={<RegisterPage />} />

            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<AdminListPage />} />
              <Route path="/admin/cursos/:courseId" element={<AdminCourseEditorPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
