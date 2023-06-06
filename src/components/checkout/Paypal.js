import { Container, Grid } from "@mui/material";
import Script from "next/script";
import React, { useState, useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Paypal = ({ planId, userId, handleClosePricing }) => {
  const [amount, setAmount] = useState(planId == 1 ? 15 : planId == 2 ? 50 : 0);
  const [openToast, setOpenToast] = useState(false);

  async function changeUserPlan() {
    const response = await fetch("/api/user/edit-plan", {
      method: "POST",
      body: JSON.stringify({
        planId,
        userID: userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || "Something went wrong!");
    }
    setOpenToast(true);
    // Send an email with congratulation message
    // alert(`You have successfully subscribed to the ${planId == 1 ? `Pro` : `Enterprise`} plan`);
  }

  function handleCloseToast() {
    setOpenToast(false);
  }

  return (
    <React.Fragment>
      <Container>
        <PayPalButton
          amount={amount}
          onSuccess={(details, data) => {
            //save the transaction
            console.log(details);
            changeUserPlan();
            handleClosePricing();
          }}
        />
      </Container>

      <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert severity="success">{`You have successfully subscribed to the ${
          planId == 1 ? `Pro` : `Enterprise`
        } plan`}</Alert>
      </Snackbar>

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
      />
    </React.Fragment>
  );
};
