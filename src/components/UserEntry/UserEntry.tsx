import {AnimatePresence} from "framer-motion";
import {useContext, useReducer} from "react";

import {AppContext} from "../../App/App";
import loginImage from "../../assets/signup.png";
import {userEntryReducer} from "../../reducers";
import {GenericDialog} from "../../shared/components";
import {APP_ACTIONS} from "../../shared/immutables";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import {UserEntryState} from "./UserEntry.constant";
import styles from "./UserEntry.module.scss";

export const UserEntry = ({showForm}) => {
  const [state, dispatchUserEntryAction] = useReducer(userEntryReducer, {
    userEntryState: showForm,
    title: "",
  });
  const handleDialogClose = () => {
    dispatchAppAction({
      type: APP_ACTIONS.USER_ENTRY_COMPLETED,
    });
  };

  const {appState, dispatchAppAction} = useContext(AppContext);
  const {title, userEntryState} = state;

  return (
    <AnimatePresence>
      <GenericDialog
        className={styles.dialog}
        open={appState.open}
        onDialogClose={handleDialogClose}
        image={loginImage}
        title={title}
        addAnimation={true}
      >
        {userEntryState === UserEntryState.Login ? (
          <LoginForm userAction={dispatchUserEntryAction} />
        ) : (
          <SignUpForm userAction={dispatchUserEntryAction} />
        )}
      </GenericDialog>
    </AnimatePresence>
  );
};
