import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";

import AddCardIcon from "@mui/icons-material/AddCard";
import EditIcon from "@mui/icons-material/Edit";
import * as Yup from "yup";
import MuiAlert from "@mui/material/Alert";
import Draggable from "react-draggable";
import { CustomProgress } from "../common/CustomProgress";
import axios from "axios";
import PlansForm from "./PlansForm";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);

  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [planId, setPlanId] = useState(0);

  const [initialValues, setInitialValues] = useState({
    planName: "",
    price: 0.0,
    description: "",
    subheader: "",
    buttonText: "Subscribe",
    buttonVariant: "outlined",
  });

  const validation = Yup.object().shape({
    planName: Yup.string().required("Required").max(50),
    price: Yup.number().required("Required"),
    description: Yup.string().required("Required"),
    subheader: Yup.string().max(50).nullable(),
    // buttonText: Yup.string().required("Required").min(50),
    // buttonVariant: Yup.string().required("Required").min(50),
  });

  useEffect(() => {
    GetPlans();
  }, []);

  const GetPlans = async () => {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/all`);
    const data = await res.json();

    console.log(data);
    setPlans(data);
    setShowProgress(false);
  };

  function handleClosePlans() {
    setOpenPlans(false);
  }

  const SavePlan = async (values) => {
    const url = planId == 0 ? `${process.env.NEXT_PUBLIC_API_URL}/api/plans/create` : `${process.env.NEXT_PUBLIC_API_URL}/api/plans/edit/${planId}`;

    let response;

    if (planId == 0) {
      response = await axios.post(
        url,
        {
          planName: values.planName,
          price: values.price,
          description: values.description,
          subheader: values.subheader || "",
          buttonText: values.buttonText,
          buttonVariant: values.buttonVariant,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      response = await axios.put(
        url,
        {
          planId,
          planName: values.planName,
          price: values.price,
          description: values.description,
          subheader: values.subheader || "",
          buttonText: values.buttonText,
          buttonVariant: values.buttonVariant,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // const data = response.data;

    if (response.status != 200) {
      throw new Error(response.statusText || "Something went wrong!");
    }

    setOpenPlans(false);

    GetPlans();
  };

  const DeletePlan = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/delete/${planId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (response.ok) {
      handleDeleteClose();
      setSnackMessage("Plan deleted successfully");
      setOpenSnack(true);
      GetPlans();
    }

    if (!response.ok) {
      handleDeleteClose();
      setSnackMessage("Something went wrong!");
      setOpenSnack(true);
      throw new Error(res.message || "Something went wrong!");
    }
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const addNew = () => {
    setInitialValues((prev) => {
      return {
        ...prev,
        planName: "",
        price: 0.0,
        description: "",
        subheader: "",
      };
    });
    setPlanId(0);
    setOpenPlans(true);
  };

  const showEdit = (plan) => {
    setInitialValues((prev) => {
      return {
        ...prev,
        planName: plan.planName,
        price: plan.price,
        description: plan.description,
        subheader: plan.subheader,
      };
    });
    setPlanId(plan.planId);
    setOpenPlans(true);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item container justifyContent="flex-end" sx={{ mb: "30px" }}>
          <Tooltip title="Add Plan">
            <IconButton onClick={addNew}>
              <AddCardIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Plan Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Sub Header</TableCell>
                  {/* <TableCell>buttonText</TableCell>
                  <TableCell>buttonVariant</TableCell> */}
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((row) => (
                  <TableRow key={row.planId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{row.planName}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.subheader}</TableCell>
                    {/* <TableCell>{row.buttonText}</TableCell>
                    <TableCell>{row.buttonVariant}</TableCell> */}
                    <TableCell>
                      <Grid container justifyContent="flex-end">
                        <Grid item>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => {
                                showEdit(row);
                                setPlanId(row.planId);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        {/* <Grid item>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => {
                                setOpenDeleteDialog(true);
                                setPlanId(row.planId);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid> */}
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <PlansForm openPlans={openPlans} handleClosePlans={handleClosePlans} initialValues={initialValues} validation={validation} SavePlan={SavePlan} />

      <Snackbar open={openSnack} autoHideDuration={2000} onClose={handleSnackClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>

      {/* Delete */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography variant="h6">Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this plan. Note that once you delete this plan you will never be able to recover data.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button onClick={DeletePlan}>Continue</Button>
        </DialogActions>
      </Dialog>
      {/* Circular Progress */}
      <CustomProgress showProgress={showProgress} />
    </React.Fragment>
  );
};

export default PricingPlans;
