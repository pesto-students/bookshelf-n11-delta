import {Button} from "@mui/material";
import {Link} from "react-router-dom";
import notFound from "../../assets/not-found.png";
import styles from "./NotFound.module.scss";

export const NotFound = () => {
  return (
    <div className={styles.layout}>
      <img src={notFound} alt="notFound" className={styles.banner} />
      <div className={styles.msg}>
        Unfortunately the page you are looking for has either been moved (or deleted) or does not exist
      </div>
      <Button className={styles.btn} component={Link} to="/" variant="contained">
        GO TO HOMEPAGE
      </Button>
    </div>
  );
};
