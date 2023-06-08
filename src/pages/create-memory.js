import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Container, Grid, Snackbar, Typography } from "@mui/material";
import Textfield from "../components/FormsUI/Textfield";
import Select from "../components/FormsUI/Select";
import Button from "../components/FormsUI/Button";
import Checkbox from "../components/FormsUI/Checkbox";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import Head from "next/head";
import Copyright from "../components/layout/Copyright";
import MuiAlert from "@mui/material/Alert";
import CloudinaryUploadWidget from "../components/cloudinary/CloudinaryUploadWidget";
import Uploader from "../components/drop-zone/uploader";
import Editor from "../components/layout/Editor";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles((theme) => ({
  form: {
    // "& > *": {
    //   margin: "0px 24px 0px 24px",
    //   width: "94%",
    // },

    // "& .MuiFormControl-root": {
    //   height: "100% !important",
    // },

    "& .MuiFormLabel-root": {
      color: "#4B5C64",
      fontSize: "16px",
    },
    border: "1px solid #38015c",
    paddingBottom: "22px",
    borderRadius: "16px",
    boxShadow: "5px 10px #38015c",
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
  thumbnails: false,
  // maxFileSize: 5000000,
  // maxImageWidth: 1200,
  // maxImageHeight: 1200,
  minImageWidth: 100,
  minImageHeight: 100,
};

function MemoryPage({ session }) {
  const classes = useStyles();
  const [initialStep, setInitialStep] = useState(true);
  const [memoryId, setMemoryId] = useState(0);
  const [images, setImages] = useState([]);
  const [maxImages, setMaxImages] = useState(false);

  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");

  const [openUploader, setOpenUploader] = useState(false);

  const initialValues = {
    fullName: "",
    dod: format(new Date(), "yyyy-MM-dd"),
    dob: format(new Date(), "yyyy-MM-dd"),
    city: "",
    gender: "1",
    message: "",
    relationship: "",
    webAddress: "",
    agreeToTerms: "",
  };

  const validation = Yup.object().shape({
    fullName: Yup.string().required("Required").max(50),
    dod: Yup.date()
      .required("Required")
      .min(Yup.ref("dob"), ({ min }) => `Date needs to be after ${formatDate(min)}!!`),
    dob: Yup.date()
      .required("Required")
      .max(Yup.ref("dod"), ({ max }) => `Date needs to be before ${formatDate(max)}!!`),
    city: Yup.string().required("Required").max(20),
    gender: Yup.string().required("Required"),
    relationship: Yup.string().required("Required"),
    message: Yup.string().required("Required").max(5000),
    // webAddress: Yup.string().required("Required"),
    agreeToTerms: Yup.boolean().required("Required"),
  });

  function formatDate(date) {
    console.log("min date", date);
    return new Date(date).toLocaleDateString();
  }

  async function SaveObituary(values) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/add/obituary`, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        userId: session.userID,
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (!response.ok) {
      setMessage(res.message || "Something went wrong!");
      setOpenSnack(true);

      throw new Error(res.message || "Something went wrong!");
    }

    setMessage(
      "Your memorial has been created successfuly. Please add photos, stories and share with others."
    );
    setOpenSnack(true);

    setMemoryId(res.obituaryId);

    setInitialStep(false);

    return res;
  }

  async function SaveUploadedMemorialImages(imgUrl) {
    const payload = {
      url: imgUrl,
      obituaryId: memoryId,
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    };

    const URL = images.length == 0 ? "/api/user/add/main-photo" : "/api/user/add/photo";

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${URL}`, {
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

    let _images = [...images];
    _images.push(imgUrl);
    setImages(_images);

    //validate Images
    if (_images.length == 5) {
      setMaxImages(true);
    }

    return data;
  }

  // function openUploadWidget() {
  //   const options = {
  //     cloudName: "daz2tnj01",
  //     uploadPreset: "ushy38z7",
  //     folder: "memorials",
  //     cropping: "server",
  //     croppingAspectRatio: 1,
  //     croppingShowDimensions: true,
  //     resourceType: "image",
  //     thumbnails: false,
  //     maxFileSize: 5000000,
  //     // maxImageWidth: 1200,
  //     // maxImageHeight: 1200,
  //     minImageWidth: 100,
  //     minImageHeight: 100,
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

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - Create Memory`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container sx={{ mt: 12 }}>
        {/* Step 1 */}
        <Grid
          container
          style={{
            display: initialStep ? "inline-block" : "none",
            padding: "30px",
            overflowY: "auto",
          }}
        >
          <Formik
            initialValues={{
              ...initialValues,
            }}
            validationSchema={validation}
            onSubmit={(values) => {
              SaveObituary(values);
            }}
          >
            <Form className={classes.form}>
              <Container>
                <Grid container direction="column" spacing={3} sx={{ mt: "10px" }}>
                  <Grid item md={12}>
                    <Textfield size="small" name="fullName" label="Full Name" />
                  </Grid>

                  <Grid item md={12}>
                    <Textfield size="small" type="date" name="dob" label="Date Of Birth" />
                  </Grid>

                  <Grid item md={12}>
                    <Textfield size="small" type="date" name="dod" label="Date Of Death" />
                  </Grid>

                  <Grid item md={12}>
                    <Textfield size="small" name="city" label="Recent City" />
                  </Grid>

                  <Grid item md={12}>
                    <Select
                      variant="outlined"
                      size="small"
                      name="gender"
                      label="Gender"
                      options={[
                        { value: 1, key: "Male" },
                        { value: 0, key: "Female" },
                      ]}
                    />
                  </Grid>
                  <Grid item md={12}>
                    <Select
                      variant="outlined"
                      size="small"
                      name="relationship"
                      label="Relationship"
                      options={[
                        { value: 1, key: "Aunt" },
                        { value: 2, key: "Boyfriend" },
                        { value: 3, key: "Brother" },
                        { value: 4, key: "Colleague" },
                        { value: 5, key: "Cousin" },
                        { value: 6, key: "Daughter" },
                        { value: 7, key: "Father" },
                        { value: 8, key: "Friend" },
                        { value: 9, key: "Granddaughter" },
                        { value: 10, key: "Grandfather" },
                        { value: 11, key: "Grandmother" },
                        { value: 12, key: "Grandson" },
                        { value: 13, key: "Husband" },
                        { value: 14, key: "Mother" },
                        { value: 15, key: "Nephew" },
                        { value: 16, key: "Niece" },
                        { value: 17, key: "Sister" },
                        { value: 18, key: "Son" },
                        { value: 19, key: "Step Family" },
                        { value: 20, key: "Uncle" },
                        { value: 21, key: "Wife" },
                        { value: 22, key: "Other" },
                        { value: 23, key: "No relationship" },
                      ]}
                    />
                  </Grid>

                  <Grid item md={12}>
                    {/* <Textfield size="small" multiline maxRows={10} name="message" label="Life" /> */}
                    <Editor name="message" label="Life" />
                  </Grid>
                  <Grid item md={12} sx={{ display: "none" }}>
                    <Textfield size="small" name="webAddress" label="Web Address" />
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent="flex-end"
                  style={{ paddingTop: "20px", paddingRight: "10px" }}
                  spacing={1}
                >
                  <Grid item>
                    <Checkbox
                      name="agreeToTerms"
                      label={
                        <p>
                          Do you agree to the {}
                          <Link href="/terms-of-service" passHref rel="noreferrer">
                            <a target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                              Terms and Conditions?
                            </a>
                          </Link>
                        </p>
                      }
                    />

                    {/* <Link href="/terms-and-conditions" passHref rel="noreferrer">
                      <a target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                        By clicking next you agree to the Terms and Conditions.
                      </a>
                    </Link> */}
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary">
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </Container>
            </Form>
          </Formik>
        </Grid>

        {/* Step 2 */}
        <Grid
          container
          direction="column"
          style={{
            display: !initialStep ? "inline-block" : "none",
            padding: "30px",
          }}
        >
          <Grid item>
            <Typography variant="h4">Add photo(s) to the website</Typography>
          </Grid>
          <Grid item container style={{ padding: "20px" }}>
            <Grid item md>
              {/* <Button
                variant="contained"
                onClick={openUploadWidget}
                color="primary"
                disabled={maxImages}
              >
                {images.length == 0 ? "Add main photo" : "Add photo(s)"}
              </Button> */}

              {!maxImages && (
                // <CloudinaryUploadWidget
                //   options={options}
                //   callback={callback}
                //   title={images.length == 0 ? "Add main photo" : "Add photo(s)"}
                // />

                <React.Fragment>
                  <Button variant="contained" color="primary" onClick={() => setOpenUploader(true)}>
                    {images.length == 0 ? "Add main photo" : "Add photo(s)"}
                  </Button>
                  <Uploader
                    openUploader={openUploader}
                    setOpenUploader={setOpenUploader}
                    saveMedia={SaveUploadedMemorialImages}
                    folder={"memorials"}
                    source={"images"}
                  />
                </React.Fragment>
              )}
            </Grid>
            <Grid item md>
              <p style={{ fontWeight: 900 }}>Tips to remember</p>
              <ul>
                <li>Choose high quality images that will render well on big screen</li>
                <li>You can always change the uploaded photos later</li>
                <li>You can also invite people to add photos, videos, and audios</li>
              </ul>
            </Grid>
          </Grid>
          <Grid item container spacing="2">
            {images.length
              ? images.map((m) => (
                  <Grid item md={3} key={m}>
                    <Image src={m} width="300px" height="300px" />
                  </Grid>
                ))
              : undefined}
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

      {/* Obituary completed */}
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={"success"} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}

export default MemoryPage;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("page", "/create-memory");
    }

    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
