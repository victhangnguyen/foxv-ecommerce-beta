import { useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const outlet = useOutlet();

  const { user, token } = useSelector((state) => ({ ...state.auth }));
  const roles = user.role.map((role) => role.name);
  const isUser = roles.length === 1 && roles.includes('user');

  const isAllowed = token && isUser;

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children ? children : outlet;
};

export default AdminRoute;
