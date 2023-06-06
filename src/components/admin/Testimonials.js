import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import Draggable from "react-draggable";
import { CustomProgress } from "../common/CustomProgress";
import axios from "axios";
import { format } from "date-fns";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";

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

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [testimonialId, setTestimonialId] = useState(0);

  useEffect(() => {
    GetTestimonials();
  }, []);

  const GetTestimonials = async () => {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/testimonials/all`);
    const data = await res.json();

    console.log(data);
    setTestimonials(data);
    setShowProgress(false);
  };

  const VerifyTestimonial = async (id, isVerified) => {
    let response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/verify/testimonial`,
      {
        testimonialId: id,
        isVerified,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // const data = response.data;

    if (response.status != 200) {
      throw new Error(response.statusText || "Something went wrong!");
    }

    GetTestimonials();
  };

  const DeleteTestimonial = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/delete/testimonial/${testimonialId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (response.ok) {
      handleDeleteClose();
      setSnackMessage("Testimonial deleted successfully");
      setOpenSnack(true);

      GetTestimonials();
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

  return (
    <React.Fragment>
      <Grid container>
        <Grid item container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testimonials.map((row) => (
                  <TableRow key={row.testimonialId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.message}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.verified ? "Yes" : "No"}</TableCell>
                    <TableCell>{format(new Date(row.createdAt), "dd MMM yyyy HH:mm:ss")}</TableCell>
                    <TableCell>
                      <Grid container justifyContent="flex-end">
                        <Grid item>
                          <Tooltip title={row.verified ? "Unverify" : "Verify"}>
                            <IconButton onClick={() => VerifyTestimonial(row.testimonialId, row.verified ? false : true)}>{row.verified ? <CheckIcon /> : <BlockIcon />}</IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => {
                                setOpenDeleteDialog(true);
                                setTestimonialId(row.testimonialId);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

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
          <DialogContentText>Are you sure you want to delete this testimonial. Note that once you delete this testimonial you will never be able to recover data.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button onClick={DeleteTestimonial}>Continue</Button>
        </DialogActions>
      </Dialog>
      {/* Circular Progress */}
      <CustomProgress showProgress={showProgress} />
    </React.Fragment>
  );
};

export default Testimonials;
