import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Button, Grid, TextField} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import {Formik} from "formik";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {object, string} from "yup";

import {AppContext} from "../../App/App";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {APP_ACTIONS} from "../../shared/immutables";
import styles from "./AddressConfirmation.module.scss";

function AddressConfirmation({handleDelivery}) {
  const initialAddressData = {
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  };

  const [addressInfo, setAddressInfo] = useState(initialAddressData);
  const [hasAddress, setHasAddress] = useState(false);

  const navigate = useNavigate();

  const {appState, dispatchAppAction} = useContext(AppContext);
  useEffect(() => {
    getUserAddress();
  }, [appState]);

  function getUserAddress() {
    const user = appState.user ?? {};
    const addresses = user.addresses ?? [];
    const primaryAdd =
      addresses.find((address) => !!address?.default) ?? addresses[0];
    setHasAddress(!!primaryAdd);
    const profile = {
      addressLine1: primaryAdd?.addressLine1,
      city: primaryAdd?.city,
      state: primaryAdd?.state,
      pincode: primaryAdd?.pincode,
    };
    setAddressInfo({...addressInfo, ...profile});
  }

  const handleCancel = () => {
    // go back to previos route
    navigate(-1);
  };

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);
    const addressData = {
      addressLine1: values.addressLine1,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
    };
    axios
      .post(`${environment.API_URL}/cart/address`, {address: addressData})
      .then(({data}) => {
        dispatchAppAction({
          type: APP_ACTIONS.UPDATE_ADDRESS,
          data: addressData,
        });
        actions.setSubmitting(false);
        setHasAddress(true);
        setAddressInfo({...addressInfo, ...addressData});
      })
      .catch((error) => console.log(error))
      .finally(() => actions.setSubmitting(false));
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
      <Grid item xs={width}>
        <TextField
          name={name}
          label={label}
          size="small"
          variant="outlined"
          fullWidth
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
    <div>
      {hasAddress ? (
        <>
          <div className={styles.address}>
            Address: {addressInfo.addressLine1}, {addressInfo.city},
            {addressInfo.state}, PIN: {addressInfo.pincode}
          </div>
          <div className={styles.buttons}>
            <Button variant="contained" size="small" onClick={handleDelivery}>
              Deliver to this Address
            </Button>
            <Button
              style={{minWidth: "100px"}}
              variant="outlined"
              size="small"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.layout}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Add delivery Address</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Formik
                initialValues={addressInfo}
                onSubmit={(values, actions) => handleSubmit(values, actions)}
                validationSchema={addValidationSchema}
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
                        "addressLine1",
                        "Address",
                        values,
                        handleChange,
                        handleBlur,
                        touched,
                        errors
                      )}
                      {TextWrappedInGrid(
                        4,
                        "city",
                        "City",
                        values,
                        handleChange,
                        handleBlur,
                        touched,
                        errors
                      )}
                      {TextWrappedInGrid(
                        4,
                        "state",
                        "State",
                        values,
                        handleChange,
                        handleBlur,
                        touched,
                        errors
                      )}
                      {TextWrappedInGrid(
                        4,
                        "pincode",
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
                          disabled={isSubmitting}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </div>
  );
}

const addValidationSchema = object().shape({
  addressLine1: string().required("Required field"),
  city: string().required("Required field"),
  state: string().required("Required field"),
  pincode: string().required("Required field"),
});

export default AddressConfirmation;
