import { useSelector } from 'react-redux';
import { Navigate, useOutlet, useParams, useLocation } from 'react-router-dom';

const UserRoute = ({ children }) => {
  const outlet = useOutlet();
  const location = useLocation();

  const indexDest = location.pathname.split('/').length - 1;
  const dest = location.pathname.split('/')[indexDest];

  const { userId } = useParams();

  //! Authen
  const { user, token } = useSelector((state) => ({ ...state.auth }));
  const isAuth = userId === user?._id;

  //! Author
  const roles = user?.roles.map((role) => role.name);
  const isUser = roles?.includes('user');

  const isAllowed = token && isAuth && isUser;

  if (!isAllowed) {
    if (dest === 'update') {
      return <Navigate to={`/users/${user._id}/update`} replace />;
    }
    //! defaults
    return <Navigate to="/auth/login" replace />;
  }

  return children ? children : outlet;
};

export default UserRoute;
