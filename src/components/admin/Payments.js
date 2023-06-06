import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";
import { CustomProgress } from "../common/CustomProgress";
import { format } from "date-fns";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    GetPayments();
  }, []);

  const GetPayments = async () => {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/all`);
    const data = await res.json();

    console.log(data);
    setPayments(data);
    setShowProgress(false);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Transaction</TableCell>
                  <TableCell>Date Paid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((row) => (
                  <TableRow
                    key={row.paymentId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.paymentId}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.transaction}</TableCell>
                    <TableCell>{format(new Date(row.txDate), "dd MMM yyyy HH:mm:ss")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Circular Progress */}
      <CustomProgress showProgress={showProgress} />
    </React.Fragment>
  );
};

export default Payments;
