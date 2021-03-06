import {
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import environment from '../../Environment/environment';
import {Overlay} from '../../shared/components';
import styles from './Admin.module.scss';

export const AdminHome = () => {
  // State for saving User records to display
  // and to implement pagination in table
  const [userRecords, setUserRecords] = useState([]);
  const [bookRecords, setBookRecords] = useState([]);
  const [searched, setSearched] = useState('');

  useEffect(() => {
    fetch(`${environment.API_URL}/users/bytimestamp?page=1&limit=5`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(response => {
        setUserRecords(response.users);
      })
      .catch(error => console.error(error));

    fetch(`${environment.API_URL}/books/bytimestamp?page=1&limit=5`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(response => {
        setBookRecords(response.books);
      })
      .catch(error => console.error(error));
  }, [searched]);

  // return the view
  return (
    <>
      {!!userRecords.length && !!bookRecords.length ? (
        <Paper className={styles.layout} elevation={2}>
          <Grid container rowSpacing={5}>
            <Grid item xs={12}>
              <div
                style={{
                  border: '2px solid #e5e5e5',
                  padding: '25px',
                  borderRadius: '5px',
                }}
              >
                <Stack direction="column" spacing={2}>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h5">Recent Users</Typography>
                    <Button
                      component={Link}
                      to="/users"
                      variant="contained"
                      size="small"
                      aria-label="view-all-users"
                      style={{
                        paddingLeft: '25px',
                        paddingRight: '25px',
                        backgroundColor: '#3f51b5',
                      }}
                    >
                      VIEW ALL
                    </Button>
                  </Stack>
                  <Paper elevation={0}>
                    <TableContainer>
                      <Table
                        size="small"
                        aria-label="a dense table"
                        sx={{
                          [`& .${tableCellClasses.root}`]: {
                            borderBottom: 'none',
                          },
                        }}
                      >
                        <TableHead
                          style={{backgroundColor: '#8e99d7', color: ''}}
                        >
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="right">Username</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Address Line 1</TableCell>
                            <TableCell align="right">City</TableCell>
                            <TableCell align="right">State</TableCell>
                            <TableCell align="right">Pincode</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userRecords.map((row, index) => (
                            <TableRow
                              key={row._id}
                              style={
                                index % 2
                                  ? {background: '#EDEDEF'}
                                  : {background: 'white'}
                              }
                            >
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell align="right">
                                {row.username}
                              </TableCell>
                              <TableCell align="right">{row.email}</TableCell>
                              <TableCell align="right">
                                {row.addresses?.[0]?.addressLine1}
                              </TableCell>
                              <TableCell align="right">
                                {row.addresses?.[0]?.city}
                              </TableCell>
                              <TableCell align="right">
                                {row.addresses?.[0]?.state}
                              </TableCell>
                              <TableCell align="right">
                                {row.addresses?.[0]?.pincode}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Stack>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  border: '2px solid #e5e5e5',
                  padding: '25px',
                  borderRadius: '5px',
                }}
              >
                <Stack direction="column" spacing={2}>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h5">Recent Books</Typography>
                    <Button
                      component={Link}
                      to="/books"
                      variant="contained"
                      size="small"
                      aria-label="view-all-books"
                      style={{
                        paddingLeft: '25px',
                        paddingRight: '25px',
                        backgroundColor: '#3f51b5',
                      }}
                    >
                      VIEW ALL
                    </Button>
                  </Stack>
                  <Paper elevation={0}>
                    <TableContainer>
                      <Table
                        size="small"
                        aria-label="a dense table"
                        sx={{
                          [`& .${tableCellClasses.root}`]: {
                            borderBottom: 'none',
                          },
                        }}
                      >
                        <TableHead style={{backgroundColor: '#8e99d7'}}>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Author</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bookRecords.map((row, index) => (
                            <TableRow
                              key={row._id}
                              style={
                                index % 2
                                  ? {background: '#EDEDEF'}
                                  : {background: 'white'}
                              }
                            >
                              <TableCell component="th" scope="row">
                                {index + 1}
                              </TableCell>
                              <TableCell align="right">{row.title}</TableCell>
                              <TableCell align="right">{row.author}</TableCell>
                              <TableCell align="right">
                                {row.quantity}
                              </TableCell>
                              <TableCell align="right">{row.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Stack>
              </div>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Overlay showBackdrop={true} />
      )}
    </>
  );
};
