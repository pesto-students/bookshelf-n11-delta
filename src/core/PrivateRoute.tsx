import {useContext} from 'react';
import {Navigate} from 'react-router-dom';

import {AppContext} from '../App/App';

const PrivateRoute = (props: any) => {
  const {
    appState: {isUserLoggedIn},
  } = useContext(AppContext);
  return isUserLoggedIn ? <>{props.children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
