import {Button, Divider, Paper} from "@mui/material";
import {useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {AppContext} from "../../App/App";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {BookCartTile} from "../../shared/components";
import {APP_ACTIONS} from "../../shared/immutables";
import styles from "./CartList.module.scss";

export const CartList = () => {
  const navigate = useNavigate();

  const {appState, dispatchAppAction} = useContext(AppContext);

  const qtyUpdate = (id, value) => {
    const orderDetails = [];
    appState.cartItems.forEach((item) => {
      if (item._id === id && value === 0) {
        // don't add anything to cart Item
      } else {
        const quantity = item._id === id ? value : item.qtyOrdered;
        orderDetails.push({
          bookId: item._id,
          price: item.price,
          quantity,
        });
      }
    });
    axios
      .patch(`${environment.API_URL}/cart`, {orderDetails})
      .then(() =>
        dispatchAppAction({type: APP_ACTIONS.UPDATE_CART, data: {id, value}})
      )
      .catch((err) => console.log(err));
  };

  const checkout = () => {
    navigate("/buy", {
      state: {
        cartItems: appState.cartItems,
      },
    });
  };

  return (
    <div className={styles.layout}>
      <Paper elevation={2}>
        <div className={styles.header}>
          <div className={styles.title}>
            My Cart ({appState.cartItems.length})
          </div>
          <Button
            variant="contained"
            onClick={checkout}
          >
            Proceed to Checkout
          </Button>
        </div>
        <Divider />
        {appState.cartItems.map((item) => (
          <div key={item.id}>
            <BookCartTile
              item={item}
              qtyUpdate={(id, value) => qtyUpdate(id, value)}
              showDelete={true}
            />
          </div>
        ))}
      </Paper>
    </div>
  );
};
