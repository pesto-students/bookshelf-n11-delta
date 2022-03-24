import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

import {HTML_SPECIAL_CHARS} from '../../immutables';
import {CartItem} from '../../models';
import {QuantityPicker} from '../QuantityPicker/QuantityPicker';
import styles from './BookCartTile.module.scss';

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

  const handleTitleClick = () => {
    navigate(`/books/${item.book._id}`);
  };

  return (
    <div className={styles.bookTile}>
      <div className={styles.image}>
        <img src={item.book.imageUri} className={styles.photo} />
        <div className={styles.quantity}>
          <QuantityPicker
            qty={item.quantity}
            max={item.book.quantity}
            setQty={value => {
              qtyUpdate(item.book._id, value);
            }}
          />
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.title} onClick={handleTitleClick}>
          {item.book.title}
        </div>
        <div className={styles.info}>
          {item.book.language}, {item.book.author}
        </div>
        <div className={styles.info}>
          {HTML_SPECIAL_CHARS.RUPEE} {item.price}
        </div>
        {showDelete && (
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            aria-label="delete"
            onClick={() => qtyUpdate(item.book._id, 0)}
            className={styles.deleteBtn}
          >
            DELETE
          </Button>
        )}
      </div>
    </div>
  );
};
