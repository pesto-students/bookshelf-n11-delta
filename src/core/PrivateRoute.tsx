import {Navigate} from 'react-router-dom';
import {TokenService} from '../shared/services';

const PrivateRoute = (props: any) => {
  const isLoggedIn = !!TokenService.getAccessToken();

  return isLoggedIn ? <>{props.children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
