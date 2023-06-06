import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Button,
  CircularProgress,
  Container,
  Modal,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { format } from "date-fns";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Billing = ({ session }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnack, setOpenSnack] = useState(false);
  const [invoices, setInvoices] = useState();
  const [invoiceId, setInvoiceId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [openPay, setOpenPay] = useState(false);

  console.log(session);

  useEffect(() => {
    GetInvoices();
  }, []);

  const GetInvoices = async () => {
    setShowProgress(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payments/invoices/${session.userID}`
    );
    const data = await res.json();

    console.log(data);
    setInvoices(data);
    setShowProgress(false);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const PayByMpesa = async (inv) => {
    setAmount(inv.amount);
    setInvoiceId(inv.invoiceId);

    const payload = {
      invoiceId: inv.invoiceId,
      userId: session.userID,
      phone: inv.phone,
      amount: inv.amount,
    };

    //Option instruction
    setErrMessage(
      `Please enter your Mpesa PIN in your phone to complete the payment. Or simply send Kes. ${inv.amount} to paybill 4140411 with account number as ${inv.invoiceId}.`
    );
    setSeverity("info");
    setOpenSnack(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/stkpush`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setErrMessage("An error occurred. Please try again");
      setSeverity("error");
      setOpenSnack(true);
      throw new Error(data.message || "Something went wrong!");
    }

    setTimeout(() => {
      GetInvoices();
    }, 2000);

    setErrMessage("Payments initiated. Enter your pin on phone to confirm.");
    setSeverity("success");
    setOpenSnack(true);
  };

  function handleClosePay() {
    setOpenPay(false);
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Typography>Invoices List</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Paid On</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices
                ? invoices.map((inv) => (
                    <TableRow key={inv.invoiceId}>
                      <TableCell>{inv.invoiceId}</TableCell>
                      <TableCell>
                        {format(new Date(inv.invDate), "MMM dd, yyyy HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        {inv.user.planId == 2 ? `Pro Services` : `Enterprise Services`}
                      </TableCell>
                      <TableCell>Kshs.{inv.amount}</TableCell>
                      <TableCell>{inv.paid ? `Yes` : `No`}</TableCell>
                      <TableCell>
                        {inv.updatedAt
                          ? format(new Date(inv.updatedAt), "MMM dd, yyyy HH:mm:ss")
                          : ``}
                      </TableCell>
                      {!inv.paid ? (
                        <TableCell>
                          <Button
                            id="paywithmpesa"
                            variant="contained"
                            color="primary"
                            onClick={() => PayByMpesa(inv)}
                          >
                            Pay By Mpesa
                          </Button>
                        </TableCell>
                      ) : (
                        <TableCell></TableCell>
                      )}
                    </TableRow>
                  ))
                : undefined}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Manual */}
      <Modal open={openPay} onClose={handleClosePay}>
        <Grid
          container
          style={{
            padding: "30px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "#fff",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Container disableGutters>
            <Typography>
              If Mpesa express didn&apos;t work, use the following details to pay.
            </Typography>
            <Typography>PayBill: 4140411</Typography>
            <Typography>Account: {invoiceId}</Typography>
            <Typography>Amount: {amount}</Typography>
          </Container>
        </Grid>
      </Modal>

      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={severity} sx={{ width: "100%" }}>
          {errMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Billing;
