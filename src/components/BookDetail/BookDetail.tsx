import {
  Button,
  ButtonProps,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import {useEffect, Fragment} from "react";
import env from "react-dotenv";
import {AnyObject} from "yup/lib/object";

import axios from "../../core/axios";
import {MemoizedRatingBox, Overlay, ReadMore} from "../../shared/components";
import {HTML_SPECIAL_CHARS} from "../../shared/immutables";
import {Book} from "../../shared/models";
import styles from "./BookDetail.module.scss";

export const BookDetail = () => {
  let book: Book = {
    _id: "61a5e8e707f9c7a5238f9e31",
    title: "Javascript for beginners",
    description:
      "Javascript for beginners Javascript for beginners Javascript for beginners Javascript for beginners",
    language: "english",
    category: "abc",
    author: "alisha mahajan",
    quantity: 12,
    price: 620,
    imageUri: "https://reactjs.org/logo-og.png",
    highlights: ["alisha", "alisha", "alisha"],
    pages: 235,
    rating: 4.5,
  };

  let details: AnyObject[] = [];
  const buttonWidth = "140px";

  const AddToCartButton = styled(Button)<ButtonProps>(() => ({
    backgroundColor: "#f44336",
    marginRight: "16px",
    width: buttonWidth,
  }));

  useEffect(() => {
    getBookDetails();
  }, []);

  createDetails();
  function getBookDetails() {
    // error while using react router dom param
    // const {id} = useParams();
    const id = "61a5e8e707f9c7a5238f9e31";
    // here problem accessing env
    console.log(env);
    axios
      .get(`http://localhost:4000/book/${id}`)
      .then(({data}) => {
        book = data;
        createDetails();
      })
      .catch((error) => {
        console.log(error);
        createDetails();
      });
  }

  function createDetails() {
    details = [
      {
        key: "language",
        value: book.language,
      },
      {
        key: "author",
        value: book.author,
      },
      {
        key: "category",
        value: book.category,
      },
    ];
  }

  const gridRow = (key, value) => {
    return (
      <Grid direction="row" spacing={4} className={styles.detailRow}>
        <Grid xs={4}>
          <span className={styles.key}>{key}</span>
        </Grid>
        <Grid xs={8}>{value}</Grid>
      </Grid>
    );
  };

  return (
    <div className={styles.layout}>
      {!!book ? (
        <>
          <div className={styles.imageLayout}>
            <div className={styles.imageBox}>
              <img src={book.imageUri} alt={book.title} />
            </div>
            <div className={styles.buttons}>
              <AddToCartButton variant="contained" color="secondary">
                ADD TO CART
              </AddToCartButton>
              <Button style={{width: buttonWidth}} variant="contained">
                BUY NOW
              </Button>
            </div>
          </div>
          <Stack spacing={1} className={styles.description}>
            <div className={styles.title}>{book.title}</div>
            <MemoizedRatingBox rating={book.rating} />
            <Typography sx={{fontWeight: "bold", fontSize: "24px"}}>
              {HTML_SPECIAL_CHARS.RUPEE} {book.price}
            </Typography>
            <div className={styles.tabularDetails}>
              {details.map((detail, index) => (
                <Fragment key={index}>
                  {gridRow(detail.key, <span>{detail.value}</span>)}
                </Fragment>
              ))}
              {book.highlights &&
                gridRow(
                  "highlights",
                  <ul className={styles.bookHighlights}>
                    {book.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
              {gridRow("description", <ReadMore>{book.description}</ReadMore>)}
            </div>
          </Stack>
        </>
      ) : (
        <Overlay showBackdrop={true} />
      )}
    </div>
  );
};
