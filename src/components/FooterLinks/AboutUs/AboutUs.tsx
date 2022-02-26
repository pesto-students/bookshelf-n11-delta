import {Paper} from '@mui/material';
import {memo} from 'react';
import {Grid, Typography} from '@mui/material';
import {Fragment} from 'react';
import logo from '../../../assets/bookshelf.svg';
import styles from './AboutUs.module.scss';

const phrases = [
  {
    label: 'We Are',
    logo: 'https://unfold.co/wp-content/uploads/we-are.png',
    words: [
      'Humans',
      'Bookshelf Owners',
      'Designers',
      'Front-End Developers',
      'Artists',
      'Warehouse organiser',
      'Specialists',
    ],
  },
  {
    label: 'We Are Not',
    logo: 'https://unfold.co/wp-content/uploads/we-are-not.png',
    words: [
      'Robots',
      'Corporate',
      'Dinosaurs',
      'Freelancers',
      'Cookie Cutters',
      'Your Mama',
    ],
  },
  {
    label: 'What We Do',
    logo: 'https://unfold.co/wp-content/uploads/what-we-do.png',
    words: [
      'Serve user',
      'Provide nice UI / UX experience',
      'Web App',
      'Process Orders',
      'Ship orders',
      'Deliver books',
    ],
  },
];

const AboutUsComp = () => {
  return (
    <Paper className={styles.layout} elevation={2}>
      <Grid container flex={1} flexDirection="column">
        <div className={styles.imgContainer} style={{}}>
          <div className={styles.branding}>
            <img
              src={logo}
              alt="bookshelf-logo"
              className={styles.bookshelfLogo}
            />
            <Typography variant="subtitle1">
              One place solution for all your book needs
            </Typography>
          </div>
        </div>
        <div className={styles.brandingMotto}>
          <Grid
            container
            flexDirection="column"
            rowSpacing={4}
            width="auto"
            maxWidth="500px"
            marginLeft="40%"
          >
            <Grid item>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="rgb(68, 68, 68)"
              >
                In search of a book,
                <br />
                just explore our site
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" color="rgb(103, 103, 103)">
                We provide one stop solution to all your book needs in
                affordable price. Creating a place that cuts doun user hassle to
                visit various places in search of books.
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div className={styles.whoWeAre}>
          <Grid container style={{maxWidth: '1000px', margin: 'auto'}}>
            {phrases.map((item, index) => {
              return (
                <Grid
                  key={index}
                  item
                  container
                  xs
                  flexDirection="column"
                  rowSpacing={2}
                  padding="6%"
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? 'rgba(202, 209, 217, 0.2)' : '#fff',
                  }}
                >
                  <Grid item container columnSpacing={1} alignItems="center">
                    <Grid item>
                      <img
                        src={item.logo}
                        alt="logo"
                        height="24px"
                        width="auto"
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" color="rgb(68, 68, 68)">
                        {item.label}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" color="rgb(103, 103, 103)">
                      {item.words.map((word, nestedIndex) => {
                        return (
                          <Fragment key={nestedIndex}>
                            {word}
                            <br />
                          </Fragment>
                        );
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Grid>
    </Paper>
  );
};

const AboutUs = memo(AboutUsComp);
export default AboutUs;
