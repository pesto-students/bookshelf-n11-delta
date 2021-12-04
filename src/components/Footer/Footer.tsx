import React from "react";
import styles from "./Footer.module.scss";

function FooterLayout() {
  return <div className={styles.footer}></div>;
}

export const Footer = React.memo(FooterLayout);
