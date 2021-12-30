import {Stack} from "@mui/material";
import {memo} from "react";

import styles from "./Footer.module.scss";

function FooterLayout() {
  const links = [
    {title: "ABOUT US", href: "/about-us"},
    {title: "TERMS & CONDITIONS", href: "/terms"},
    {title: "PAYMENTS", href: "/payments"},
  ];

  return (
    <div className={styles.footer}>
      <div className={styles.info}>
        <div className={styles.heading}>&copy; Bookshelf 2021</div>
        <div className={styles.body}>
          Bookshelf is founded in 2021 and gives one stop solution to books need
          of user where they can find books they need which will be delivered to 
          their door, place order and do payments with ease and check all there
          orders history.
        </div>
      </div>
      <div className={styles.links}>
        <Stack spacing={1}>
          {links.map((link, index) => (
            <a key={index} href={link.href} target="_blank" rel="noreferrer">
              {link.title}
            </a>
          ))}
        </Stack>
      </div>
    </div>
  );
}

export const Footer = memo(FooterLayout);
