import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import PersonAdd from "@mui/icons-material/PersonAdd";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import {useNavigate} from "react-router-dom";
import {APP_ACTIONS} from "../../shared/immutables";
import {UserEntryState} from "../UserEntry";

export const MenuItems = (isUserLoggedIn, dispatchAction) => {
  const navigate = useNavigate();
  return [
    {
      id: 0,
      title: "My Profile",
      show: isUserLoggedIn,
      icon: <AccountCircleIcon fontSize="small" />,
      onClick: () => {
        navigate('/profile');
      },
    },
    {
      id: 1,
      title: "Orders",
      show: isUserLoggedIn,
      icon: <ShoppingBag fontSize="small" />,
    },
    {
      id: 2,
      title: "Login",
      show: !isUserLoggedIn,
      icon: <Login fontSize="small" />,
      onClick: () => {
        dispatchAction({
          type: APP_ACTIONS.USER_ENTRY_MENU_CLICKED,
          data: UserEntryState.Login,
        });
      },
    },
    {
      id: 3,
      title: "Logout",
      show: isUserLoggedIn,
      icon: <Logout fontSize="small" />,
      onClick: () => {
        dispatchAction({type: APP_ACTIONS.LOGOUT});
      },
    },
    {
      id: 4,
      title: "Sign Up",
      show: !isUserLoggedIn,
      icon: <PersonAdd fontSize="small" />,
      onClick: () => {
        dispatchAction({
          type: APP_ACTIONS.USER_ENTRY_MENU_CLICKED,
          data: UserEntryState.SignUp,
        });
      },
    },
  ];
};
