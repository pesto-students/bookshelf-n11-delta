import EditIcon from '@mui/icons-material/Edit';
import {Button, Radio} from '@mui/material';
import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useAppSelector} from '../../redux';
import {CART_ACTIONS} from '../../shared/immutables';
import AddressAccordion from '../AddressAccordion/AddressAccordion';
import {AddressDetails} from '../AddressDetails/AddressDetails';
import {CartContext} from '../Cart/Cart';
import styles from './AddressConfirmation.module.scss';

function AddressConfirmation({handleDelivery}) {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showAddAddBtn, setShowAddAddBtn] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState('');

  const currentUser = useAppSelector(state => state.auth.user);

  const {dispatchCartActions} = useContext(CartContext);

  useEffect(() => {
    getUserAddresses();
  }, []);

  function getUserAddresses() {
    if (currentUser?.addresses) {
      const addressDetails = [...currentUser.addresses];
      addressDetails.forEach(address => {
        address.showAccordion = false;
      });
      setAddresses(addressDetails);
    }
  }

  const showAccState = (id, showAcc) => {
    const add = addresses.find(address => address._id === id);
    add.showAccordion = showAcc;
    setAddresses([...addresses]);

    addresses.some(add => add.showAccordion);
  };

  const handleCancel = () => {
    // go back to previos route
    navigate(-1);
  };

  const handleAddressSelection = () => {
    const address = addresses.find(add => add._id === defaultAddress);
    dispatchCartActions({
      type: CART_ACTIONS.SET_DELIVERY_ADDRESS,
      data: address,
    });
    handleDelivery();
  };

  return (
    <div className={styles.addressLayout}>
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
              <Radio
                checked={defaultAddress === address._id}
                onChange={() => setDefaultAddress(address._id)}
                value={address._id}
                name="radio-buttons"
              />
              <div className={styles.details}>
                <AddressDetails address={address} />
                <EditIcon
                  className={styles.pencilIcon}
                  onClick={() => showAccState(address._id, true)}
                />
              </div>
            </div>
          ),
        )}
      <div className={styles.buttons}>
        <Button
          variant="contained"
          size="small"
          onClick={handleAddressSelection}
          aria-label="deliver"
          disabled={!defaultAddress || addresses.some(add => add.showAccordion)}
        >
          DELIVER TO SELECTED ADDRESS
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleCancel}
          aria-label="cancel"
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
}

export default AddressConfirmation;
