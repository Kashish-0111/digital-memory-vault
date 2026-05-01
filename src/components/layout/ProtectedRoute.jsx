import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';

export default function ProtectedRoute({ children }) {
  const { auth } = useApp();

  if (!auth.state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
