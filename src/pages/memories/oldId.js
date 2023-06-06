import React, { useEffect, useState } from "react";
import { Grid, IconButton, Typography, Button, TextField, Snackbar, Container, Stack } from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CommentsSection from "../../components/memory/comments/Comments";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { getSession } from "next-auth/react";
import { makeStyles } from "@mui/styles";
import Modal from "@mui/material/Modal";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Textfield from "../../components/FormsUI/Textfield";
import Select from "../../components/FormsUI/Select";
import FormButton from "../../components/FormsUI/Button";
import Router from "next/router";
import Tooltip from "@mui/material/Tooltip";
import MuiAlert from "@mui/material/Alert";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
  PinterestShareButton,
  PinterestIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";
import Head from "next/head";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Copyright from "../../components/layout/Copyright";
import Image from "next/image";
import { Photos } from "../../components/memory/gallery/Photos";
import { Videos } from "../../components/memory/gallery/Videos";
import { Audios } from "../../components/memory/gallery/Audios";
import { CustomProgress } from "../../components/common/CustomProgress";
import { ThemeContext } from "../_app";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    // bgcolor: "background.paper",
    backgroundColor: "#fff",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },

  // [theme.breakpoints.down("xs")]: {
  //   logo: {
  //     display: "none",
  //   },
  // },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`memorial-tabpanel-${index}`} aria-labelledby={`memorial-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `memorial-tab-${index}`,
    "aria-controls": `memorial-tabpanel-${index}`,
  };
}

