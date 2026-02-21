import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StatsProvider } from './contexts/StatsContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { StudyDungeonProvider } from './contexts/StudyDungeonContext';
import Navbar from './components/Navigation/Navbar';
import Footer from './components/Footer/Footer';
import CookieConsent from './components/CookieConsent/CookieConsent';
import { HelmetProvider } from 'react-helmet-async';
import { Box, CircularProgress } from '@mui/material';
import ProfileBoard from './components/ProfileBoard';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Teachers = lazy(() => import('./pages/Teachers'));
const Profile = lazy(() => import('./components/pages/Profile'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const AuthForm = lazy(() => import('./components/auth/AuthForm'));
const CharacterCreation = lazy(() => import('./components/auth/CharacterCreation'));
const Flashcards = lazy(() => import('./components/pages/Flashcards'));
const Social = lazy(() => import('./components/pages/Social'));
const AITutor = lazy(() => import('./components/pages/AITutor'));
const StudyDungeon = lazy(() => import('./components/pages/StudyDungeon'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
// Eager import to avoid ChunkLoadError (AdminDashboard has many deps; lazy chunk can fail to load)
import AdminDashboard from './pages/AdminDashboard';

// Teacher pages
const TeacherClasses = lazy(() => import('./pages/teacher/Classes'));
const TeacherContent = lazy(() => import('./pages/teacher/Content'));
const TeacherAnalytics = lazy(() => import('./pages/teacher/Analytics'));
const TeacherEngagement = lazy(() => import('./pages/teacher/Engagement'));
const TeacherLessonPlanning = lazy(() => import('./pages/teacher/LessonPlanning'));
const TeacherAssessments = lazy(() => import('./pages/teacher/Assessments'));
const TeacherParentPortal = lazy(() => import('./pages/teacher/ParentPortal'));
const TeacherResources = lazy(() => import('./pages/teacher/Resources'));

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

const App = () => {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <Home />
            </Layout>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/auth",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthForm />
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/character-creation",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CharacterCreationRoute>
              <CharacterCreation />
            </CharacterCreationRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <ProfileBoard />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/study-dungeon",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <StudyDungeon />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/ai-tutor",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <AITutor />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/flashcards",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <Flashcards />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/social",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <Social />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <About />
            </Layout>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <Contact />
            </Layout>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teachers",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <Teachers />
            </Layout>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teacher/classes",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <TeacherClasses />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teacher/content",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <TeacherContent />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teacher/analytics",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <TeacherAnalytics />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teacher/engagement",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <TeacherEngagement />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teacher/lesson-planning",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <TeacherLessonPlanning />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teacher/assessments",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <TeacherAssessments />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teacher/parent-portal",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <TeacherParentPortal />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/teacher/resources",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PrivateRoute>
              <Layout>
                <TeacherResources />
              </Layout>
            </PrivateRoute>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/admin-dashboard",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Layout>
              <AdminPasswordGate>
                <AdminDashboard />
              </AdminPasswordGate>
            </Layout>
          </Suspense>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/admindashboard",
        element: <Navigate to="/admin-dashboard" replace />,
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }
    }
  );

  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <StatsProvider>
            <StudyDungeonProvider>
              <RouterProvider router={router} future={{ v7_startTransition: true }} />
              <CookieConsent />
            </StudyDungeonProvider>
          </StatsProvider>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

// Layout component that includes Navbar and Footer
const Layout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

// PrivateRoute: Protects routes for authenticated users
const PrivateRoute = ({ children }) => {
  const { user, loading, isNewUser } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (isNewUser) return <Navigate to="/character-creation" />;
  return children;
};

// CharacterCreationRoute: Redirects new users to character creation
const CharacterCreationRoute = ({ children }) => {
  const { user, loading, isNewUser } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (!isNewUser) return <Navigate to="/" />;
  return children;
};


// SessionStorage key/value for admin dashboard access (must match AuthContext logout clear)
const ADMIN_ACCESS_KEY = 'adminAccess';
const ADMIN_ACCESS_GRANTED = 'granted';

// AdminPasswordGate: Requires a one-time password before showing the admin dashboard
const AdminPasswordGate = ({ children }) => {
  const [password, setPassword] = React.useState('');
  const [hasAccess, setHasAccess] = React.useState(() =>
    sessionStorage.getItem(ADMIN_ACCESS_KEY) === ADMIN_ACCESS_GRANTED
  );
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (sessionStorage.getItem(ADMIN_ACCESS_KEY) === ADMIN_ACCESS_GRANTED && !hasAccess) {
      setHasAccess(true);
    }
  }, [hasAccess]);

  const envPassword = (process.env.REACT_APP_ADMIN_PANEL_PASSWORD || '').trim();
  const expectedPassword = envPassword || (process.env.NODE_ENV !== 'production' ? 'Admin2024#' : '');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!expectedPassword) {
      setError('Admin panel password is not configured. Please contact support.');
      return;
    }

    const trimmedInput = (password || '').trim();
    const isValid = trimmedInput === expectedPassword;

    setSubmitting(true);
    try {
      if (isValid) {
        sessionStorage.setItem(ADMIN_ACCESS_KEY, ADMIN_ACCESS_GRANTED);
        setHasAccess(true);
        setPassword('');
      } else {
        setError('Incorrect admin password.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (hasAccess) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Verification</h1>
        <p className="text-sm text-gray-600 mb-4">
          Please enter the admin dashboard password to continue.
        </p>
        {error && (
          <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="admin-dashboard-password">
              Password
            </label>
            <input
              id="admin-dashboard-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm"
              autoComplete="off"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default App;


