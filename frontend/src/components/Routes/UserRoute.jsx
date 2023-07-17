import { useSelector } from 'react-redux';
import { Navigate, useOutlet, useParams, useLocation } from 'react-router-dom';

const UserRoute = ({ children, privateProtect }) => {
  const outlet = useOutlet();
  const location = useLocation();

  const indexDest = location.pathname.split('/').length - 1;
  const dest = location.pathname.split('/')[indexDest];

  const { userId } = useParams();

  //! Authen
  const { user, token } = useSelector((state) => state.auth);
  const isAuth = !!token;

  //! Author
  const roles = user?.roles.map((role) => role.name);
  const isUser = roles?.includes('user');

  let isAllowed = false;

  if (privateProtect) {
    isAllowed = isAuth && isUser && userId === user._id;
  } else {
    isAllowed = isAuth && isUser;
  }

  if (!isAllowed) {
    //! ##error: Xuat hien loi khong tim thay _id
    // if (dest === 'update') { 
    //   return <Navigate to={`/users/${user._id}/update`} replace />;
    // }
    
    //! defaults
    return <Navigate to="/" replace />;
  }

  return children ? children : outlet;
};

export default UserRoute;
