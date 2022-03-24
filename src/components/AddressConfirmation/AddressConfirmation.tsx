import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Button, Grid, TextField} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {object, string} from 'yup';

import {AuthThunks, useAppDispatch, useAppSelector} from '../../redux';
import styles from './AddressConfirmation.module.scss';

function AddressConfirmation({handleDelivery}) {
  const initialAddressData = {
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  };

  const [addressInfo, setAddressInfo] = useState(initialAddressData);
  const [hasAddress, setHasAddress] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  useEffect(() => {
    getUserAddress();
  }, []);

  function getUserAddress() {
    const addresses = currentUser?.addresses ?? [];
    const primaryAdd =
      addresses.find(address => !!address?.default) ?? addresses[0];
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
      default: true,
    };

    dispatch(AuthThunks.addUserAddress(addressData))
      .unwrap()
      .then(() => {
        setHasAddress(true);
        setAddressInfo({...addressInfo, ...addressData});
      })
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
    errors,
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
    <>
      {hasAddress ? (
        <>
          <div className={styles.address}>
            <div className={styles.title}>Address: </div>
            <div>
              {addressInfo.addressLine1}, {addressInfo.city}
            </div>
            <div>
              {addressInfo.state}, PIN: {addressInfo.pincode}
            </div>
          </div>
          <div className={styles.buttons}>
            <Button
              variant="contained"
              size="small"
              onClick={handleDelivery}
              aria-label="deliver"
            >
              DELIVER TO THIS ADDRESS
            </Button>
            <Button
              style={{minWidth: '100px'}}
              variant="outlined"
              size="small"
              onClick={handleCancel}
              aria-label="cancel"
            >
              CANCEL
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
                        'addressLine1',
                        'Address',
                        values,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                      )}
                      {TextWrappedInGrid(
                        4,
                        'city',
                        'City',
                        values,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                      )}
                      {TextWrappedInGrid(
                        4,
                        'state',
                        'State',
                        values,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                      )}
                      {TextWrappedInGrid(
                        4,
                        'pincode',
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
                          variant="contained"
                          aria-label="save"
                          disabled={isSubmitting}
                        >
                          SAVE
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
    </>
  );
}

const addValidationSchema = object().shape({
  addressLine1: string().required('Required field'),
  city: string().required('Required field'),
  state: string().required('Required field'),
  pincode: string().required('Required field'),
});

export default AddressConfirmation;
