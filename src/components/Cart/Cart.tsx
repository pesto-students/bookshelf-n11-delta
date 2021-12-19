import {Box, Button} from "@mui/material";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {useLocation} from "react-router-dom";

import {AppContext} from "../../App/App";
import {CartReducer} from "../../reducers";
import {BookCartTile} from "../../shared/components";
import {Price} from "../Price/Price";
import styles from "./Cart.module.scss";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AddressConfirmation from "../AddressConfirmation/AddressConfirmation";

export const CartContext = createContext(null);
const steps = ["Delivery Address", "Place Order"];

export const Cart = () => {
  const location = useLocation();

  const {appState} = useContext(AppContext);
  const initialState = {products: location.state.cartItems};
  const [cartState, dispatchCartActions] = useReducer(
    CartReducer,
    initialState
  );

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const [address, setAddress] = useState(null);

  useEffect(() => {
    const addresses = appState.user?.addresses ?? [];
    const primaryAdd =
      addresses.find((address) => !!address?.default) ?? addresses[0];
    if (!!primaryAdd) {
      const locationAdd = `${primaryAdd.addressLine1}, ${primaryAdd.city}, ${primaryAdd.state}, PIN: ${primaryAdd.pincode}`;
      setAddress(locationAdd);
    }
  }, [appState]);

  return (
    <>
      <Box className={styles.stepper}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <div className={styles.layout}>
        <CartContext.Provider value={{cartState, dispatchCartActions}}>
          <div className={styles.leftLayout}>
            {activeStep === 0 ? (
              <div className={styles.borderLayoutBox}>
              <AddressConfirmation handleDelivery={handleNext}/>
              </div>
            ) : (
              <>
                {cartState.products.map((item) => (
                  <div key={item.id}>
                    <BookCartTile item={item} />
                  </div>
                ))}

                <div className={styles.borderLayoutBox}>
                  <div>
                    Order confirmation will be sent to:{" "}
                    <span className={styles.boldText}>{appState.user?.email}</span>
                  </div>
                  <Button variant="contained" size="small">
                    PLACE ORDER
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className={styles.priceColumn}>
            <Price deliveryFee="0" address={address} />
          </div>
        </CartContext.Provider>
      </div>
    </>
  );
};
