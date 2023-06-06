import React from "react";
import { Container, Grid, Modal, Typography } from "@mui/material";

import { Formik, Form } from "formik";
import Textfield from "../FormsUI/Textfield";
import FormButton from "../FormsUI/Button";

export default function PlansForm({ initialValues, validation, openPlans, handleClosePlans, SavePlan }) {
  return (
    <Grid container sx={{ zIndex: 1004 }}>
      <Modal open={openPlans} onClose={handleClosePlans}>
        <Grid
          container
          sx={{
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
          <Formik
            initialValues={{
              ...initialValues,
            }}
            validationSchema={validation}
            onSubmit={(values) => {
              SavePlan(values);
            }}
          >
            <Form>
              <Container disableGutters>
                <Grid container spacing={2}>
                  <Grid item container>
                    <Typography>Plan Name</Typography>
                    <Textfield name="planName" />
                  </Grid>
                  <Grid item container>
                    <Typography>Price</Typography>
                    <Textfield name="price" />
                  </Grid>
                  <Grid item container>
                    <Typography>Description</Typography>
                    <Textfield name="description" placeholder="eg., 100 photos,100 videos,100 audios sharing,3 years storage" />
                  </Grid>
                  <Grid item container>
                    <Typography>Sub Header</Typography>
                    <Textfield name="subheader" />
                  </Grid>
                  {/* <Grid item container>
                <Typography>Button Text</Typography>
                <Textfield name="buttonText" />
              </Grid>
              <Grid item container>
                <Typography>Button Variant</Typography>
                <Textfield name="buttonVariant" />
              </Grid> */}
                  <Grid item container justifyContent="flex-end">
                    <FormButton variant="contained">Save</FormButton>
                  </Grid>
                </Grid>
              </Container>
            </Form>
          </Formik>
        </Grid>
      </Modal>
    </Grid>
  );
}
