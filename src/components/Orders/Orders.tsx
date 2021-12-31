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
  Pagination,
} from "@mui/material";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../../App/App";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import { Overlay } from "../../shared/components";
import { DASHBOARD_ROUTE } from "../../shared/immutables";
import styles from "./Orders.module.scss";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const navigate = useNavigate();
  const {
    appState: { books, isUserLoggedIn },
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
      .then(({ data }) => {
        setOrders(data.orders);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  // return the view
  return (
    <>
      {isLoading ? (
        <Overlay showBackdrop={true} />
      ) : (
        <Paper elevation={2} className={styles.layout}>
          <Stack direction="column">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography style={{ fontWeight: "bold" }} variant="h5">
                Orders
              </Typography>
              {!!orders.length ? (
                <Pagination
                  count={
                    orders.length % rowsPerPage === 0
                      ? orders.length / rowsPerPage
                      : Math.ceil(orders.length / rowsPerPage)
                  }
                  page={page}
                  onChange={(event, val) => setPage(val)}
                  variant="outlined"
                  shape="rounded"
                />
              ) : (
                <></>
              )}
            </Stack>
            {!!orders.length ? (
              orders
                .slice(
                  (page - 1) * rowsPerPage,
                  (page - 1) * rowsPerPage + rowsPerPage
                )
                .map((order) => (
                  <Grid
                    container
                    rowSpacing={0}
                    className={styles.orderOuterBox}
                  >
                    <Grid item xs={8}>
                      <Paper elevation={2}>
                        <TableContainer>
                          <Table
                            size="small"
                            sx={{
                              tableLayout: "fixed",
                            }}
                          >
                            <TableHead style={{ backgroundColor: "#8e99d7" }}>
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
                                      ? { background: "#EDEDEF" }
                                      : { background: "white" }
                                  }
                                >
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell
                                    align="right"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      redirectToBooksPage(
                                        orderDetail?.bookId?._id
                                      )
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
                                  {moment(order.deliveredOn).format(
                                    "DD-MM-YYYY"
                                  )}
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
        </Paper>
      )}
    </>
  );
};
