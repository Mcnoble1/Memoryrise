import React, { useEffect, useState } from "react";
import {
  Grid,
  IconButton,
  Typography,
  Button,
  TextField,
  Snackbar,
  Container,
  Stack,
  CardContent,
  Card,
} from "@mui/material";
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
import Editor from "../../components/layout/Editor";
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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`memorial-tabpanel-${index}`}
      aria-labelledby={`memorial-tab-${index}`}
      {...other}
    >
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

const Test = ({ data, session, baseUrl }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const [openEdit, setOpenEdit] = useState(false);
  const handleCloseEdit = () => setOpenEdit(false);

  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteDialogT, setOpenDeleteDialogT] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { setPrimaryColor, setAccentColor, setBackgroundImage, c } = React.useContext(ThemeContext);
  const [tribute, setTribute] = useState("");
  const [tributes, setTributes] = useState([]);

  const [openTribute, setOpenTribute] = useState(false);
  const [editTribute, setEditTribute] = useState("");
  const [tributeId, setTributeId] = useState(0);

  // console.log(data);

  useEffect(() => {
    getTributes();
  }, []);

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
    fullname: data?.fullName || "",
    dod: data ? format(new Date(data?.dod), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    dob: data ? format(new Date(data?.dob), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    city: data?.city || "",
    gender: data?.gender || "1",
    obituary: data?.obituary || "",
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/edit/memories/${data.obituaryId}`,
      {
        method: "POST",
        body: JSON.stringify({
          ...values,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/delete/obituary/${data.obituaryId}`,
      {
        method: "DELETE",
        // body: JSON.stringify({ memoryID: data.obituaryId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
    setOpenDeleteDialogT(false);
  };

  const getTributes = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tributes/findByObituaryId/${data?.obituaryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const results = await response.json();

    if (!response.ok) {
      throw new Error(results.message || "Something went wrong!");
    }

    setTributes(results);
  };

  const saveTribute = async () => {
    if (!tribute) {
      alert("Please provide tribute text.");
      return false;
    }
    debugger;
    const payload = {
      message: tribute,
      obituaryId: data.obituaryId,
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      userId: session ? session.userID : user.userId,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tributes/add/tribute`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const results = await response.json();

    if (!response.ok) {
      throw new Error(results.message || "Something went wrong!");
    }

    getTributes();
  };

  const showEditTribute = (t) => {
    setEditTribute(t.message);
    setTributeId(t.tributeId);
    setOpenTribute(true);
  };

  const updateTribute = async () => {
    const payload = {
      message: editTribute,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tributes/edit/tribute/${tributeId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const results = await response.json();

    if (!response.ok) {
      throw new Error(results.message || "Something went wrong!");
    }

    getTributes();
  };

  const deleteTribute = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tributes/delete/tribute/${tributeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const results = await response.json();

    if (!response.ok) {
      throw new Error(results.message || "Something went wrong!");
    }
    setOpenDeleteDialogT(false);
    getTributes();
  };

  function handleCloseTribute() {
    setOpenTribute(false);
  }

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - ${data ? data.fullName : ""}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        {/* Header */}
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
        >
          <Grid item m>
            <Image
              src={data?.imageUrl ? data.imageUrl : "/images/No-Image.png"}
              width={200}
              height={200}
              //   layout="responsive"
              priority
              //   style={{ borderRadius: "50%" }}
            />
          </Grid>
          <Grid item m alignContent="center">
            <Typography variant="h5">{data?.fullName || ""}</Typography>
            <Typography variant="h5">
              {data ? format(new Date(data?.dob), "yyyy") : format(new Date(), "yyyy")} -{" "}
              {data ? format(new Date(data?.dod), "yyyy") : format(new Date(), "yyyy")}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {/* Navigation */}
          <Grid item md={9}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="memorial tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="About" {...a11yProps(0)} />
                <Tab label="Life" {...a11yProps(1)} />
                <Tab label="Photos" {...a11yProps(2)} />
                <Tab label="Videos" {...a11yProps(3)} />
                <Tab label="Audios" {...a11yProps(4)} />
                <Tab label="Stories" {...a11yProps(5)} />
              </Tabs>
            </Box>
            {/* ABOUT */}
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
                    <ul>
                      <li>
                        {parseInt(format(new Date(data.dod), "yyyy")) -
                          parseInt(format(new Date(data.dob), "yyyy"))}{" "}
                        years old
                      </li>
                      <li>
                        Born on {format(new Date(data.dob), "dd MMMM, yyyy")} in {data.city}
                      </li>
                      <li>Passed away on {format(new Date(data.dod), "dd MMM yyyy")}</li>
                    </ul>
                    {/* <Typography>Sunrise: {format(new Date(data.dob), "dd MMM yyyy")}</Typography>
                    <Typography>Sunset: {format(new Date(data.dod), "dd MMM yyyy")}</Typography>
                    <p>{data.message}</p> */}
                    <Typography>
                      This memorial website was created in memory of our loved one,{" "}
                      {data?.fullName || ""},{" "}
                      {parseInt(format(new Date(data.dod), "yyyy")) -
                        parseInt(format(new Date(data.dob), "yyyy"))}{" "}
                      years old, born on {data ? format(new Date(data.dob), "dd MMMM, yyyy") : ""},
                      and passed away on {data ? format(new Date(data.dod), "dd MMMM, yyyy") : ""}.
                      We will remember {data?.gender ? "him" : "her"} forever.
                    </Typography>
                  </Grid>
                )}

                {/* Tributes */}
                <Grid item container sx={{ mt: 3 }}>
                  <Grid item md={12} sx={{ pb: "20px" }}>
                    <Typography variant="h5">Tributes</Typography>
                  </Grid>
                  <Grid item container spacing={2}>
                    {tributes.length
                      ? tributes.map((t) => (
                          <Grid item container direction="column" key={t.tributeId}>
                            <Card>
                              <CardContent>
                                <Grid item>
                                  <Typography variant="body1">{t.message}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="caption">By {t.user.fullName}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant="caption">
                                    {format(new Date(t.createdAt), "MMM dd, yyyy")}
                                  </Typography>
                                </Grid>
                                <Grid item container justifyContent="flex-end">
                                  {session && t.user.userId == session.userID && (
                                    <Grid item>
                                      <IconButton onClick={() => showEditTribute(t)}>
                                        <Tooltip title="Edit">
                                          <ModeEditOutlineOutlinedIcon />
                                        </Tooltip>
                                      </IconButton>
                                    </Grid>
                                  )}
                                  {session && t.user.userId == session.userID && (
                                    <Grid item>
                                      <IconButton
                                        onClick={() => {
                                          setTributeId(t.tributeId);
                                          setOpenDeleteDialogT(true);
                                        }}
                                      >
                                        <Tooltip title="Delete">
                                          <DeleteOutlineOutlinedIcon />
                                        </Tooltip>
                                      </IconButton>
                                    </Grid>
                                  )}
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))
                      : undefined}
                  </Grid>
                </Grid>

                {/* Add a tribute */}
                <Grid item container sx={{ mt: 3 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5">Leave a Tribute</Typography>
                      <Grid item m >
                        <Editor
                        value={tribute}
                        onChange={(e) => setTribute(e.target.value)}
                        fullWidth
                        />
                      </Grid>
                      <Grid item sx={{ mt: "30px" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ float: "right", mt: "30px", mb: "20px" }}
                          onClick={saveTribute}
                        >
                          Save
                        </Button>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            {/* LIFE */}
            <TabPanel value={value} index={1}>
              <Grid container direction="column">
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {data?.fullName || ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data?.message || ""}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </TabPanel>
            {/* PHOTOS */}
            <TabPanel value={value} index={2}>
              <Photos
                ObituaryID={data ? data.obituaryId : null}
                session={session}
                showProgress={showProgress}
                setShowProgress={setShowProgress}
                user={data ? data.user : null}
              />
            </TabPanel>
            {/* VIDEOS */}
            <TabPanel value={value} index={3}>
              <Videos
                ObituaryID={data ? data.obituaryId : null}
                session={session}
                showProgress={showProgress}
                setShowProgress={setShowProgress}
                user={data ? data.user : null}
              />
            </TabPanel>
            {/* AUDIOS */}
            <TabPanel value={value} index={4}>
              <Audios
                ObituaryID={data ? data.obituaryId : null}
                session={session}
                showProgress={showProgress}
                setShowProgress={setShowProgress}
                user={data ? data.user : null}
              />
            </TabPanel>
            {/* COMMENTS/STORIES */}
            <TabPanel value={value} index={5}>
              <CommentsSection
                ObituaryID={data ? data.obituaryId : null}
                session={session}
                user={data ? data.user : null}
              />
            </TabPanel>
          </Grid>
          {/* Right Side Panel */}
          <Grid item md={3} sx={{ mt: "30px" }}>
            {/* <Card>
              <CardContent>
                Invite {data?.fullName || ""}&apos;s family and friends
                </CardContent>
            </Card> */}
            <Card>
              <CardContent>
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    onClick={copyToClipboard}
                    color="primary"
                    disableElevation
                  >
                    Copy Link To Share
                  </Button>
                </Box>
                <Box sx={{ justifyContent: "space-between", display: "flex" }}>
                  <Stack>
                    <FacebookShareButton
                      url={`${baseUrl}/memories/${data?.obituaryId}`}
                      quote={`${data ? data.fullName : ""} memory`}
                      hashtag={"#memoryise"}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </Stack>
                  <Stack>
                    <TwitterShareButton
                      url={`${baseUrl}/memories/${data?.obituaryId}`}
                      title={`${data ? data.fullName : ""} memory`}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                  </Stack>
                  <Stack>
                    <WhatsappShareButton
                      url={`${baseUrl}/memories/${data?.obituaryId}`}
                      title={`${data ? data.fullName : ""} memory`}
                      separator=":: "
                    >
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
                      body={`Greetings,\n You have been invited to ${
                        data ? data.fullName : ""
                      }'s memorial. To visit click on the following link:\n\n`}
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
              </CardContent>
            </Card>

            <Box sx={{ mt: 2, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography>This site is administered by: {data?.user.fullName || ""}</Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ mt: 2, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography>Total views: {data?.views || 0}</Typography>
                </CardContent>
              </Card>
            </Box>
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

      {/* EDIT A MEMORIAL  */}
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
                  <Textfield
                    type="date"
                    name="dod"
                    label="Date Of Death"
                    max={format(new Date(), "yyyy-MM-dd")}
                  />
                </Grid>

                <Grid item md={12}>
                  <Textfield
                    type="date"
                    name="dob"
                    label="Date Of Birth"
                    max={format(new Date(), "yyyy-MM-dd")}
                  />
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
              <Grid
                container
                justifyContent="flex-end"
                style={{ paddingTop: "20px", paddingRight: "10px" }}
                spacing={1}
              >
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

      {/* SHOW ALERTS */}
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>

      {/* DELETE A MEMORIAL */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography variant="h6">Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this obituary. Note that once you delete this obituary
            you will never be able to recover data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button onClick={DeleteObituary}>Continue</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT TRIBUTE */}
      <Modal open={openTribute} onClose={handleCloseTribute}>
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
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Typography variant="h5">Edit a Tribute</Typography>
                <Grid item>
                  <TextField
                    multiline
                    maxRows={4}
                    value={editTribute}
                    onChange={(e) => setEditTribute(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item sx={{ mt: "30px" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ float: "right", mb: "20px" }}
                    onClick={updateTribute}
                  >
                    Update
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Container>
        </Grid>
      </Modal>

      {/* DELETE TRIBUTE DIALOG */}
      <Dialog
        open={openDeleteDialogT}
        onClose={handleDeleteClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography variant="h6">Delete</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this tribute?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button onClick={deleteTribute}>Continue</Button>
        </DialogActions>
      </Dialog>

      {/* Circular Progress */}
      <CustomProgress showProgress={showProgress} />
    </React.Fragment>
  );
};

export default Test;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  const { params } = context;
  console.log(params);

  if (params.id && params.id != "0") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/obituary/findByObituaryId/${params.id}`
    );
    const data = await res.json();

    // console.log({ data });

    return {
      props: { data, session, baseUrl: process.env.NEXTAUTH_URL },
    };
  } else {
    return {
      props: { data: null, session, baseUrl: process.env.NEXTAUTH_URL },
    };
  }
}
