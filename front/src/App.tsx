import AuthDemo from './pages/AuthDemo';
import LandingPage from './pages/LandingPage';

function App() {
  const path = window.location.pathname;
  if (path === '/auth' || path.startsWith('/auth/')) {
    return <AuthDemo />;
  }

  return <LandingPage />;
}

export default App;
