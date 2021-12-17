import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import PersonAdd from "@mui/icons-material/PersonAdd";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import {useNavigate} from "react-router-dom";
import {APP_ACTIONS} from "../../shared/immutables";
import {UserEntryState} from "../UserEntry";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export const MenuItems = (isUserLoggedIn, isSuperAdmin, dispatchAction) => {
  const navigate = useNavigate();
  return [
    {
      id: 0,
      title: "Admin",
      show: isSuperAdmin,
      icon: <AdminPanelSettingsIcon fontSize="small" />,
      onClick: () => {
        navigate("/admin/home");
      },
    },
    {
      id: 1,
      title: "My Profile",
      show: isUserLoggedIn,
      icon: <AccountCircleIcon fontSize="small" />,
      onClick: () => {
        navigate('/profile');
      },
    },
    {
      id: 2,
      title: "Orders",
      show: isUserLoggedIn,
      icon: <ShoppingBag fontSize="small" />,
    },
    {
      id: 3,
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
      id: 4,
      title: "Logout",
      show: isUserLoggedIn,
      icon: <Logout fontSize="small" />,
      onClick: () => {
        dispatchAction({type: APP_ACTIONS.LOGOUT});
      },
    },
    {
      id: 5,
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
