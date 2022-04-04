import RegisterIcon from '@material-ui/icons/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {Button, Divider, Stack, TextField} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import GoogleLogin from 'react-google-login';
import {object, string} from 'yup';
import LoginIcon from '@mui/icons-material/Login';

import environment from '../../Environment/environment';
import {AuthThunks, useAppDispatch} from '../../redux';
import {Overlay} from '../../shared/components';
import {USER_ENTRY_ACTIONS} from '../../shared/immutables';
import {
  MIN_PASSWORD_LENGTH,
  PASSWORD_MIN_LENGTH_MSG,
  UserEntryState,
} from './UserEntry.constant';
import styles from './UserEntry.module.scss';

function LoginForm({userAction}) {
  const loginInitialValues = {email: '', password: ''};

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    userAction({type: USER_ENTRY_ACTIONS.SET_TITLE, data: 'Login'});
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    dispatch(AuthThunks.guestLogin()).finally(() => setIsLoading(false));
  };

  const handleFailure = () => {
    if (isLoading) {
      setIsLoading(false);
    }
  };

  const handleLogin = async googleData => {
    setIsLoading(true);
    dispatch(AuthThunks.googleLogin(googleData)).finally(() =>
      setIsLoading(false),
    );
  };

  return (
    <>
      <Formik
        initialValues={loginInitialValues}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          setIsLoading(true);
          dispatch(AuthThunks.login(values)).finally(() => {
            setIsLoading(false);
            setSubmitting(false);
          });
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
          <div className={styles.loginDialog}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <TextField
                name="email"
                label="Email"
                size="small"
                variant="outlined"
                value={values.email}
                disabled={isLoading}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MailIcon className={styles.inputIcon} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Password"
                name="password"
                size="small"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={values.password}
                disabled={isLoading}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && !!errors?.password}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                className={styles.btn}
                type="submit"
                color="primary"
                size="medium"
                aria-label="login"
                variant="contained"
                startIcon={<LoginIcon />}
                disabled={isLoading || isSubmitting}
              >
                LOGIN
              </Button>
              <div className={styles.orText}>or</div>
              <Button
                className={styles.btn}
                type="submit"
                color="secondary"
                size="medium"
                aria-label="guest-login"
                onClick={handleGuestLogin}
                variant="contained"
                startIcon={<RegisterIcon />}
                disabled={isLoading || isSubmitting}
              >
                LOGIN AS GUEST
              </Button>
              <Divider />
              <GoogleLogin
                clientId={environment.GOOGLE_CLIENT_ID}
                className={styles.googleLoginBtn}
                buttonText="SIGN IN WITH GOOGLE"
                onSuccess={handleLogin}
                onFailure={handleFailure}
                cookiePolicy={'single_host_origin'}
              ></GoogleLogin>
            </form>
          </div>
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
      {isLoading && <Overlay showBackdrop={true} />}
    </>
  );
}

const loginValidationSchema = object().shape({
  email: string().email('Invalid email').required('Email is required'),
  password: string()
    .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MSG)
    .required('Password is required'),
});

export default LoginForm;
