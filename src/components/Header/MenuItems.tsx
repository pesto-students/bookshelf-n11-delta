import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import PersonAdd from '@mui/icons-material/PersonAdd';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import {useLocation, useNavigate} from 'react-router-dom';

import {useAppDispatch, useAppSelector} from '../../redux';
import {authActions} from '../../redux/slices';
import {DASHBOARD_ROUTE} from '../../shared/immutables';
import {UserEntryState} from '../UserEntry';

export const MenuItems = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);

  return [
    {
      id: 0,
      title: 'My Profile',
      show: currentUser && !currentUser.isSuperAdmin,
      icon: <AccountCircleIcon fontSize="small" />,
      onClick: () => {
        navigate('/profile');
      },
    },
    {
      id: 1,
      title: 'Orders',
      show: !!currentUser,
      icon: <ShoppingBag fontSize="small" />,
      onClick: () => {
        navigate('/orders');
      },
    },
    {
      id: 2,
      title: 'Login',
      show: !currentUser,
      icon: <Login fontSize="small" />,
      onClick: () => {
        dispatch(authActions.setModalStateOpen(UserEntryState.Login));
      },
    },
    {
      id: 3,
      title: 'Logout',
      show: !!currentUser,
      disable: ['/buy', '/payment'].includes(location.pathname),
      icon: <Logout fontSize="small" />,
      onClick: () => {
        dispatch(authActions.logout());
        navigate(DASHBOARD_ROUTE);
      },
    },
    {
      id: 4,
      title: 'Sign Up',
      show: !currentUser,
      icon: <PersonAdd fontSize="small" />,
      onClick: () => {
        dispatch(authActions.setModalStateOpen(UserEntryState.SignUp));
      },
    },
  ];
};
