import {Button, Stack, TextField} from "@mui/material";
import {Formik} from "formik";
import {useContext, useEffect} from "react";
import {object, ref, string} from "yup";

import {AppContext} from "../../App/App";
import axios from "../../core/axios";
import {APP_ACTIONS, USER_ENTRY_ACTIONS} from "../../shared/immutables";
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_MIN_LENGTH_MSG,
  UserEntryState,
} from "./UserEntry.constant";
import styles from "./UserEntry.module.scss";

function SignUpForm({userAction}) {
  const signUpInitialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const {dispatchAppAction} = useContext(AppContext);

  useEffect(() => {
    userAction({type: USER_ENTRY_ACTIONS.SET_TITLE, data: "Sign Up"});
  }, []);

  return (
    <>
      <Formik
        initialValues={signUpInitialValues}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          axios
            .post("/signup", {
              name: values.name,
              email: values.email,
              password: values.password,
            })
            .then(() => {
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
            })
            .catch(() => {
              setSubmitting(false);
            });
        }}
        validationSchema={signUpValidationSchema}
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
                name="name"
                label="Name"
                size="small"
                variant="outlined"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={touched.name && errors.name}
              />

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
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                size="small"
                type="password"
                variant="outlined"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors?.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <Button
                style={{alignSelf: "center"}}
                type="submit"
                color="primary"
                size="medium"
                variant="contained"
                disabled={isSubmitting}
              >
                Sign Up
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
            data: UserEntryState.Login,
          })
        }
      >
        <span>Existing User?</span>
        <span className={styles.secondaryText}>Login!</span>
      </div>
    </>
  );
}

const signUpValidationSchema = object().shape({
  name: string().required("Name is required"),
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MSG)
    .required("Password is required"),
  confirmPassword: string()
    .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MSG)
    .oneOf([ref("password"), null], "Passwords must match")
    .required("Please re-enter your password"),
});

export default SignUpForm;
