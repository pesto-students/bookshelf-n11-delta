import {Button, Grid, styled, TextField} from "@mui/material";
import {Formik} from "formik";
import ChipInput from "material-ui-chip-input";
import {useState} from "react";
import {toast} from "react-toastify";
import {number, object, string} from "yup";

import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {Book} from "../../shared/models";
import styles from "./AddBook.module.scss";

toast.configure();
export const AddBook = () => {
  const [iconFile, setIconFile] = useState({
    file: "",
    url: "",
  });

  const [chips, setChips] = useState([]);

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
        onSubmit={(values, {setSubmitting, resetForm}) => {
          setSubmitting(true);
          const data = new FormData();
          data.append("bookImage", iconFile.file);
          data.append("title", values.title);
          data.append("author", values.author);
          data.append("pages", `${values.pages}`);
          data.append("description", values.description);
          data.append("quantity", `${values.quantity}`);
          data.append("category", values.category);
          data.append("price", `${values.price}`);
          data.append("language", values.language);
          data.append("highlights", values.highlights?.toString());

          axios
            .post(`${environment.API_URL}/upload/book`, data)
            .then(({data}) => {
              toast.success(data.message);
              setSubmitting(false);
              resetForm();
              setIconFile({file: "", url: ""});
              setChips([]);
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
                  helperText={touched.title && errors.title}
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
                  helperText={touched.author && errors.author}
                />
              </Grid>
              <Grid item xs={3}>
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
                  helperText={touched.quantity && errors.quantity}
                />
              </Grid>
              <Grid item xs={3}>
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
                  helperText={touched.price && errors.price}
                />
              </Grid>
              <Grid item xs={3}>
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
                  helperText={touched.pages && errors.pages}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  className={styles.textField}
                  label="Language"
                  name="language"
                  size="small"
                  variant="outlined"
                  value={values.language}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.language && !!errors?.language}
                  helperText={touched.language && errors.language}
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
                  helperText={touched.description && errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <ChipInput
                  fullWidth
                  label="Highlights"
                  variant="outlined"
                  defaultValue={chips}
                  onChange={(value) => {
                    setChips(value);
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
  language: string().required("Required field"),
  description: string().required("Required field"),
  quantity: number().required("Required field").min(0),
  price: number().required("Required field").min(0),
  pages: number().required("Required field").min(0),
});
