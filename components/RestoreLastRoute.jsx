import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RestoreLastRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lastPath = localStorage.getItem('lastVisitedPath');

    // Only restore if current path is `/` (StartPage) and last path was something else
    if (location.pathname === '/' && lastPath && lastPath !== '/') {
      navigate(lastPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null; // This component doesn't render anything
}

export default RestoreLastRoute;