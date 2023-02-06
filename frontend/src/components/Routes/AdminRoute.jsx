// import { useSelector } from 'react-redux';
import { Navigate, useOutlet } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const outlet = useOutlet();

  // const {
  //   user: { result, token },
  // } = useSelector((state) => ({ ...state.auth }));


  // const isAllowed = token && result.role >= 5;

  // if (!isAllowed) {
  //   return <Navigate to="/" replace />;
  // }

  return children ? children : outlet;
};

export default AdminRoute;
