import {useState} from "react";
import styles from "./ReadMore.module.scss";

export const ReadMore = (props) => {
  const text = props.children;
  const limit = props.limit ?? 100;
  const needsReadMoreOption = text.length > limit;

  const [isReadMore, setIsReadMore] = useState(true);

  return (
    <p className={styles.text}>
      {needsReadMoreOption ? (
        <>
          {isReadMore ? text.slice(0, limit) : text}
          <span
            onClick={() => setIsReadMore(!isReadMore)}
            className={styles.readOrHide}
          >
            {isReadMore ? "  ...Read more" : "  Show less"}
          </span>
        </>
      ) : (
        text
      )}
    </p>
  );
};
