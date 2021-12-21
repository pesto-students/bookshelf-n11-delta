import {useContext} from "react";
import {CartContext} from "../../../components";
import {CART_ACTIONS, HTML_SPECIAL_CHARS} from "../../immutables";
import {CartItem} from "../../models";
import {QuantityPicker} from "../QuantityPicker/QuantityPicker";
import styles from "./BookCartTile.module.scss";

export const BookCartTile = ({item}) => {
  const {cartState, dispatchCartActions} = useContext(CartContext);

  // useEffect(() => {
  //   effect
  // }, [input])

  return (
    <div className={styles.bookTile}>
      <div className={styles.image}>
        <img src={item.imageUri} className={styles.photo} />
        <div className={styles.quantity}>
          <QuantityPicker
            qty={item.qtyOrdered}
            max={item.quantity}
            setQty={(value) => {
              dispatchCartActions({
                type: CART_ACTIONS.UPDATE_QTY,
                data: {id: item._id, value},
              });
            }}
          />
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.info}>{item.language}, {item.author}</div>
        <div className={styles.info}>
          {HTML_SPECIAL_CHARS.RUPEE} {item.price}
        </div>
      </div>
    </div>
  );
};
