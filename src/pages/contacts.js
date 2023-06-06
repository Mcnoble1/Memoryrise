import { Container, Typography, Grid } from "@mui/material";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@mui/styles";
import Textfield from "../components/FormsUI/Textfield";
import Button from "../components/FormsUI/Button";
import Select from "../components/FormsUI/Select";
import Head from "next/head";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Copyright from "../components/layout/Copyright";
import { format } from "date-fns";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiFormLabel-root": {
      color: "#4B5C64",
      fontSize: "16px",
    },
    // border: "1px solid #0a435d",
    paddingBottom: "22px",
    // borderRadius: "16px",
    // boxShadow: "5px 10px #0a435d",
  },
}));

const Contacts = () => {
  const classes = useStyles();
  const [emailStatus, setEmailStatus] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnack, setOpenSnack] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const initialValues = {
    fullname: "",
    email: "",
    message: "",
    typeOfInquiry: "",
  };

  const validation = Yup.object().shape({
    fullname: Yup.string().required("Required").max(50),
    email: Yup.string().email("Email must be valid").required("Required").max(100),
    message: Yup.string().required("Required").max(1000),
    typeOfInquiry: Yup.string().required("Required"),
  });

  const inquiryOptions = [
    {
      value: 1,
      key: "General inquiry",
    },
    {
      value: 2,
      key: "Billing inquiry",
    },
    {
      value: 3,
      key: "Report an issue",
    },
    {
      value: 4,
      key: "Make A suggestion",
    },
    {
      value: 5,
      key: "Share feedback",
    },
  ];

  const SendEmail = async (values) => {
    setShowProgress(true);

    const response = await fetch(`/api/email`, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        subject: `Enquiry From ${values.fullname}`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    setShowProgress(false);

    if (!response.ok) {
      // throw new Error(res.message || "Something went wrong!");
      console.log(res.message);
      setEmailStatus("An error occurred while sending email");
      setSeverity("error");
      setOpenSnack(true);
      SaveEmail(values, false);
    }

    //Show success
    setEmailStatus("E-mail sent successfully");
    setSeverity("success");
    setOpenSnack(true);

    SaveEmail(values, true);
  };

  const SaveEmail = async (values, isSent) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add/email`, {
      method: "POST",
      body: JSON.stringify({
        message: values.message,
        senderName: values.fullname,
        from: values.email,
        sentDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        delivered: isSent,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - Contact Us`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container sx={{ mt: 10 }}>
        <Grid container direction="column">
          <Grid item container justifyContent="center">
            <Grid item justifyItems="center" sx={{ mt: "30px" }}>
              <Typography variant="h4">GET IN TOUCH</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Formik
              initialValues={{
                ...initialValues,
              }}
              validationSchema={validation}
              onSubmit={(values) => {
                SendEmail(values);
              }}
            >
              <Form className={classes.form}>
                <Container>
                  <Grid container direction="column" spacing={3} sx={{ mt: "10px" }}>
                    <Grid item md={12}>
                      <Select
                        name="typeOfInquiry"
                        label="Type Of Inquiry"
                        options={inquiryOptions}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <Textfield name="fullname" label="Full Name" />
                    </Grid>
                    <Grid item md={12}>
                      <Textfield name="email" label="E-mail" />
                    </Grid>
                    <Grid item md={12}>
                      <Textfield name="message" label="Message" multiline maxRows={4} />
                    </Grid>
                  </Grid>
                </Container>
                <Grid
                  container
                  justifyContent="flex-end"
                  style={{ paddingTop: "20px", paddingRight: "10px" }}
                  spacing={1}
                >
                  <Grid item>
                    <Button variant="contained" color="primary" disabled={showProgress}>
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </Formik>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* End footer */}

      {showProgress && (
        <Box sx={{ position: "absolute", top: "65%", left: "50%" }}>
          <CircularProgress />
        </Box>
      )}

      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={severity} sx={{ width: "100%" }}>
          {emailStatus}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Contacts;
