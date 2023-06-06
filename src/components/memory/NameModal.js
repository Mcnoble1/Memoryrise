import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Textfield from "../FormsUI/Textfield";
import Button from "../FormsUI/Button";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const NameModal = ({ setFullName, handleCloseName }) => {
  const initialValues = {
    fullName: "",
  };

  const validation = Yup.object().shape({
    fullName: Yup.string().required("Required").max(100),
  });

  const SaveName = (values) => {
    setFullName(values.fullName);
    handleCloseName();
  };

  return (
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
        <Formik
          initialValues={{
            ...initialValues,
          }}
          validationSchema={validation}
          onSubmit={(values) => {
            SaveName(values);
          }}
        >
          <Form>
            <Container disableGutters>
              <Grid container spacing={2}>
                <Grid item container>
                  <Typography>Full Name</Typography>
                  <Textfield name="fullName" />
                </Grid>

                <Grid item container justifyContent="flex-end">
                  <Button variant="contained">Save</Button>
                </Grid>
              </Grid>
            </Container>
          </Form>
        </Formik>
      </Container>
    </Grid>
  );
};

export default NameModal;