function Obituary({ data, session, baseUrl }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);

  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { setPrimaryColor, setAccentColor, setBackgroundImage } = React.useContext(ThemeContext);

  // console.log(data);

  useEffect(() => {
    if (data) {
      setPrimaryColor(data.user.primaryColor);
      setAccentColor(data.user.accentColor);
      setBackgroundImage(data.user.backgroundImage);
    }
  }, [data]);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const initialValues = {
    fullname: data.fullName || "",
    dod: data ? format(new Date(data.dod), "yyyy-MM-dd") : format(new Date(data.dod), "yyyy-MM-dd"),
    dob: data ? format(new Date(data.dob), "yyyy-MM-dd") : format(new Date(data.dod), "yyyy-MM-dd"),
    city: data.city || "",
    gender: data.gender || "1",
    obituary: data.obituary || "",
  };

  const validation = Yup.object().shape({
    fullname: Yup.string().required("Required"),
    dod: Yup.date()
      .required("Required")
      .min(Yup.ref("dob"), ({ min }) => `Date needs to be after ${formatDate(min)}!!`),
    dob: Yup.date()
      .required("Required")
      .max(Yup.ref("dod"), ({ max }) => `Date needs to be before ${formatDate(max)}!!`),
    city: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    obituary: Yup.string().required("Required"),
  });

  function formatDate(date) {
    console.log("date", date);
    return new Date(date).toLocaleDateString();
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function EditObituary() {
    setOpenEdit(true);
  }

  async function UpdateObituary(values) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/edit/memories/${data.obituaryId}`, {
      method: "POST",
      body: JSON.stringify({
        ...values,
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
      throw new Error(res.statusText || "Something went wrong!");
    }
  }

  async function DeleteObituary() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/delete/obituary/${data.obituaryId}`, {
      method: "DELETE",
      // body: JSON.stringify({ memoryID: data.obituaryId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (response.ok) {
      handleDeleteClose();
      setSnackMessage("Obituary deleted successfully");
      setOpenSnack(true);
      Router.push("/");
    }

    if (!response.ok) {
      handleDeleteClose();
      setSnackMessage("Something went wrong!");
      setOpenSnack(true);
      throw new Error(res.message || "Something went wrong!");
    }
  }

  function copyToClipboard() {
    /* Get the text field */
    var copyText = document.getElementById("obituary");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    setSnackMessage("Copied the text: " + copyText.value);
    setOpenSnack(true);
  }

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - ${data ? data.fullName : ""}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* Info */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Grid container sx={{ mt: 5, mb: 5 }}>
          <Grid item xs={12} sm={12} md={3}>
            <Box sx={{ width: "80%", height: "80%" }}>
              <Image src={data.imageUrl ? data.imageUrl : "/images/No-Image.png"} width={100} height={100} layout="responsive" priority style={{ borderRadius: "50%" }} />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={3} align="left">
            <Box sx={{ justifyContent: "center", pt: 2 }}>
              <Box>
                <Typography style={{ fontSize: "2.2rem" }}>{data ? data.fullName : ""}</Typography>
              </Box>
              <Box sx={{ display: "none" }}>
                <TextField id="obituary" value={`${baseUrl}/memories/${data.obituaryId}`} variant="standard" style={{ width: "90%" }} />
              </Box>
              <Box sx={{ mt: 2, mb: 3 }}>
                <Button variant="contained" onClick={copyToClipboard} color="primary" disableElevation>
                  Copy Link To Share
                </Button>
              </Box>
              <Box sx={{ justifyContent: "space-between", display: "flex" }}>
                <Stack>
                  <FacebookShareButton url={`${baseUrl}/memories/${data?.obituaryId}`} quote={`${data ? data.fullName : ""} memory`} hashtag={"#memoryise"}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                </Stack>
                <Stack>
                  <TwitterShareButton url={`${baseUrl}/memories/${data?.obituaryId}`} title={`${data ? data.fullName : ""} memory`}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </Stack>
                <Stack>
                  <WhatsappShareButton url={`${baseUrl}/memories/${data?.obituaryId}`} title={`${data ? data.fullName : ""} memory`} separator=":: ">
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </Stack>
                <Stack>
                  <LinkedinShareButton url={`${baseUrl}/memories/${data?._id}`}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                </Stack>
                <Stack>
                  <EmailShareButton
                    url={`${baseUrl}/memories/${data?.obituaryId}`}
                    subject={`${data ? data.fullName : ""} memory`}
                    body={`Greetings,\n You have been invited to ${data ? data.fullName : ""}'s memorial. To visit click on the following link:\n\n`}
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </Stack>
                <Stack>
                  <PinterestShareButton url={`${baseUrl}/memories/${data?.obituaryId}`}>
                    <PinterestIcon size={32} round />
                  </PinterestShareButton>
                </Stack>
                <Stack>
                  <TelegramShareButton url={`${baseUrl}/memories/${data?.obituaryId}`}>
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Container maxWidth="lg">
          <Grid item>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} aria-label="memorial tabs" variant="scrollable" scrollButtons="auto">
                <Tab label="About" {...a11yProps(0)} />
                <Tab label="Photos" {...a11yProps(1)} />
                <Tab label="Videos" {...a11yProps(2)} />
                <Tab label="Audios" {...a11yProps(3)} />
                <Tab label="Stories" {...a11yProps(4)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Grid container direction="column">
                <Grid item container justifyContent="flex-end">
                  {session && data && data.user.userId == session.userID && (
                    <Grid item>
                      <IconButton onClick={() => setOpenDeleteDialog(true)}>
                        <Tooltip title="Delete">
                          <DeleteOutlineOutlinedIcon />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                  )}
                  {session && data && data.user.userId == session.userID && (
                    <Grid item>
                      <IconButton onClick={EditObituary}>
                        <Tooltip title="Edit">
                          <ModeEditOutlineOutlinedIcon />
                        </Tooltip>
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
                {data && (
                  <Grid item md={12} key={data.obituaryId}>
                    <Typography>Sunrise: {format(new Date(data.dob), "dd MMM yyyy")}</Typography>
                    <Typography>Sunset: {format(new Date(data.dod), "dd MMM yyyy")}</Typography>
                    <p>{data.obituary}</p>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Photos ObituaryID={data ? data.obituaryId : null} session={session} showProgress={showProgress} setShowProgress={setShowProgress} user={data ? data.user : null} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Videos ObituaryID={data ? data.obituaryId : null} session={session} showProgress={showProgress} setShowProgress={setShowProgress} user={data ? data.user : null} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Audios ObituaryID={data ? data.obituaryId : null} session={session} showProgress={showProgress} setShowProgress={setShowProgress} user={data ? data.user : null} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <CommentsSection ObituaryID={data ? data.obituaryId : null} session={session} user={data ? data.user : null} />
            </TabPanel>
          </Grid>
        </Container>
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

      {/* Edit  */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Grid
          container
          style={{
            padding: "30px",
          }}
          className={classes.modal}
        >
          <Formik
            initialValues={{
              ...initialValues,
            }}
            validationSchema={validation}
            onSubmit={(values) => {
              UpdateObituary(values);
            }}
          >
            <Form className={classes.root}>
              <Grid container direction="column" spacing={3}>
                <Grid item md={12}>
                  <Textfield name="fullname" label="Full Name" />
                </Grid>

                <Grid item md={12}>
                  <Textfield type="date" name="dod" label="Date Of Death" max={format(new Date(), "yyyy-MM-dd")} />
                </Grid>

                <Grid item md={12}>
                  <Textfield type="date" name="dob" label="Date Of Birth" max={format(new Date(), "yyyy-MM-dd")} />
                </Grid>

                <Grid item md={12}>
                  <Textfield name="city" label="Recent City" />
                </Grid>

                <Grid item md={12}>
                  <Select
                    name="gender"
                    label="Gender"
                    options={[
                      { value: 1, key: "Male" },
                      { value: 0, key: "Female" },
                    ]}
                  />
                </Grid>

                <Grid item md={12}>
                  <Textfield name="obituary" label="Obituary Message" />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end" style={{ paddingTop: "20px", paddingRight: "10px" }} spacing={1}>
                <Grid item>
                  <Link href="/terms-and-conditions" target="_blank" rel="noreferrer">
                    By clicking next you agree to the Terms and Conditions.
                  </Link>
                </Grid>
                <Grid item>
                  <FormButton variant="contained" color="primary">
                    Next
                  </FormButton>
                </Grid>
              </Grid>
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
}

export default Obituary;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  const { params } = context;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/obituary/findByObituaryId/${params.id}`);
  const data = await res.json();

  // console.log({ data });

  return {
    props: { data, session, baseUrl: process.env.NEXTAUTH_URL },
  };
}
