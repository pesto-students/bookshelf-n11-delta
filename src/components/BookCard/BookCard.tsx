import {makeStyles} from '@material-ui/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';

import {MemoizedRatingBox} from '../../shared/components';
import {HTML_SPECIAL_CHARS} from '../../shared/immutables';
import styles from './BookCard.module.scss';

const useStyles = makeStyles(() => ({
  media: {
    margin: 'auto',
    objectFit: 'contain !important' as 'contain',
    maxHeight: '350px',
  },
}));

export const BookCard = props => {
  const classes = useStyles();
  const navigate = useNavigate();

  const {_id, title, price, author, language, imageUri, avgRating} = props.book;
  const desc = [language, author].join(',');
  return (
    <Paper elevation={3}>
      <motion.div
        className={styles.card}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.9}}
        onClick={() => {
          navigate(`/books/${_id}`, {
            state: {
              book: props.book,
            },
          });
        }}
      >
        <Card sx={{width: 336}}>
          <CardMedia
            className={classes.media}
            component="img"
            image={imageUri}
            alt={title}
          />
          <CardContent>
            <Tooltip title={title}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                className={styles.truncate}
              >
                {title}
              </Typography>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {desc}
            </Typography>
            <MemoizedRatingBox rating={avgRating} />
            <Typography sx={{fontWeight: 'bold'}}>
              {HTML_SPECIAL_CHARS.RUPEE} {price}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Paper>
  );
};
