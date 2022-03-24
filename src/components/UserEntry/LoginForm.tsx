import RegisterIcon from '@material-ui/icons/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {Button, Stack, TextField} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import {Formik} from 'formik';
import {useContext, useEffect, useState} from 'react';
import GoogleLogin from 'react-google-login';
import {object, string} from 'yup';

import environment from '../../Environment/environment';
import {googleLogin, login, useAppDispatch} from '../../redux';
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

  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    userAction({type: USER_ENTRY_ACTIONS.SET_TITLE, data: 'Login'});
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGuestLogin = resetForm => {
    const values = {...loginInitialValues};
    if (!checked) {
      values.email = environment.GUEST_EMAIL;
      values.password = environment.GUEST_PASSWORD;
      setShowPassword(false);
    }
    setChecked(!checked);
    resetForm({values});
  };

  const handleFailure = () => {
    if (isLoading) {
      setIsLoading(false);
    }
  };

  const handleLogin = async googleData => {
    setIsLoading(true);
    dispatch(googleLogin(googleData)).finally(() => setIsLoading(false));
  };

  return (
    <>
      <Formik
        initialValues={loginInitialValues}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          setIsLoading(true);
          dispatch(login(values)).finally(() => {
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
          resetForm,
        }) => (
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                name="email"
                label="Email"
                size="small"
                variant="outlined"
                value={values.email}
                disabled={isLoading || checked}
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
                label="Password"
                name="password"
                size="small"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={values.password}
                disabled={isLoading || checked}
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
                className={styles.btn}
                type="submit"
                color="primary"
                size="medium"
                aria-label="submit"
                variant="contained"
                startIcon={<RegisterIcon />}
                disabled={isLoading || isSubmitting}
              >
                LOGIN
              </Button>
              <GoogleLogin
                clientId={environment.GOOGLE_CLIENT_ID}
                className={styles.googleLoginBtn}
                buttonText="SIGN IN WITH GOOGLE"
                onSuccess={handleLogin}
                disabled={checked}
                onFailure={handleFailure}
                cookiePolicy={'single_host_origin'}
              ></GoogleLogin>
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
