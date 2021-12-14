import {Button, Grid, Paper, Stack, styled, TextField} from "@mui/material";
import {Formik} from "formik";
import {motion} from "framer-motion";
import {useContext, useEffect, useState} from "react";
import env from "react-dotenv";
import {object, string} from "yup";

import {AppContext} from "../../App/App";
import axios from "../../core/axios";
import styles from "./UserProfile.module.scss";

export const UserProfile = () => {
  const name = "";

  const profileData = {
    avatar: "",
    name,
    email: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  };

  const Input = styled("input")({
    display: "none",
  });

  const {appState, dispatchAppAction} = useContext(AppContext);

  useEffect(() => {
    getUserInfo();
  }, []);

  function getUserInfo() {}

  function handleSubmit(values, actions) {
    actions.setSubmitting(true);
    axios
      .post(`${env.API_URL}/user`, {
        email: values.email,
        name: values.name,
        address: values.address,
        pin: values.pin,
      })
      .then(({data}) => {
        console.log(data);
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
    errors
  ) => {
    return (
      <Grid xs={width}>
        <TextField
          className={styles.textField}
          name={name}
          label={label}
          size="small"
          variant="outlined"
          value={values[`${name}`]}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
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
        initial={{ opacity: 0 }}
        animate={{scale: [1, 1.2, 1], opacity: [0.5, 0.5, 1]}}
        transition={{ease: "easeOut", duration: 1}}
      >
        <label htmlFor="avatar">
          <Input
            accept="image/*"
            id="avatar"
            type="file"
            onChange={onFileChange}
          />
          <div className={styles.avatarContainer}>
            {!!iconFile.url && <img src={iconFile.url} />}
          </div>
        </label>
        <div className={styles.greetingMsg}>Hello {name}</div>
      </motion.div>
      <div className={styles.infoLayout}>
        <Formik
          initialValues={profileData}
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
                  errors
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
                <Grid xs={8}>
                  <Button
                    style={{minWidth: "150px"}}
                    type="submit"
                    color="primary"
                    size="medium"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </div>
    </Stack>
  );
};

const profileValidationSchema = object().shape({
  name: string().required("Required field"),
  email: string().email("Invalid email").required("Required field"),
  address: string().required("Required field"),
  city: string(),
  state: string(),
  pin: string(),
});
