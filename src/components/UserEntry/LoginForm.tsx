import RegisterIcon from "@material-ui/icons/AccountCircle";
import {Button, Stack, TextField} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import {Formik} from "formik";
import {useContext, useEffect, useState} from "react";
import {object, string} from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailIcon from "@mui/icons-material/Mail";
import InputAdornment from "@mui/material/InputAdornment";
import {AppContext} from "../../App/App";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {APP_ACTIONS, USER_ENTRY_ACTIONS} from "../../shared/immutables";
import IconButton from "@mui/material/IconButton";

import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_MIN_LENGTH_MSG,
  UserEntryState,
} from "./UserEntry.constant";
import styles from "./UserEntry.module.scss";

function LoginForm({userAction}) {
  const loginInitialValues = {email: "", password: ""};

  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    userAction({type: USER_ENTRY_ACTIONS.SET_TITLE, data: "Login"});
  }, []);

  const {dispatchAppAction} = useContext(AppContext);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGuestLogin = (resetForm) => {
    const values = {...loginInitialValues};
    if (!checked) {
      values.email = environment.GUEST_EMAIL;
      values.password = environment.GUEST_PASSWORD;
      setShowPassword(false);
    }
    setChecked(!checked);
    resetForm({values});
  };

  return (
    <>
      <Formik
        initialValues={loginInitialValues}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          axios
            .post(`${environment.API_URL}/login`, {
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
          resetForm,
        }) => (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                className={styles.textField}
                name="email"
                label="Email"
                size="small"
                variant="outlined"
                value={values.email}
                disabled={checked}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {checked ? (
                        <MailIcon
                          color="disabled"
                          className={styles.inputIcon}
                        />
                      ) : (
                        <MailIcon className={styles.inputIcon} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                className={styles.textField}
                label="Password"
                name="password"
                size="small"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={values.password}
                disabled={checked}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && !!errors?.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        disabled={checked}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormGroup className={styles.guestLogin}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={() => handleGuestLogin(resetForm)}
                    />
                  }
                  label="Sign in as Guest"
                />
              </FormGroup>
              <Button
                style={{alignSelf: "center", width: "300px"}}
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
