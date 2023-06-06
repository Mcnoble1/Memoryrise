import { Container, Grid, Typography, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@mui/styles";
import Textfield from "../components/FormsUI/Textfield";
import Button from "../components/FormsUI/Button";
import Copyright from "../components/layout/Copyright";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { getSession } from "next-auth/react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles((theme) => ({
  form: {
    "& .MuiFormLabel-root": {
      color: "#4B5C64",
      fontSize: "16px",
    },
    border: "1px solid #38015c",
    paddingBottom: "22px",
    borderRadius: "16px",
    boxShadow: "5px 10px #38015c",
  },
}));

const Testimonials = ({ data, session }) => {
  const classes = useStyles();
  const [messageStatus, setMessageStatus] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnack, setOpenSnack] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const initialValues = {
    name: "",
    address: "",
    message: "",
  };

  const validation = Yup.object().shape({
    name: Yup.string().required("Full Name Required").max(50),
    address: Yup.string().required("Address Required").max(100),
    message: Yup.string().required("Message Required").max(1000),
  });

  const SaveTestimonials = async (values) => {
    setShowProgress(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add/testimonial`, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        userId: session.userID,
        createdAt: new Date(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    setShowProgress(false);

    if (!response.ok) {
      console.log(res.message);
      setMessageStatus(res.message);
      setSeverity("error");
      setOpenSnack(true);

      return false;
    }

    //Show success
    setMessageStatus("Testimonial saved successfully. Once verified, it will appear on the list. Thanks");
    setSeverity("success");
    setOpenSnack(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  return (
    <React.Fragment>
      <Container sx={{ mt: 12 }}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h4" sx={{ textAlign: "center", mt: "20px", mb: "20px" }}>
              Reviews And Testimonials
            </Typography>
          </Grid>
          {session && (
            <Grid item sx={{ mb: "30px" }}>
              <Typography sx={{ fontSize: "18px" }}>Add your testimonial.</Typography>
              <Formik
                initialValues={{
                  ...initialValues,
                }}
                validationSchema={validation}
                onSubmit={(values) => {
                  SaveTestimonials(values);
                }}
              >
                <Form className={classes.form}>
                  <Container>
                    <Grid container direction="column" spacing={3} sx={{ mt: "10px" }}>
                      <Grid item md={12}>
                        <Textfield name="name" label="Full Name" />
                      </Grid>
                      <Grid item md={12}>
                        <Textfield name="address" label="Address" />
                      </Grid>
                      <Grid item md={12}>
                        <Textfield name="message" label="Message" multiline maxRows={4} />
                      </Grid>
                    </Grid>
                  </Container>
                  <Grid container justifyContent="flex-end" style={{ paddingTop: "20px", paddingRight: "10px" }} spacing={1}>
                    <Grid item>
                      <Button variant="contained" color="primary" disabled={showProgress}>
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </Grid>
          )}
          {data && data.length ? (
            data.map((t) => (
              <Grid item key={t._id}>
                <Card>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                      {`"${t.message}"`}
                    </Typography>
                    <Typography
                      sx={{
                        textAlign: "right",
                        fontStyle: "italic",
                        fontWeight: "900",
                      }}
                      variant="body1"
                    >
                      {`~${t.name}, ${t.address}`}
                    </Typography>
                  </CardContent>
                </Card>

                <hr />
              </Grid>
            ))
          ) : (
            <Typography sx={{ fontSize: "18px", textAlign: "center" }}>No testimonials yet.</Typography>
          )}
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
          {messageStatus}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Testimonials;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/testimonials`);
  const data = await res.json();

  return {
    props: { session, data },
  };
}
