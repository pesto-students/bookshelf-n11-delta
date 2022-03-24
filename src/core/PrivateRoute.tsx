import {Navigate} from 'react-router-dom';

import {useAppSelector} from '../redux';

const PrivateRoute = (props: any) => {
  const currentUser = useAppSelector(state => state.auth.user);

  return !!currentUser ? <>{props.children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
