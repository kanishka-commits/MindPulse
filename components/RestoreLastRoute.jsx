import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RestoreLastRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lastPath = localStorage.getItem('lastVisitedPath');
    const skipRestore = localStorage.getItem('skipRestore'); // new flag

    if (location.pathname === '/' && lastPath && lastPath !== '/' && !skipRestore) {
      navigate(lastPath, { replace: true });
    } else {
      // Clear the skip flag after using it once
      if (skipRestore) {
        localStorage.removeItem('skipRestore');
      }
    }
  }, [location.pathname, navigate]);

  return null;
}

export default RestoreLastRoute;
