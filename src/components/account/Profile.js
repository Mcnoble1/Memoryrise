import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import axios from "axios";
import CloudinaryUploadWidget from "../cloudinary/CloudinaryUploadWidget";

const options = {
  cloudName: "daz2tnj01",
  uploadPreset: "ushy38z7",
  folder: "profile",
  cropping: "server",
  croppingAspectRatio: 1,
  croppingShowDimensions: true,
  resourceType: "image",
  // clientAllowedFormats={["png", "gif", "jpeg"]}
  thumbnails: false,
  maxFileSize: 200000,
  maxImageWidth: 300,
  maxImageHeight: 300,
  minImageWidth: 100,
  minImageHeight: 100,
};

const ProfilePage = ({ data, session }) => {
  const [email, setEmail] = useState(data?.username);
  // const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState(data?.fullName);
  const [signupStatus, setSignupStatus] = useState("");
  const [phone, setPhone] = useState(data?.phone);
  const [profilePhoto, setProfilePhoto] = useState(data?.profilePhoto);
  const [phoneStatus, setPhoneStatus] = useState(false);
  const [countryCode, setCountryCode] = useState("us");
  const [phoneCountryCode, setPhoneCountryCode] = useState();
  const [phoneError, setPhoneError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    GetCountryCode();
  }, []);

  const GetCountryCode = () => {
    axios
      .get("https://ipapi.co/json", { withCredentials: false })
      .then((res) => setCountryCode(res.data.country_code.toLowerCase()))
      .catch((err) => console.log(err));
  };

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "fullname":
        setFullname(value);
        break;
      default:
        break;
    }
  }

  const handlePhoneChange = (status, value, country) => {
    setPhoneCountryCode(country.dialCode);
    setPhone(value);
    setPhoneStatus(status);
  };

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const UpdateDetails = async () => {
    if (!fullname) {
      setSignupStatus("Please provide your full name!");
      return false;
    }

    if (!validateEmail(email)) {
      setSignupStatus("Please provide a valid email address!");
      return false;
    }

    if (!phoneStatus) {
      setPhoneError(true);
      return false;
    }

    // if (!password) {
    //   setSignupStatus("Please provide your password!");
    //   return false;
    // }

    // if (!checkPassword(password)) {
    //   setSignupStatus("A password should have a min of 8 characters, at least a special character, upper and lower case and a number!");
    //   return false;
    // }

    let _phone;

    if (phone.charAt(0) == 0) {
      _phone = `+${phoneCountryCode}${phone.substring(1)}`;
    } else {
      _phone = !phone.includes("+")
        ? `+${phoneCountryCode}${parseInt(phone.replaceAll(" ", ""), 10)}`
        : phone.replaceAll(" ", "");
    }

    setLoading(true);

    let response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/edit-user/${session.userID}`,
      {
        fullName: fullname,
        username: email,
        phone: _phone,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (response.status != 200) {
      setLoading(false);
      setErrMessage(response.statusText || "Something went wrong!");
      throw new Error(response.statusText || "Something went wrong!");
    }

    setLoading(false);
    setOpenSuccess(true);
  };

  const handleClose = () => {
    setOpenSuccess(false);
  };

  // function openUploadWidget() {
  //   if (!session) {
  //     setOpenLogin(true);
  //     return false;
  //   }

  //   const options = {
  //     cloudName: "daz2tnj01",
  //     uploadPreset: "ushy38z7",
  //     folder: "profile",
  //     cropping: "server",
  //     croppingAspectRatio: 1,
  //     croppingShowDimensions: true,
  //     resourceType: "image",
  //     // clientAllowedFormats={["png", "gif", "jpeg"]}
  //     thumbnails: false,
  //     maxFileSize: 200000,
  //     maxImageWidth: 300,
  //     maxImageHeight: 300,
  //     minImageWidth: 100,
  //     minImageHeight: 100,
  //   };

  //   CloudinaryUploadFunc(options, (error, result) => {
  //     if (!error) {
  //       const { event, info } = result;
  //       if (event === "success") {
  //         SaveProfilePhoto(info.secure_url);
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
        SaveProfilePhoto(info.secure_url);
      }
    } else {
      console.log(error);
    }
  };

  async function SaveProfilePhoto(imgUrl) {
    const payload = {
      url: imgUrl,
      userId: session.userID,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/change/profile-photo`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }

    setProfilePhoto(data.profilePhoto);
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item container justifyContent="center">
          <Grid item>
            <Avatar sx={{ width: "100px", height: "100px" }} src={profilePhoto} />
          </Grid>
        </Grid>

        <Grid item container justifyContent="center" sx={{ mt: "20px", mb: "20px" }}>
          <Grid item>
            {/* <Button sx={{ color: "#fff" }} variant="contained" onClick={openUploadWidget}>
              Change Profile Image
            </Button> */}

            <CloudinaryUploadWidget
              options={options}
              callback={callback}
              title={"Change Profile Image"}
            />
          </Grid>
        </Grid>

        <Grid item container direction="column">
          <Typography>Full Name</Typography>
          <TextField required value={fullname} name="fullname" onChange={handleChange} />
        </Grid>

        <Grid item container direction="column">
          <Typography>Email</Typography>
          <TextField type="email" required value={email} name="email" onChange={handleChange} />
        </Grid>

        <Grid item container direction="column">
          <Typography>Phone</Typography>
          <Typography sx={{ color: "red" }}>
            {phoneError && !phoneStatus ? "Invalid phone number" : ""}
          </Typography>
          <IntlTelInput
            containerClassName="intl-tel-input"
            inputClassName="intl-form-control"
            value={phone}
            onPhoneNumberChange={handlePhoneChange}
            fieldName="Phone"
            defaultCountry={countryCode}
          />
        </Grid>

        <Grid item container direction="column">
          <Grid item>
            <p style={{ color: "#fff", textAlign: "center" }}>{signupStatus}</p>
          </Grid>

          <Grid item>
            <Button onClick={UpdateDetails} sx={{ float: "right" }} variant="contained">
              {loading ? <CircularProgress sx={{ color: "#fff" }} /> : `Update`}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={openSuccess}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"User details"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            User details saved successfuly!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
