import EditIcon from "@mui/icons-material/Edit";
import {Button, Grid, Stack, styled, TextField} from "@mui/material";
import {Formik} from "formik";
import {motion} from "framer-motion";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {object, string} from "yup";

import {AppContext} from "../../App/App";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {DASHBOARD_ROUTE} from "../../shared/immutables";
import styles from "./UserProfile.module.scss";

export const UserProfile = () => {
  const initialProfileData = {
    avatar: "",
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    display: false,
  };

  const [formDisabled, setFormDisabled] = useState(true);

  const [userInfo, setUserInfo] = useState(initialProfileData);
  const navigate = useNavigate();

  const Input = styled("input")({
    display: "none",
  });

  const {appState} = useContext(AppContext);

  useEffect(() => {
    getUserInfo();
  }, [appState.user]);

  useEffect(() => {
    if (!appState.isUserLoggedIn) {
      navigate(DASHBOARD_ROUTE);
    }
  }, [appState.isUserLoggedIn]);

  function getUserInfo() {
    const user = appState.user ?? {};
    const addresses = user.addresses ?? [];
    const primaryAdd =
      addresses.find((address) => !!address?.default) ?? addresses[0];
    const profile = {
      email: user.email,
      name: user.username,
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
    axios
      .post(`${environment.API_URL}/me`, {
        username: values.name,
        addressLine1: values.address,
        city: values.city,
        state: values.state,
        pincode: values.pin,
      })
      .then(() => {
        setFormDisabled(true);
      })
      .catch((error) => console.log(error))
      .finally(() => actions.setSubmitting(false));
  }

  const [iconFile, setIconFile] = useState({
    file: "",
    url: "",
  });
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
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
    disabled = false
  ) => {
    return (
      <Grid item xs={width}>
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
    <Stack spacing={2} direction="row" className={styles.profileLayout}>
      <motion.div
        className={styles.imageLayout}
        initial={{opacity: 0}}
        animate={{scale: [1, 1.2, 1], opacity: [0.5, 0.5, 1]}}
        transition={{ease: "easeOut", duration: 1}}
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
            {!!iconFile.url && <img src={iconFile.url} />}
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
                      "name",
                      "Name",
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors
                    )}
                    {TextWrappedInGrid(
                      8,
                      "email",
                      "Email",
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors,
                      true
                    )}
                    {TextWrappedInGrid(
                      8,
                      "address",
                      "Address",
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors
                    )}
                    {TextWrappedInGrid(
                      8,
                      "city",
                      "City",
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors
                    )}
                    {TextWrappedInGrid(
                      8,
                      "state",
                      "State",
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors
                    )}
                    {TextWrappedInGrid(
                      8,
                      "pin",
                      "Pin code",
                      values,
                      handleChange,
                      handleBlur,
                      touched,
                      errors
                    )}
                    <Grid item xs={8}>
                      <Button
                        style={{minWidth: "150px"}}
                        type="submit"
                        color="primary"
                        size="medium"
                        variant="contained"
                        disabled={isSubmitting || formDisabled}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </>
        )}
      </div>
    </Stack>
  );
};

const profileValidationSchema = object().shape({
  name: string().required("Required field"),
  address: string().required("Required field"),
  city: string(),
  state: string(),
  pin: string(),
});
