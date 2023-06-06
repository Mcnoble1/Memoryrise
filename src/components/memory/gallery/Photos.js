import {
  Button,
  Card,
  CardContent,
  CardMedia,
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
import { makeStyles } from "@mui/styles";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { SRLWrapper } from "simple-react-lightbox";
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

const useStyles = makeStyles((theme) => ({
  SlideBtn: {
    marginTop: "-7px",
    fontSize: "12px",
    cursor: "pointer",
    // [theme.breakpoints.down("sm")]: {
    //   display: "none",
    // },
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "84%",
    // bgcolor: "background.paper",
    backgroundColor: "#fff",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
}));

const options = {
  cloudName: "daz2tnj01",
  uploadPreset: "ushy38z7",
  folder: "memorials",
  cropping: "server",
  croppingAspectRatio: 1,
  croppingShowDimensions: true,
  resourceType: "image",
  // clientAllowedFormats={["png", "gif", "jpeg"]}
  thumbnails: false,
  // maxFileSize: 5000000,
  // maxImageWidth: 1200,
  // maxImageHeight: 1200,
  minImageWidth: 100,
  minImageHeight: 100,
};

export const Photos = ({ ObituaryID, user, session, showProgress, setShowProgress }) => {
  const classes = useStyles();
  const [maxImages, setMaxImages] = useState(false);
  const [images, setImages] = useState([]);
  const [openSlideShow, setOpenSlideShow] = useState(false);
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
      GetGallery();
    }
  }, [ObituaryID]);

  useEffect(() => {
    if (!user || user.planId < 0) {
      console.log("No plan");

      if (images.length > 5) {
        setMaxImages(true);
      }
    }
  }, [images]);

  const GetGallery = async () => {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/photos/${ObituaryID}`);
    const data = await res.json();
    // console.log("Images", data);
    setImages(data);
    setShowProgress(false);
  };

  async function SaveUploadedMemorialImages(imgUrl) {
    const payload = {
      url: imgUrl,
      obituaryId: ObituaryID,
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      userId: session ? session.userID : user.userId,
      fullName: !session ? fullName : "",
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add/photo`, {
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

    // let _images = [...images];
    // _images.push(imageUrl);
    // setImages(_images);

    // //validate Images
    // if (_images.length == 4) {
    //   setMaxImages(true);
    // }

    GetGallery();

    return data;
  }

  function ShowSlideShow() {
    setOpenSlideShow(true);
  }

  function handleCloseSlideShow() {
    setOpenSlideShow(false);
  }

  // function openUploadWidget() {
  //   if (!session && !fullName) {
  //     // setOpenLogin(true);
  //     setOpenName(true);
  //     return false;
  //   }

  //   const options = {
  //     cloudName: "daz2tnj01",
  //     uploadPreset: "ushy38z7",
  //     folder: "memorials",
  //     cropping: "server",
  //     croppingAspectRatio: 1,
  //     croppingShowDimensions: true,
  //     resourceType: "image",
  //     // clientAllowedFormats={["png", "gif", "jpeg"]}
  //     thumbnails: false,
  //     maxFileSize: 2000000,
  //     maxImageWidth: 1200,
  //     maxImageHeight: 1200,
  //     minImageWidth: 500,
  //     minImageHeight: 500,
  //   };

  //   CloudinaryUploadFunc(options, (error, result) => {
  //     if (!error) {
  //       const { event, info } = result;
  //       if (event === "success") {
  //         SaveUploadedMemorialImages(info.secure_url);
  //       }
  //     } else {
  //       console.log(error);
  //     }
  //   });
  // }

  const callback = (error, result) => {
    if (!error) {
      const { event, info } = result;
      if (event === "success") {
        SaveUploadedMemorialImages(info.secure_url);
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/photo/caption`, {
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

  const DeletePhoto = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/media/delete/photo/${mediaId}`,
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
        <Grid item container spacing={2} justifyContent="flex-end">
          {/* {!isMobile ? (
            <Grid item className={classes.SlideBtn} onClick={ShowSlideShow}>
              <IconButton>
                <SlideshowRoundedIcon />
              </IconButton>
              Show slideshow
            </Grid>
          ) : undefined} */}

          <Grid item>
            {/* <IconButton>
              <Button
                variant="contained"
                onClick={openUploadWidget}
                color="primary"
                disabled={maxImages}
              >
                Add photo(s)
              </Button>
            </IconButton> */}

            {/* <CloudinaryUploadWidget options={options} callback={callback} title={"Add photo(s)"} /> */}

            <Button variant="contained" color="primary" onClick={() => setOpenUploader(true)}>
              Add photo(s)
            </Button>
            <Uploader
              openUploader={openUploader}
              setOpenUploader={setOpenUploader}
              saveMedia={SaveUploadedMemorialImages}
              folder={"memorials"}
              source={"images"}
            />

            {/* <TextField type="file" onChange={handleFileSelect} />
            <Button onClick={handleUpload}>Add Photo(s)</Button> */}
          </Grid>
        </Grid>
        <Grid item container spacing={1}>
          {images.length ? (
            images.map((m) => (
              <Grid item xs={12} sm={6} md={3} key={m.photoId}>
                <SRLWrapper>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      with="200"
                      image={m.photoUrl}
                      alt={`By ${m.obituary.user ? m.obituary.user.fullName : `...`}`}
                    />
                    <CardContent>
                      {m.caption && <Typography variant="body2">{m.caption}</Typography>}
                      <Typography variant="caption">
                        By {m.fullName || m.obituary.user ? m.obituary.user.fullName : `...`}
                      </Typography>
                      <br />
                      <Typography variant="caption">
                        Created on: {format(new Date(m.createdAt), "dd MMM yyyy HH:mm:ss")}
                      </Typography>
                      {session && m.obituary.user.userId == session.userID && (
                        <Grid container justifyContent="flex-end">
                          <Grid item>
                            <IconButton
                              onClick={() => {
                                setMediaId(m.photoId);
                                setOpenDeleteDialog(true);
                              }}
                            >
                              <Tooltip title="Delete Photo">
                                <DeleteOutlineOutlinedIcon color="error" />
                              </Tooltip>
                            </IconButton>
                          </Grid>

                          <Grid item>
                            <IconButton
                              onClick={() => {
                                setMediaId(m.photoId);
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
                    {/* <Image src={m.image} width="300px" height="300px" /> */}
                  </Card>
                </SRLWrapper>
              </Grid>
            ))
          ) : (
            <p>{showProgress ? "" : "No images yet."}</p>
          )}
        </Grid>
      </Grid>
      <Modal open={openSlideShow} onClose={handleCloseSlideShow}>
        <Grid
          container
          style={{
            padding: "30px",
          }}
          className={classes.modal}
        >
          <Carousel>
            {images.length &&
              images.map((img) => (
                <div key={img._id} style={{ width: "360px", height: "330px" }}>
                  <Image src={img.image} layout="fill" width="450" height="640" />
                  <p className="legend">Photo by {img.user ? img.user.name : `...`}</p>
                </div>
              ))}
          </Carousel>
        </Grid>
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
          <DialogContentText>Are you sure you want to delete this photo?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button onClick={DeletePhoto}>Continue</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
