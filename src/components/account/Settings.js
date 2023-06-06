import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Button, CircularProgress, Snackbar, TextField, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ColorPicker } from "mui-color";
import { ThemeContext } from "../../pages/_app";
import Image from "next/image";
import CloudinaryUploadWidget from "../cloudinary/CloudinaryUploadWidget";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const options = {
  cloudName: "daz2tnj01",
  uploadPreset: "ushy38z7",
  folder: "background",
  cropping: "server",
  croppingAspectRatio: 1,
  croppingShowDimensions: true,
  resourceType: "image",
  thumbnails: false,
  maxFileSize: 3000000,
  maxImageWidth: 1920,
  maxImageHeight: 1080,
  minImageWidth: 1440,
  minImageHeight: 900,
};

const Settings = ({ session }) => {
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [showProgress1, setShowProgress1] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnack, setOpenSnack] = useState(false);
  const {
    primaryColor,
    setPrimaryColor,
    accentColor,
    setAccentColor,
    backgroundImage,
    setBackgroundImage,
  } = React.useContext(ThemeContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "password":
        setPassword(value);
        break;
      case "cPassword":
        setCPassword(value);
        break;
      default:
        break;
    }
  };

  function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
  }

  const UpdatePassword = async () => {
    if (!password) {
      setErrMessage("Please provide password");
      setSeverity("error");
      setOpenSnack(true);
      return false;
    }

    if (!checkPassword(password)) {
      setErrMessage(
        "A password should have a min of 8 characters, at least a special character, upper and lower case and a number!"
      );
      setSeverity("error");
      setOpenSnack(true);
      return false;
    }

    if (password != cPassword) {
      setErrMessage("Password and confirm password don't match");
      setSeverity("error");
      setOpenSnack(true);
      return false;
    }

    const payload = {
      newPassword: password,
      userId: session.userID,
      email: session.user.email,
      isPhoneNumber: false,
    };

    setShowProgress(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/change/password`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setShowProgress(false);

    if (!response.ok) {
      setErrMessage("An error occurred. Please try again");
      setSeverity("error");
      setOpenSnack(true);
      throw new Error(data.message || "Something went wrong!");
    }

    setErrMessage("Password changed successfully");
    setSeverity("success");
    setOpenSnack(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const UpdateThemeColor = async () => {
    if (!primaryColor) {
      setErrMessage("Please provide primary color");
      setSeverity("error");
      setOpenSnack(true);
      return false;
    }
    if (!accentColor) {
      setErrMessage("Please provide accent color");
      setSeverity("error");
      setOpenSnack(true);
      return false;
    }

    const payload = {
      primaryColor,
      accentColor,
      userId: session.userID,
    };

    setShowProgress1(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/update/theme`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setShowProgress1(false);

    if (!response.ok) {
      setErrMessage("An error occurred. Please try again");
      setSeverity("error");
      setOpenSnack(true);
      throw new Error(data.message || "Something went wrong!");
    }

    setErrMessage("Theme color updated successfully");
    setSeverity("success");
    setOpenSnack(true);
  };

  // function openUploadWidget() {
  //   const options = {
  //     cloudName: "daz2tnj01",
  //     uploadPreset: "ushy38z7",
  //     folder: "background",
  //     cropping: "server",
  //     croppingAspectRatio: 1,
  //     croppingShowDimensions: true,
  //     resourceType: "image",
  //     thumbnails: false,
  //     maxFileSize: 3000000,
  //     maxImageWidth: 1920,
  //     maxImageHeight: 1080,
  //     minImageWidth: 1440,
  //     minImageHeight: 900,
  //   };

  //   CloudinaryUploadFunc(options, (error, result) => {
  //     if (!error) {
  //       const { event, info } = result;
  //       if (event === "success") {
  //         setBackgroundImage(info.secure_url);
  //         UpdateBackgroundImage(info.secure_url);
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
        setBackgroundImage(info.secure_url);
        UpdateBackgroundImage(info.secure_url);
      }
    } else {
      console.log(error);
    }
  };

  const UpdateBackgroundImage = async (backgroundUrl) => {
    if (!backgroundUrl) {
      setErrMessage("Please upload a valid image!");
      setSeverity("error");
      setOpenSnack(true);
      return false;
    }

    const payload = {
      backgroundImage: backgroundUrl,
      userId: session.userID,
    };

    // setShowProgress2(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/update/background-image`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // setShowProgress2(false);

    if (!response.ok) {
      setErrMessage("An error occurred. Please try again");
      setSeverity("error");
      setOpenSnack(true);
      throw new Error(data.message || "Something went wrong!");
    }

    setErrMessage("Background image updated successfully");
    setSeverity("success");
    setOpenSnack(true);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Theme Color Update
        </Typography>
        <Grid md={12} item style={{ display: "inline-flex" }}>
          <ColorPicker
            name="color"
            // defaultValue={primaryColor}
            value={primaryColor}
            onChange={(color) => setPrimaryColor(`#${color.hex}`)}
          />
          <span
            title="click on the color box to select primary color"
            style={{ marginLeft: 10, lineHeight: "30px" }}
          >
            Primary Color
          </span>
        </Grid>
        <Grid md={12} item style={{ display: "inline-flex" }}>
          <ColorPicker
            name="color"
            // defaultValue={accentColor}
            value={accentColor}
            onChange={(color) => setAccentColor(`#${color.hex}`)}
          />
          <span
            title="click on the color box to select accent color"
            style={{ marginLeft: 10, lineHeight: "30px" }}
          >
            Accent Color
          </span>
        </Grid>
        <Grid item container justifyContent="flex-end">
          <Button onClick={UpdateThemeColor} variant="contained">
            {showProgress1 ? <CircularProgress sx={{ color: "#fff" }} /> : `Update`}
          </Button>
        </Grid>
      </Grid>

      <hr style={{ marginTop: "60px", marginBottom: "60px" }} />

      <Grid container spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Password Change
        </Typography>
        <Grid item container direction="column">
          <Typography>Password</Typography>
          <TextField
            type="password"
            required
            value={password}
            name="password"
            onChange={handleChange}
          />
        </Grid>

        <Grid item container direction="column">
          <Typography>Confirm Password</Typography>
          <TextField
            type="password"
            required
            value={cPassword}
            name="cPassword"
            onChange={handleChange}
          />
        </Grid>

        <Grid item container justifyContent="flex-end">
          <Button onClick={UpdatePassword} variant="contained">
            {showProgress ? <CircularProgress sx={{ color: "#fff" }} /> : `Update`}
          </Button>
        </Grid>
      </Grid>

      <hr style={{ marginTop: "60px", marginBottom: "60px" }} />

      <Grid container spacing={2}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Background Image
        </Typography>

        <Grid item container>
          {backgroundImage ? <Image src={backgroundImage} width={200} height={200} /> : undefined}
        </Grid>

        <Grid item container justifyContent="flex-end">
          {/* <Button onClick={openUploadWidget} variant="contained">
            Update
          </Button> */}
          <CloudinaryUploadWidget options={options} callback={callback} title={"Update"} />
        </Grid>
      </Grid>

      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={severity} sx={{ width: "100%" }}>
          {errMessage}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Settings;
