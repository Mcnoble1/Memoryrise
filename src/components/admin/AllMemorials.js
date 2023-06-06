import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar, Typography } from "@mui/material";
import { SRLWrapper } from "simple-react-lightbox";
import { format } from "date-fns";
import Image from "next/image";
import { CustomProgress } from "../common/CustomProgress";
import Draggable from "react-draggable";
import MuiAlert from "@mui/material/Alert";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AllMemorials = ({ session }) => {
  const [memorials, setMemorials] = useState();
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [obituaryId, setObituaryId] = useState(0);

  useEffect(() => {
    GetMyMemorials();
  }, []);

  const GetMyMemorials = async () => {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/obituary/all`);
    const data = await res.json();

    console.log(data);
    setMemorials(data);
    setShowProgress(false);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const DeleteObituary = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/delete/obituary/${obituaryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (response.ok) {
      handleDeleteClose();
      setSnackMessage("Memory deleted successfully");
      setOpenSnack(true);

      let newMemorials = [];

      memorials.map((m) => {
        if (m.obituaryId == obituaryId) {
          newMemorials.push({ ...m, deleted: true });
        } else {
          newMemorials.push(m);
        }
      });

      console.log("newMem", newMemorials);

      setMemorials(newMemorials);

      //   location.reload();
    }

    if (!response.ok) {
      handleDeleteClose();
      setSnackMessage("Something went wrong!");
      setOpenSnack(true);
      throw new Error(res.message || "Something went wrong!");
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {memorials ? (
          memorials.map((d) => {
            if (!d.deleted)
              return (
                <Grid item md={3} xs={12} sm={6} key={d.obituaryId} align="center" justifyContent="center">
                  <SRLWrapper>
                    <Image src={d.imageUrl || "/images/No-Image.png"} width="300" height="300" />
                  </SRLWrapper>
                  <Typography>{d.fullName}</Typography>
                  <Typography>Sunrise: {format(new Date(d.dob), "dd MMM yyyy")}</Typography>
                  <Typography>Sunset: {format(new Date(d.dod), "dd MMM yyyy")}</Typography>
                  <Typography style={{ fontSize: "10px" }}>Created At: {format(new Date(d.createdAt), "dd MMM yyyy HH:mm:ss")}</Typography>
                  <Grid container spacing={2} justifyContent="space-around">
                    <Grid item>
                      <a href={`/memories/${d.obituaryId}`}>view</a>
                    </Grid>
                    <Grid item>
                      <a
                        href="#"
                        onClick={() => {
                          setObituaryId(d.obituaryId);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        delete
                      </a>
                    </Grid>
                  </Grid>
                </Grid>
              );
          })
        ) : (
          <Typography>No memorials yet.</Typography>
        )}
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
          <DialogContentText>Are you sure you want to delete this obituary. Note that once you delete this obituary you will never be able to recover data.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button onClick={DeleteObituary}>Continue</Button>
        </DialogActions>
      </Dialog>

      {/* Circular Progress */}
      <CustomProgress showProgress={showProgress} />
    </React.Fragment>
  );
};

export default AllMemorials;
