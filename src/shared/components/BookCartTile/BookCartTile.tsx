import {useNavigate} from 'react-router-dom';

import {HTML_SPECIAL_CHARS} from '../../immutables';
import {CartItem} from '../../models';
import {QuantityPicker} from '../QuantityPicker/QuantityPicker';
import styles from './BookCartTile.module.scss';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

export const BookCartTile = ({
  item,
  qtyUpdate,
  showDelete,
}: {
  item: Partial<CartItem>;
  qtyUpdate: (id, value) => void;
  showDelete: boolean;
}) => {
  const navigate = useNavigate();

  const getBookDetails = item => {
    const bookItem = {...item};
    delete bookItem.id;
    delete bookItem.qtyOrdered;
    delete bookItem.createdOn;
    delete bookItem.modifiedOn;
    return bookItem;
  };

  const handleTitleClick = () => {
    const book = getBookDetails(item);
    navigate(`/books/${item._id}`, {
      state: {
        book,
      },
    });
  };

  return (
    <div className={styles.bookTile}>
      <div className={styles.image}>
        <img src={item.imageUri} className={styles.photo} />
        <div className={styles.quantity}>
          <QuantityPicker
            qty={item.qtyOrdered}
            max={item.quantity}
            setQty={value => {
              qtyUpdate(item._id, value);
            }}
          />
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.title} onClick={handleTitleClick}>
          {item.title}
        </div>
        <div className={styles.info}>
          {item.language}, {item.author}
        </div>
        <div className={styles.info}>
          {HTML_SPECIAL_CHARS.RUPEE} {item.price}
        </div>
        {showDelete && (
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            aria-label="delete"
            onClick={() => qtyUpdate(item._id, 0)}
            className={styles.deleteBtn}
          >
            DELETE
          </Button>
        )}
      </div>
    </div>
  );
};
