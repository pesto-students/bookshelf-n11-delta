import {Stack} from "@mui/material";
import React from "react";

import styles from "./Footer.module.scss";

function FooterLayout() {
  const links = [
    {title: "ABOUT US", href: ""},
    {title: "TERMS & CONDITIONS", href: ""},
    {title: "COPYRIGHT", href: ""},
    {title: "FACEBOOK", href: ""},
  ];

  return (
    <div className={styles.footer}>
      <div className={styles.info}>
        <div className={styles.heading}>&copy; Bookshelf 2021</div>
        <div className={styles.body}>
          Bookshelf is founded in 2021 and gives one stop solution to books need
          of user where they can place order and check all there orders
        </div>
      </div>
      <div className={styles.links}>
        <Stack spacing={1}>
          {links.map((link, index) => (
            <a key={index} href={link.href} target="_blank">
              {link.title}
            </a>
          ))}
        </Stack>
      </div>
    </div>
  );
}

export const Footer = React.memo(FooterLayout);
