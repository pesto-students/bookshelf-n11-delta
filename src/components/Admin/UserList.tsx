import { useState, useEffect } from "react";
import SearchBar from "material-ui-search-bar";
import styles from "./Admin.module.scss";
import {
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Stack,
  TableRow,
  Paper,
  Typography,
  Button,
  TablePagination,
  tableCellClasses,
} from "@mui/material";

export const UserList = () => {
  // State for saving User records to display
  // and to implement pagination in table
  const [userRecords, setUserRecords] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searched, setSearched] = useState("");

  // for table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // for user records filter
  const requestSearch = (searchedVal) => {
    const filteredRows = userRecords.filter((row) => {
      return (
        row.email.toLowerCase().includes(searchedVal.toLowerCase()) ||
        (row.username
          ? row.username.toLowerCase().includes(searchedVal.toLowerCase())
          : false)
      );
    });
    setRows(filteredRows);
    setPage(0);
  };

  // to load all records
  const cancelSearch = () => {
    requestSearch(searched);
  };

  useEffect(() => {
    fetch(`http://localhost:4000/users/bytimestamp`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        setUserRecords(response.users);
        setRows(response.users);
      })
      .catch((error) => console.log(error));
  }, [searched]);

  // return the view
  return (
    <Container style={{ padding: "40px 0 70px 0" }}>
      <Grid container rowSpacing={5}>
        <Grid item xs={12}>
          <div
            style={{
              border: "2px solid #e5e5e5",
              padding: "25px",
              borderRadius: "5px",
            }}
          >
            <Stack direction="column" spacing={2}>
              <Stack
                direction="row"
                spacing={4}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5">Users</Typography>
                <SearchBar
                  onChange={(searchVal) => requestSearch(searchVal)}
                  onCancelSearch={() => cancelSearch()}
                  className={styles.searchBarUsers}
                />
              </Stack>
              <Paper elevation={0}>
                <TableContainer>
                  <Table
                    size="small"
                    aria-label="a dense table"
                    sx={{
                      [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <TableHead style={{ backgroundColor: "#8e99d7" }}>
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
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row, index) => (
                          <TableRow
                            key={row._id}
                            style={
                              index % 2
                                ? { background: "#EDEDEF" }
                                : { background: "white" }
                            }
                          >
                            <TableCell component="th" scope="row">
                              {index + 1}
                            </TableCell>
                            <TableCell align="right">{row.username}</TableCell>
                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">{row.addresses ?? row.addresses[0].addressLine1}</TableCell>
                            <TableCell align="right">{row.addresses ?? row.addresses[0].city}</TableCell>
                            <TableCell align="right">{row.addresses ?? row.addresses[0].state}</TableCell>
                            <TableCell align="right">{row.addresses ?? row.addresses[0].pincode}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                />
              </Paper>
            </Stack>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};
