import {Button, Divider, Paper} from "@mui/material";
import {useContext, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

import {AppContext} from "../../App/App";
import emptyCart from "../../assets/empty-cart.jpeg";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {BookCartTile} from "../../shared/components";
import {OrderTypes} from "../../shared/enums";
import {APP_ACTIONS, DASHBOARD_ROUTE} from "../../shared/immutables";
import styles from "./CartList.module.scss";

export const CartList = () => {
  const navigate = useNavigate();

  const {
    appState: {cartItems, isUserLoggedIn},
    dispatchAppAction,
  } = useContext(AppContext);

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate(DASHBOARD_ROUTE);
    }
  }, [isUserLoggedIn]);

  const qtyUpdate = (id, value) => {
    const orderDetails = [];
    cartItems.forEach((item) => {
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
        cartItems,
        orderType: OrderTypes.CART,
      },
    });
  };

  return (
    <Paper className={styles.layout} elevation={2}>
      <div className={styles.header}>
        <div className={styles.title}>My Cart ({cartItems.length})</div>
        <Button
          variant="contained"
          onClick={checkout}
          disabled={!cartItems.length}
        >
          Proceed to Checkout
        </Button>
      </div>
      <Divider />
      {cartItems.length ? (
        cartItems.map((item) => (
          <div key={item.id}>
            <BookCartTile
              item={item}
              qtyUpdate={(id, value) => qtyUpdate(id, value)}
              showDelete={true}
            />
          </div>
        ))
      ) : (
        <div className={styles.emptyCart}>
          <img src={emptyCart} alt="empty-cart" className={styles.banner} />
          <div className={styles.msg}>Your cart is currently empty</div>
          <Button
            className={styles.btn}
            component={Link}
            to="/"
            variant="contained"
          >
            CONTINUE SHOPPING
          </Button>
        </div>
      )}
    </Paper>
  );
};
