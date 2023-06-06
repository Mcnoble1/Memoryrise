import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Modal, Snackbar, TextField, Tooltip, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Textfield from "../FormsUI/Textfield";
import FormButton from "../FormsUI/Button";
import Select from "../FormsUI/Select";
import MuiAlert from "@mui/material/Alert";
import Draggable from "react-draggable";
import { CustomProgress } from "../common/CustomProgress";
import axios from "axios";
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userId, setUserId] = useState(0);

  const initialValues = {
    fullName: "",
    username: "",
    phone: "",
    role: 1,
    password: "",
  };

  const validation = Yup.object().shape({
    fullName: Yup.string().required("Required").max(50),
    username: Yup.string().email("Email must be valid").required("Required").max(100),
    role: Yup.string().required("Required"),
    phone: Yup.string().required("Required").max(50),
    password: Yup.string().required("Required").min(8),
  });

  const roleOptions = [
    {
      value: 1,
      key: "Admin",
    },
    {
      value: 2,
      key: "User",
    },
  ];

  useEffect(() => {
    GetUsers();
  }, []);

  const GetUsers = async () => {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/all`);
    const data = await res.json();

    console.log(data);
    setUsers(data);
    setShowProgress(false);
  };

  function handleCloseUser() {
    setOpenUser(false);
  }

  const SaveUser = async (values) => {
    let response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
      {
        fullName: values.fullName,
        username: values.username,
        password: values.password,
        phone: values.phone,
        role: values.role == 1 ? ["admin"] : ["user"],
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

    setOpenUser(false);

    GetUsers();
  };

  const DeleteUser = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/delete/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (response.ok) {
      handleDeleteClose();
      setSnackMessage("User deleted successfully");
      setOpenSnack(true);
      GetUsers();
    }

    if (!response.ok) {
      handleDeleteClose();
      setSnackMessage("Something went wrong!");
      setOpenSnack(true);
      throw new Error(res.message || "Something went wrong!");
    }
  };

  const ChangeUserStatus = async (id) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/change/status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (response.ok) {
      handleDeleteClose();
      setSnackMessage("User status changed successfully");
      setOpenSnack(true);
      GetUsers();
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
        <Grid item container justifyContent="flex-end" sx={{ mb: "30px" }}>
          <Tooltip title="Add user">
            <IconButton onClick={() => setOpenUser(true)}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item container>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row) => (
                  <TableRow key={row.userId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.active ? "Active" : "In-active"}</TableCell>
                    <TableCell>
                      <Grid container justifyContent="flex-end">
                        <Grid item>
                          <Tooltip title={row.active ? "Set In-active" : "Set Active"}>
                            <IconButton onClick={() => ChangeUserStatus(row.userId)}>{row.active ? <CheckIcon /> : <BlockIcon />}</IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => {
                                setOpenDeleteDialog(true);
                                setUserId(row.userId);
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
      <Modal open={openUser} onClose={handleCloseUser}>
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
              SaveUser(values);
            }}
          >
            <Form>
              <Container disableGutters>
                <Grid container spacing={2}>
                  <Grid item container>
                    <Typography>Full Name</Typography>
                    <Textfield name="fullName" />
                  </Grid>
                  <Grid item container>
                    <Typography>Phone</Typography>
                    <Textfield name="phone" />
                  </Grid>
                  <Grid item container>
                    <Typography>Email</Typography>
                    <Textfield name="username" />
                  </Grid>
                  <Grid item container>
                    <Typography>Role</Typography>
                    <Select name="role" label="" options={roleOptions} />
                  </Grid>
                  <Grid item container>
                    <Typography>Password</Typography>
                    <Textfield name="password" type="password" />
                  </Grid>
                  <Grid item container justifyContent="flex-end">
                    <FormButton variant="contained">Save</FormButton>
                  </Grid>
                </Grid>
              </Container>
            </Form>
          </Formik>
        </Grid>
      </Modal>

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
          <DialogContentText>Are you sure you want to delete this user. Note that once you delete this user you will never be able to recover data.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button onClick={DeleteUser}>Continue</Button>
        </DialogActions>
      </Dialog>
      {/* Circular Progress */}
      <CustomProgress showProgress={showProgress} />
    </React.Fragment>
  );
};

export default Users;
