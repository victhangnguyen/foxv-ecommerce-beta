import { useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const outlet = useOutlet();

  const { user, token } = useSelector((state) => ({ ...state.auth }));
  const roles = user?.roles.map((role) => role.name);
  const isAdmin = roles?.includes('admin');

  const isAllowed = token && isAdmin;

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children ? children : outlet;
};

export default AdminRoute;
