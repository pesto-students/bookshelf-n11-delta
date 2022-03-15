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
import TablePagination from '@mui/material/TablePagination';
import SearchBar from 'material-ui-search-bar';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import environment from '../../Environment/environment';
import {Overlay} from '../../shared/components';
import styles from './Admin.module.scss';

const BookList = () => {
  // State for saving Book records to display
  // and to implement pagination in table
  const [bookRecords, setBookRecords] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searched, setSearched] = useState('');

  // for table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // for user records filter
  const requestSearch = searchedVal => {
    const filteredRows = bookRecords.filter(row => {
      return (
        row.title.toLowerCase().includes(searchedVal.toLowerCase()) ||
        row.author.toLowerCase().includes(searchedVal.toLowerCase())
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
    fetch(`${environment.API_URL}/books/bytimestamp`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(response => {
        setBookRecords(response.books);
        setRows(response.books);
      })
      .catch(error => console.error(error));
  }, [searched]);

  // return the view
  return (
    <>
      {!!bookRecords.length ? (
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
                    <Typography variant="h5">Books</Typography>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                      spacing={1}
                    >
                      <SearchBar
                        onChange={searchVal => requestSearch(searchVal)}
                        onCancelSearch={() => cancelSearch()}
                        className={styles.searchBarBooks}
                      />
                      <Button
                        component={Link}
                        to="/books/new"
                        variant="contained"
                        aria-label="add-book"
                        size="small"
                        style={{
                          paddingLeft: '25px',
                          paddingRight: '25px',
                        }}
                      >
                        ADD BOOK TO CATALOGUE
                      </Button>
                    </Stack>
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
                          {rows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage,
                            )
                            .map((row, index) => (
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
                                <TableCell align="right">
                                  {row.author}
                                </TableCell>
                                <TableCell align="right">
                                  {row.quantity}
                                </TableCell>
                                <TableCell align="right">{row.price}</TableCell>
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
        </Paper>
      ) : (
        <Overlay showBackdrop={true} />
      )}
    </>
  );
};

export default BookList;
