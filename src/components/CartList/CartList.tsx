import {Button, Divider, Paper} from "@mui/material";
import {useContext} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";

import {AppContext} from "../../App/App";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {BookCartTile} from "../../shared/components";
import {APP_ACTIONS} from "../../shared/immutables";
import styles from "./CartList.module.scss";
import emptyCart from "../../assets/empty-cart.jpeg"
export const CartList = () => {
  const navigate = useNavigate();

  const {
    appState: {cartItems},
    dispatchAppAction,
  } = useContext(AppContext);

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
      },
    });
  };

  return (
    <div className={styles.layout}>
      <Paper elevation={2}>
        <div className={styles.header}>
          <div className={styles.title}>
            My Cart ({cartItems.length})
          </div>
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
              <div className={styles.msg}>
                Your cart is currently empty
              </div>
              <Button className={styles.btn} component={Link} to="/" variant="contained">
                CONTINUE SHOPPING
              </Button>
            </div>
        )}
      </Paper>
    </div>
  );
};
