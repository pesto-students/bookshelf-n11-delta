import RegisterIcon from "@material-ui/icons/AccountCircle";
import {Button, Stack, TextField} from "@mui/material";
import axios from "../../core/axios";
import {Formik} from "formik";
import {useContext, useEffect} from "react";
import {object, string} from "yup";

import {AppContext} from "../../App/App";
import {APP_ACTIONS, USER_ENTRY_ACTIONS} from "../../shared/immutables";
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_MIN_LENGTH_MSG,
  UserEntryState,
} from "./UserEntry.constant";
import styles from "./UserEntry.module.scss";

function LoginForm({userAction}) {
  const loginInitialValues = {email: "", password: ""};

  useEffect(() => {
    userAction({type: USER_ENTRY_ACTIONS.SET_TITLE, data: "Login"});
  }, []);

  const {dispatchAppAction} = useContext(AppContext);

  return (
    <>
      <Formik
        initialValues={loginInitialValues}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          axios
            .post("/login", {
              email: values.email,
              password: values.password,
            })
            .then(({data}) => {
              dispatchAppAction({type: APP_ACTIONS.LOGIN, data});
            })
            .catch((error) => console.log(error))
            .finally(() => setSubmitting(false));
        }}
        validationSchema={loginValidationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                name="email"
                label="Email"
                size="small"
                variant="outlined"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                label="Password"
                name="password"
                size="small"
                type="password"
                variant="outlined"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors?.password}
                helperText={touched.password && errors.password}
              />
              <Button
                style={{alignSelf: "center"}}
                type="submit"
                color="primary"
                size="medium"
                variant="contained"
                endIcon={<RegisterIcon />}
                disabled={isSubmitting}
              >
                Login
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
      <div
        className={styles.dialogFooter}
        onClick={() =>
          userAction({
            type: USER_ENTRY_ACTIONS.SET_USER_ENTRY_STATE,
            data: UserEntryState.SignUp,
          })
        }
      >
        <span>Not a member yet?</span>
        <span className={styles.registerText}>Register!</span>
      </div>
    </>
  );
}

const loginValidationSchema = object().shape({
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MSG)
    .required("Password is required"),
});

export default LoginForm;
