import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import { makeStyles } from "@mui/styles";
import Modal from "@mui/material/Modal";
import Textfield from "../../FormsUI/Textfield";
import Button from "../..//FormsUI/Button";
import Router from "next/router";
import { format } from "date-fns";
import Card from "@mui/material/Card";
import { CustomProgress } from "../../common/CustomProgress";
// import AuthForm from "../../auth/auth-form";
import NameModal from "../NameModal";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    // bgcolor: "background.paper",
    backgroundColor: "#fff",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    padding: "20px",
  },
}));

function Comments({ ObituaryID, user, session }) {
  const classes = useStyles();
  const [comments, setComments] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  // const [openLogin, setOpenLogin] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);

  const [fullName, setFullName] = useState("");
  const [openName, setOpenName] = useState(false);

  // console.log(session);

  useEffect(() => {
    if (fullName) {
      setOpenEdit(true);
    }
  }, [fullName]);

  useEffect(() => {
    if (ObituaryID) {
      GetComments();
    }
  }, [ObituaryID]);

  const initialValues = {
    message: "",
    title: "",
  };

  const validation = Yup.object().shape({
    message: Yup.string().required("Required"),
  });

  async function GetComments() {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/comments/${ObituaryID}`);
    const data = await res.json();
    console.log("Comments", data);
    setComments(data);
    setShowProgress(false);
  }

  async function AddMessage() {
    if (!session && !fullName) {
      // setOpenLogin(true);
      setOpenName(true);
      return false;
    }

    setOpenEdit(true);
  }

  async function AddComment(values) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add/comment`, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        obituaryId: ObituaryID,
        date: format(new Date(), "yyyy-MM-dd"),
        userId: session ? session.userID : user.userId,
        fullName: !session ? fullName : "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (response.ok) {
      handleCloseEdit();
      Router.reload();
    }

    if (!response.ok) {
      throw new Error(res.message || "Something went wrong!");
    }
  }

  // const handleCloseLogin = () => {
  //   setOpenLogin(false);
  // };

  const handleCloseName = () => {
    setOpenName(false);
  };

  return (
    <React.Fragment>
      <Grid item container spacing="2" direction="column">
        <Grid item container justifyContent="flex-end">
          <Grid item>
            <IconButton onClick={AddMessage}>
              <Tooltip title="Add message">
                <AddCommentOutlinedIcon />
              </Tooltip>
            </IconButton>
          </Grid>
        </Grid>
        {comments.length ? (
          comments.map((m) => (
            <Grid item md={3} key={m.commentId} style={{ padding: "10px" }}>
              <Card style={{ padding: "10px" }}>
                {m.title && <h4>{m.title}</h4>}
                {m.obituary.user || m.fullName ? (
                  <Typography style={{ fontSize: "12px", fontStyle: "italic" }}>
                    Shared by {m.fullName || m.obituary.user.fullName} on{" "}
                    {format(new Date(m.date), "MMM dd, yyyy")}
                  </Typography>
                ) : null}
                <p>{m.message}</p>
              </Card>
            </Grid>
          ))
        ) : (
          <p>{showProgress ? "" : "No stories yet."}</p>
        )}
      </Grid>
      {/* Add comments */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Formik
          initialValues={{
            ...initialValues,
          }}
          validationSchema={validation}
          onSubmit={(values) => {
            AddComment(values);
          }}
        >
          <Form className={classes.root}>
            <Grid container className={classes.modal} direction="column" spacing={2}>
              <Grid item>
                <Textfield name="title" label="Title (optional)" />
              </Grid>
              <Grid item>
                <Textfield name="message" label="Message" multiline maxRows={10} />
              </Grid>
              <Grid item container justifyContent="flex-end">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Modal>

      {/* Login/Register */}
      {/* <Modal open={openLogin} onClose={handleCloseLogin}>
        <Grid container>
          <AuthForm page="obituary" />
        </Grid>
      </Modal> */}

      {/* Provide Name */}
      <Modal open={openName} onClose={handleCloseName}>
        <Grid container>
          <NameModal setFullName={setFullName} handleCloseName={handleCloseName} />
        </Grid>
      </Modal>

      {/* Circular Progress */}
      <CustomProgress showProgress={showProgress} />
    </React.Fragment>
  );
}

export default Comments;
