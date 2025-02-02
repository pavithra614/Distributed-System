import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, admin = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (admin && !user.isAdmin) {
    return <Navigate to="/user" />; // Redirect to User Dashboard if not an admin
  }

  return children;
}

export default PrivateRoute;