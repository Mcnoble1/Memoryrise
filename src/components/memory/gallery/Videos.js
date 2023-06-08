import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
// import AuthForm from "../../auth/auth-form";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Draggable from "react-draggable";
import MuiAlert from "@mui/material/Alert";
import NameModal from "../NameModal";
import CloudinaryUploadWidget from "../../cloudinary/CloudinaryUploadWidget";
import Uploader from "../../drop-zone/uploader";

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

const options = {
  cloudName: "daz2tnj01",
  uploadPreset: "ushy38z7",
  folder: "memorials",
  cropping: "server",
  croppingAspectRatio: 1,
  croppingShowDimensions: true,
  resourceType: "video",
  clientAllowedFormats: ["mp4", "3gp", "avi", "mkv", "wmv"],
  thumbnails: false,
  // maxFileSize: 5000000,
};

export const Videos = ({ ObituaryID, user, session, showProgress, setShowProgress }) => {
  const [videos, setVideos] = useState([]);
  // const [openLogin, setOpenLogin] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [mediaId, setMediaId] = useState(0);
  const [caption, setCaption] = useState();
  const [openCaptionEdit, setOpenCaptionEdit] = useState(false);

  const [fullName, setFullName] = useState("");
  const [openName, setOpenName] = useState(false);

  const [openUploader, setOpenUploader] = useState(false);

  // useEffect(() => {
  //   if (fullName) {
  //     openUploadWidget();
  //   }
  // }, [fullName]);

  useEffect(() => {
    if (ObituaryID) {
      GetVideos();
    }
  }, [ObituaryID]);

  const GetVideos = async () => {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/videos/${ObituaryID}`);
    const data = await res.json();
    // console.log("Videos", data);
    setVideos(data);
    setShowProgress(false);
  };

  async function SaveUploadedMemorialVideos(url) {
    const payload = {
      url,
      obituaryId: ObituaryID,
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      userId: session ? session.userID : user.userId,
      fullName: !session ? fullName : "",
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add/video`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }

    GetVideos();

    return data;
  }

  function openUploadWidget() {
    if (!session && !fullName) {
      // setOpenLogin(true);
      setOpenName(true);
      return false;
    }

    // const options = {
    //   cloudName: "daz2tnj01",
    //   uploadPreset: "ushy38z7",
    //   folder: "memorials",
    //   cropping: "server",
    //   croppingAspectRatio: 1,
    //   croppingShowDimensions: true,
    //   resourceType: "video",
    //   // clientAllowedFormats: ["mp4", "3gp", "avi", "mkv", "wmv"],
    //   thumbnails: false,
    //   maxFileSize: 5000000,
    // };

    CloudinaryUploadFunc(options, (error, result) => {
      if (!error) {
        const { event, info } = result;
        if (event === "success") {
          SaveUploadedMemorialVideos(info.secure_url);
        }
      } else {
        console.log(error);
      }
    });
  }

  const callback = (error, result) => {
    if (!error) {
      const { event, info } = result;
      if (event === "success") {
        SaveUploadedMemorialVideos(info.secure_url);
      }
    } else {
      console.log(error);
    }
  };

  // const handleCloseLogin = () => {
  //   setOpenLogin(false);
  // };

  const handleCloseName = () => {
    setOpenName(false);
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

  const ShowEditCaption = () => {
    setOpenCaptionEdit(true);
  };

  const handleCloseCaptionEdit = () => {
    setOpenCaptionEdit(false);
  };

  const EditCaption = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/video/caption`, {
      method: "POST",
      body: JSON.stringify({
        id: mediaId,
        caption,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (response.ok) {
      handleDeleteClose();
      setSnackMessage("Caption added successfully");
      setOpenSnack(true);
      location.reload();
    }

    if (!response.ok) {
      handleDeleteClose();
      setSnackMessage("Something went wrong!");
      setOpenSnack(true);
      throw new Error(res.message || "Something went wrong!");
    }
  };

  const DeleteVideo = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/media/delete/video/${mediaId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = await response.json();
    if (response.ok) {
      handleDeleteClose();
      setSnackMessage("Photo deleted successfully");
      setOpenSnack(true);
      location.reload();
    }

    if (!response.ok) {
      handleDeleteClose();
      setSnackMessage("Something went wrong!");
      setOpenSnack(true);
      throw new Error(res.message || "Something went wrong!");
    }
  };

  return (
    <React.Fragment>
      <Grid container direction="column" spacing={1}>
        <Grid item container justifyContent="flex-end">
          <Grid item>
            <IconButton>
                <CloudinaryUploadWidget
                  options={options}
                  callback={callback}
                  title={"Add video(s)"}
                />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          {videos.length ? (
            videos.map((m) => (
              <Grid item xs={12} sm={6} md={3} key={m.videoId}>
                <Card>
                  <CardContent>
                    <Grid container>
                      <video width="230" height="250" controls style={{ marginRight: "4px" }}>
                        <source src={m.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </Grid>
                    {m.caption && <Typography variant="body2">{m.caption}</Typography>}
                    <Typography variant="caption">
                      By {m.fullName || m.obituary.user.fullName}
                    </Typography>
                    {session && m.obituary.user.userId == session.userID && (
                      <Grid container justifyContent="flex-end">
                        <Grid item>
                          <IconButton
                            onClick={() => {
                              setMediaId(m.videoId);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <Tooltip title="Delete Video">
                              <DeleteOutlineOutlinedIcon color="error" />
                            </Tooltip>
                          </IconButton>
                        </Grid>

                        <Grid item>
                          <IconButton
                            onClick={() => {
                              setMediaId(m.videoId);
                              ShowEditCaption();
                            }}
                          >
                            <Tooltip title="Edit Caption">
                              <ModeEditOutlineOutlinedIcon color="primary" />
                            </Tooltip>
                          </IconButton>
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <p>{showProgress ? "" : "No videos yet."}</p>
          )}
        </Grid>
      </Grid>

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

      {/* Snackbar */}
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

      {/* Edit Caption */}
      <Modal
        open={openCaptionEdit}
        onClose={handleCloseCaptionEdit}
        sx={{
          position: "absolute",
          top: "75%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          backgroundColor: "#fff",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Grid container spacing={2} direction="column">
          <Grid item>
            <TextField
              variant="outlined"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={EditCaption}
              sx={{ float: "right" }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Modal>

      {/* Delete */}
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
          <DialogContentText>Are you sure you want to delete this video?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button onClick={DeleteVideo}>Continue</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
