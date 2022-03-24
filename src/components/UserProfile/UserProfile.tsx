import EditIcon from '@mui/icons-material/Edit';
import {Button, Grid, Paper, styled, TextField} from '@mui/material';
import {Formik} from 'formik';
import {motion} from 'framer-motion';
import {useContext, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {object, string} from 'yup';

import {AuthThunks, useAppDispatch, useAppSelector} from '../../redux';
import styles from './UserProfile.module.scss';

const UserProfile = () => {
  const initialProfileData = {
    avatar: '',
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    display: false,
  };

  const [formDisabled, setFormDisabled] = useState(true);

  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState(initialProfileData);

  const Input = styled('input')({
    display: 'none',
  });

  const currentUser = useAppSelector(state => state.auth.user);

  useEffect(() => {
    getUserInfo();
  }, []);

  function getUserInfo() {
    const addresses = currentUser?.addresses ?? [];
    const primaryAdd =
      addresses.find(address => !!address?.default) ?? addresses[0];
    const profile = {
      email: currentUser.email,
      name: currentUser.username,
      address: primaryAdd?.addressLine1,
      city: primaryAdd?.city,
      state: primaryAdd?.state,
      pin: primaryAdd?.pincode,
      display: true,
    };
    setUserInfo({...userInfo, ...profile});
  }

  function handleSubmit(values, actions) {
    actions.setSubmitting(true);
    const data = {
      username: values.name,
      addressLine1: values.address,
      city: values.city,
      state: values.state,
      pincode: values.pin,
      default: true,
    };
    dispatch(AuthThunks.updateUserInfo(data))
      .unwrap()
      .then(() => {
        toast.success('Profile data updated successfully');
        setFormDisabled(true);
      })
      .catch(error => console.error(error))
      .finally(() => actions.setSubmitting(false));
  }

  const [iconFile, setIconFile] = useState({
    file: '',
    url: '',
  });
  const onFileChange = event => {
    const selectedFile = event.target.files[0];
    setIconFile({file: selectedFile, url: URL.createObjectURL(selectedFile)});
  };

  const TextWrappedInGrid = (
    width,
    name,
    label,
    values,
    onChangeHandler,
    onBlurHandler,
    touched,
    errors,
    disabled = false,
  ) => {
    return (
      <Grid item sm={width} xs={12}>
        <TextField
          className={styles.textField}
          name={name}
          label={label}
          size="small"
          variant="outlined"
          value={values[`${name}`]}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          disabled={disabled || formDisabled}
          error={touched[`${name}`] && !!errors[`${name}`]}
          helperText={touched[`${name}`] && errors[`${name}`]}
        />
      </Grid>
    );
  };

  return (
    <Paper elevation={2} className={styles.profileLayout}>
      <motion.div
        className={styles.imageLayout}
        initial={{opacity: 0}}
        animate={{scale: [1, 1.2, 1], opacity: [0.5, 0.5, 1]}}
        transition={{ease: 'easeOut', duration: 1}}
      >
        <label htmlFor="avatar">
          <Input
            accept="image/*"
            id="avatar"
            type="file"
            onChange={onFileChange}
            disabled={true}
          />
          <div className={styles.avatarContainer}>
            {!!iconFile.url && <img src={iconFile.url} alt="user-image" />}
          </div>
        </label>
        <div className={styles.greetingMsg}>Hello {userInfo.name}</div>
      </motion.div>
      <div className={styles.infoLayout}>
        {userInfo.display && (
          <>
            <div className={styles.heading}>
              <div className={styles.title}>PERSONAL INFORMATION</div>
              <EditIcon onClick={() => setFormDisabled(!formDisabled)} />
            </div>
            <Formik
              initialValues={userInfo}
              onSubmit={(values, actions) => handleSubmit(values, actions)}
              validationSchema={profileValidationSchema}
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
                <form className={styles.form} onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {TextWrappedInGrid(
                      8,
                      'name',
                      'Name',
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors,
                    )}
                    {TextWrappedInGrid(
                      8,
                      'email',
                      'Email',
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors,
                      true,
                    )}
                    {TextWrappedInGrid(
                      8,
                      'address',
                      'Address',
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors,
                    )}
                    {TextWrappedInGrid(
                      8,
                      'city',
                      'City',
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors,
                    )}
                    {TextWrappedInGrid(
                      8,
                      'state',
                      'State',
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors,
                    )}
                    {TextWrappedInGrid(
                      8,
                      'pin',
                      'Pin code',
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors,
                    )}
                    <Grid item xs={8}>
                      <Button
                        style={{minWidth: '150px'}}
                        type="submit"
                        color="primary"
                        size="medium"
                        aria-label="save"
                        variant="contained"
                        disabled={isSubmitting || formDisabled}
                      >
                        SAVE
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </>
        )}
      </div>
    </Paper>
  );
};

const profileValidationSchema = object().shape({
  name: string().required('Required field'),
  address: string().required('Required field'),
  city: string(),
  state: string(),
  pin: string(),
});

export default UserProfile;
