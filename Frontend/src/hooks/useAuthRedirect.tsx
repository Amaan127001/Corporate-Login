
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useAuthRedirect(token: string | null) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    (async () => {
      const resp = await fetch('http://localhost:4000/user/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resp.ok) return;
      const { profileType, profileCompleted } = await resp.json();

      if (!profileType) return navigate('/welcome');
      if (!profileCompleted) return navigate('/profilecompletion');
      navigate('/dashboard');
    })();
  }, [token, navigate]);
}
