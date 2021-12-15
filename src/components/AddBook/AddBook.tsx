import styles from "./AddBook.module.scss";
import {useState} from "react";
import {Button, Grid, styled, TextField} from "@mui/material";
import {Formik} from "formik";
import {Book} from "../../shared/models";
import axios from "../../core/axios";
import env from "react-dotenv";
import {number, object, string} from "yup";
import ChipInput from "material-ui-chip-input";

export const AddBook = () => {
  const [iconFile, setIconFile] = useState({
    file: "",
    url: "",
  });
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setIconFile({file: selectedFile, url: URL.createObjectURL(selectedFile)});
  };
  const initialBookValues = new Book();

  const Input = styled("input")({
    display: "none",
  });

  return (
    <div className={styles.layout}>
      <div className={styles.image}>
        <label htmlFor="avatar">
          <Input
            accept="image/*"
            id="avatar"
            type="file"
            onChange={onFileChange}
          />
          <div className={styles.imageUpload}>
            {!!iconFile.url && <img src={iconFile.url} />}
          </div>
        </label>
      </div>
      <Formik
        initialValues={initialBookValues}
        onSubmit={(values, {setSubmitting}) => {
          setSubmitting(true);
          axios
            .post(`${env.API_URL}/book`, {
              title: values.title,
              author: values.author,
            })
            .then(({data}) => {
              console.log(data);
            })
            .catch((error) => console.log(error))
            .finally(() => setSubmitting(false));
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  className={styles.textField}
                  name="title"
                  label="Title"
                  size="small"
                  variant="outlined"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && !!errors.title}
                  helperText={touched.title ? errors.title : " "}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={styles.textField}
                  name="author"
                  label="Author"
                  size="small"
                  variant="outlined"
                  value={values.author}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.author && !!errors.author}
                  helperText={touched.author ? errors.author : " "}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={styles.textField}
                  label="Quantity"
                  type="number"
                  name="quantity"
                  size="small"
                  variant="outlined"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputProps={{
                    inputProps: {min: 0},
                  }}
                  error={touched.quantity && !!errors?.quantity}
                  helperText={touched.quantity ? errors.quantity : " "}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={styles.textField}
                  label="Price"
                  type="number"
                  name="price"
                  size="small"
                  variant="outlined"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputProps={{
                    inputProps: {min: 0},
                  }}
                  error={touched.price && !!errors?.price}
                  helperText={touched.price ? errors.price : " "}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className={styles.textField}
                  label="Pages"
                  type="number"
                  name="pages"
                  size="small"
                  variant="outlined"
                  value={values.pages}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputProps={{
                    inputProps: {min: 0},
                  }}
                  error={touched.pages && !!errors?.pages}
                  helperText={touched.pages ? errors.pages : " "}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={styles.textField}
                  label="Description"
                  multiline
                  value={values.description}
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && !!errors?.description}
                  helperText={touched.description ? errors.description : " "}
                />
              </Grid>
              <Grid item xs={12}>
                <ChipInput
                  fullWidth
                  label="Highlights"
                  variant="outlined"
                  defaultValue={[]}
                  onChange={(chips) => {
                    initialBookValues.highlights = chips;
                  }}
                  helperText="Press Enter to add multiple items"
                />
              </Grid>
              <Grid item xs={8}>
                <Button
                  style={{marginTop: "8px"}}
                  type="submit"
                  color="primary"
                  size="medium"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Add Book to Catalogue
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </div>
  );
};

const validationSchema = object().shape({
  title: string().required("Required field"),
  author: string().required("Required field"),
  description: string().required("Required field"),
  quantity: number().required("Required field").min(0),
  price: number().required("Required field").min(0),
  pages: number().required("Required field").min(0),
});
