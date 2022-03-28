import EditIcon from '@mui/icons-material/Edit';
import {Button, Grid, Paper, styled, TextField} from '@mui/material';
import {Formik} from 'formik';
import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {object, string} from 'yup';

import {AuthThunks, useAppDispatch, useAppSelector} from '../../redux';
import AddressAccordion from '../AddressAccordion/AddressAccordion';
import {AddressDetails} from '../AddressDetails/AddressDetails';
import styles from './UserProfile.module.scss';

const UserProfile = () => {
  const initialProfileData = {
    avatar: '',
    name: '',
    email: '',
  };

  const [formDisabled, setFormDisabled] = useState(true);

  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState(initialProfileData);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddBtn, setShowAddAddBtn] = useState(true);

  const Input = styled('input')({
    display: 'none',
  });

  const currentUser = useAppSelector(state => state.auth.user);

  useEffect(() => {
    if (currentUser) {
      getUserInfo();
    }
  }, [currentUser]);

  function getUserInfo() {
    const profile = {
      email: currentUser.email,
      name: currentUser.username,
    };
    setUserInfo({...userInfo, ...profile});
    if (currentUser?.addresses) {
      const addressDetails = [...currentUser.addresses];
      addressDetails.forEach(address => {
        address.showAccordion = false;
      });
      setAddresses(addressDetails);
    }
  }

  function handleSubmit(values, actions) {
    actions.setSubmitting(true);
    dispatch(AuthThunks.updateUserInfo(values.name))
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

  const showAccState = (id, showAcc) => {
    const add = addresses.find(address => address._id === id);
    add.showAccordion = showAcc;
    setAddresses([...addresses]);
  };

  return (
    <div className={styles.profile}>
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
          <div className={styles.heading}>
            <div className={styles.title}>PERSONAL INFORMATION</div>
            <EditIcon onClick={() => setFormDisabled(!formDisabled)} />
          </div>
          <Formik
            enableReinitialize
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
                    12,
                    'name',
                    'Name',
                    values,
                    handleChange,
                    handleBlur,
                    touched,
                    errors,
                  )}
                  {TextWrappedInGrid(
                    12,
                    'email',
                    'Email',
                    values,
                    handleChange,
                    handleBlur,
                    touched,
                    errors,
                    true,
                  )}
                  <Grid item xs={8}>
                    <Button
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
        </div>
      </Paper>
      <Paper elevation={2} className={styles.addressLayout}>
        {showAddAddBtn ? (
          <Button
            variant="outlined"
            className={styles.addNewBtn}
            onClick={() => setShowAddAddBtn(false)}
          >
            + ADD A NEW ADDRESS
          </Button>
        ) : (
          <AddressAccordion onCloseHandler={() => setShowAddAddBtn(true)} />
        )}
        {!!addresses &&
          addresses.map(address =>
            address.showAccordion ? (
              <AddressAccordion
                key={address._id}
                userAddress={address}
                onCloseHandler={() => showAccState(address._id, false)}
              />
            ) : (
              <div className={styles.addressSection}>
                <AddressDetails address={address} />
                <EditIcon
                  className={styles.pencilIcon}
                  onClick={() => showAccState(address._id, true)}
                />
              </div>
            ),
          )}
      </Paper>
    </div>
  );
};

const profileValidationSchema = object().shape({
  name: string().required('Required field'),
});

export default UserProfile;
