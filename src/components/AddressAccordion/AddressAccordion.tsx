import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Button, Grid, TextField} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import {Formik} from 'formik';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {object, string} from 'yup';

import {AuthThunks, useAppDispatch} from '../../redux';
import {UserAddress} from '../../shared/models';
import styles from './AddressAccordion.module.scss';

function AddressAccordion(props) {
  let initialAddressData = {
    _id: undefined,
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  };

  const [expanded, setExpanded] = useState(true);
  const [addressInfo, setAddressInfo] = useState(initialAddressData);

  const handleChange = () => {
    setExpanded(prevExpState => !prevExpState);
  };

  const dispatch = useAppDispatch();
  const {onCloseHandler, userAddress} = props;

  useEffect(() => {
    if (userAddress) {
      const address = {...addressInfo, ...userAddress};
      address.pincode = `${address.pincode}`;

      setAddressInfo(address);
    }
  }, [userAddress]);

  const handleCancel = () => {
    onCloseHandler();
  };

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(true);
    const addressData: UserAddress = {
      addressLine1: values.addressLine1,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
      default: false,
    };

    if (userAddress?._id) {
      // edit
      addressData._id = userAddress._id;
      dispatch(AuthThunks.editUserAddress(addressData))
        .unwrap()
        .then(() => {
          afterAddressUpsert(actions, 'Address details updated successfully');
        })
        .catch(() => {
          afterAddressUpsert(actions);
        });
    } else {
      // add
      dispatch(AuthThunks.addUserAddress(addressData))
        .unwrap()
        .then(() => {
          afterAddressUpsert(actions, 'New Address details added');
        })
        .catch(() => {
          afterAddressUpsert(actions);
        });
    }
  };

  const afterAddressUpsert = (actions, message?: string) => {
    actions.setSubmitting(false);
    if (!!message) {
      toast.success(message);
    }
    handleCancel();
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
    <Accordion
      elevation={0}
      expanded={expanded}
      onChange={handleChange}
      className={styles.accordion}
    >
      <AccordionSummary
        aria-controls="delivery-address"
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>
          {addressInfo?._id ? 'Edit Address' : 'Add delivery Address'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Formik
          enableReinitialize
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
                  'Area/Street',
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
                  'Pincode',
                  values,
                  handleChange,
                  handleBlur,
                  touched,
                  errors,
                )}
                <Grid item xs={12} className={styles.buttons}>
                  <Button
                    type="submit"
                    color="primary"
                    size="medium"
                    variant="contained"
                    aria-label="save"
                    disabled={isSubmitting}
                  >
                    SAVE
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    disabled={isSubmitting}
                    aria-label="cancel"
                    onClick={onCloseHandler}
                  >
                    CANCEL
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </AccordionDetails>
    </Accordion>
  );
}

const addValidationSchema = object().shape({
  addressLine1: string().required('Required field'),
  city: string().required('Required field'),
  state: string().required('Required field'),
  pincode: string().required('Required field'),
});

export default AddressAccordion;
