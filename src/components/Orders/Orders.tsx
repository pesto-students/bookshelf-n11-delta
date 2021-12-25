import {
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import moment from 'moment';
import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {AppContext} from '../../App/App';
import axios from '../../core/axios';
import environment from '../../Environment/environment';
import {Overlay} from '../../shared/components';
import {DASHBOARD_ROUTE} from '../../shared/immutables';
import styles from './Orders.module.scss';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {
    appState: {books, isUserLoggedIn},
  } = useContext(AppContext);

  useEffect(() => {
    getUserOrders();
  }, []);

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate(DASHBOARD_ROUTE);
    }
  }, [isUserLoggedIn]);

  const redirectToBooksPage = (id) => {
    const book = books.find((book) => book._id === id);
    if (!!book) {
      // redirect to books detail page
      navigate(`/books/${id}`, {
        state: {
          book,
        },
      });
    }
  };

  const getUserOrders = () => {
    setLoading(true);
    axios
      .get(`${environment.API_URL}/orders`)
      .then(({data}) => {
        setOrders(data.orders);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  // return the view
  return (
    <Container style={{marginTop: "30px", marginBottom: "30px"}}>
      <Stack direction="column">
        <Typography style={{marginLeft: "20px"}} variant="h5">
          My Orders
        </Typography>
        {isLoading ? (
          <Overlay showBackdrop={true} />
        ) : orders.length ? (
          orders.map((order) => (
            <Grid container rowSpacing={0} className={styles.orderOuterBox}>
              <Grid item xs={8}>
                <Paper elevation={0}>
                  <TableContainer>
                    <Table
                      size="small"
                      sx={{
                        tableLayout: "fixed",
                      }}
                    >
                      <TableHead style={{backgroundColor: "#757ce8"}}>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell align="right">Book Name</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.orderDetails.map((orderDetail, index) => (
                          <TableRow
                            key={orderDetail?.bookId?._id}
                            style={
                              index % 2
                                ? {background: "#EDEDEF"}
                                : {background: "white"}
                            }
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell
                              align="right"
                              style={{cursor: "pointer"}}
                              onClick={() =>
                                redirectToBooksPage(orderDetail?.bookId?._id)
                              }
                            >
                              {orderDetail?.bookId?.title}
                            </TableCell>
                            <TableCell align="right">
                              {orderDetail.price}
                            </TableCell>
                            <TableCell align="right">
                              {orderDetail.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper elevation={0} className={styles.orderInnerBox}>
                  <TableContainer>
                    <Table
                      size="small"
                      sx={{
                        tableLayout: "fixed",
                      }}
                    >
                      <TableBody>
                        <TableRow>
                          <TableCell>Order Value</TableCell>
                          <TableCell>{order.value}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Order Date</TableCell>
                          <TableCell>
                            {moment(order.createdOn).format("DD-MM-YYYY")}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Delivery Date</TableCell>
                          <TableCell>
                            {moment(order.deliveredOn).format("DD-MM-YYYY")}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Payment Method</TableCell>
                          <TableCell>{order.paymentMethod}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          ))
        ) : (
          <Grid
            container
            justifyContent="center"
            color="GrayText"
            className={styles.orderOuterBox}
          >
            <Typography variant="h6">No Orders yet.</Typography>
          </Grid>
        )}
      </Stack>
    </Container>
  );
};
