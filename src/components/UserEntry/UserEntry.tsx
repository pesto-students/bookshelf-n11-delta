import {useContext, useReducer} from "react";

import loginImage from "../../assets/signup.png";
import {GenericDialog} from "../../shared/components";
import styles from "./UserEntry.module.scss";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import {UserEntryState} from "./UserEntry.constant";
import {userEntryReducer} from "../../reducers";
import {APP_ACTIONS} from "../../shared/immutables";
import {AppContext} from "../../App/App";
import {motion, AnimatePresence} from "framer-motion";

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
  const variants = {
    visible: {opacity: 1},
    hidden: {opacity: 0},
  };

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1, scale: 2}}
      exit={{opacity: 0}}
      // variants={variants}
    >
      <AnimatePresence>
        <GenericDialog
          className={styles.dialog}
          open={appState.open}
          onDialogClose={handleDialogClose}
          image={loginImage}
          title={title}
        >
          {userEntryState === UserEntryState.Login ? (
            <LoginForm userAction={dispatchUserEntryAction} />
          ) : (
            <SignUpForm userAction={dispatchUserEntryAction} />
          )}
        </GenericDialog>
      </AnimatePresence>
    </motion.div>
  );
};
