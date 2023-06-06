import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Container, Grid, Typography } from "@mui/material";
import Textfield from "../../components/FormsUI/Textfield";
import Button from "../../components/FormsUI/Button";
import { makeStyles } from "@mui/styles";
import Head from "next/head";
import Copyright from "../../components/layout/Copyright";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import axios from "axios";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  form: {
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

const PasswordChange = ({ passwordCode }) => {
  const classes = useStyles();
  const [isPhone, setIsPhone] = useState(false);
  const [pResult, setPResult] = useState();
  const [isError, setIsError] = useState(true);
  const [phone, setPhone] = useState("");
  const [phoneStatus, setPhoneStatus] = useState(false);
  const [countryCode, setCountryCode] = useState("us");
  const [phoneCountryCode, setPhoneCountryCode] = useState();
  const [phoneError, setPhoneError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    GetCountryCode();
  }, []);

  const initialValues = {
    email: "",
    newPassword: "",
    cPassword: "",
  };

  const validation = Yup.object().shape({
    email: Yup.string().email().required("Please provide a valid email address"),
    newPassword: Yup.string().required("Password is required").max(20),
    cPassword: Yup.string()
      .required("Required")
      .max(20)
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const GetCountryCode = () => {
    axios
      .get("https://ipapi.co/json", { withCredentials: false })
      .then((res) => setCountryCode(res.data.country_code.toLowerCase()))
      .catch((err) => console.log(err));
  };

  async function ResetPassword(values) {
    if (isPhone && !phoneStatus) {
      setPhoneError(true);
      return false;
    }

    let _phone;
    if (phone.charAt(0) == 0) {
      _phone = `+${phoneCountryCode}${phone.substring(1)}`;
    } else {
      _phone = !phone.includes("+")
        ? `+${phoneCountryCode}${parseInt(phone.replaceAll(" ", ""), 10)}`
        : phone.replaceAll(" ", "");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/change/password`, {
      method: "PUT",
      body: JSON.stringify({
        ...values,
        phone: _phone.replaceAll(" ", ""),
        isPhoneNumber: isPhone,
        passwordCode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (!response.ok) {
      setPResult(res.message);
      setIsError(true);
      return false;
    }

    setPResult("Password changed successfully!");
    setIsError(false);

    setTimeout(() => {
      router.push("/auth");
    }, 1000);

    return res;
  }

  const handlePhoneChange = (status, value, country) => {
    setPhone(value);
    setPhoneCountryCode(country.dialCode);
    setPhoneStatus(status);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - Password Reset`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container sx={{ mt: 12 }}>
        <Grid
          container
          sx={{
            mt: "30px",
            overflowY: "auto",
            justifyContent: "center",
          }}
        >
          <Formik
            initialValues={{
              ...initialValues,
            }}
            validationSchema={validation}
            onSubmit={(values) => {
              ResetPassword(values);
            }}
          >
            <Form className={classes.form}>
              <Container>
                <Grid container direction="column" spacing={3} sx={{ mt: "10px" }}>
                  <Grid item md={12}>
                    <Typography sx={{ color: isError ? "red" : "green" }}>{pResult}</Typography>
                  </Grid>

                  {/* <Grid item md={12}>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox />} label="Use phone number to reset" value={isPhone} onChange={(e) => setIsPhone((prev) => !isPhone)} />
                    </FormGroup>
                  </Grid> */}

                  {!isPhone && (
                    <Grid item md={12}>
                      <Textfield name="email" label="Email" />
                    </Grid>
                  )}

                  {/* {isPhone && (
                    <Grid item md={12}>
                      <Typography sx={{ color: "red" }}>{isPhone && phoneError && !phoneStatus ? "Invalid phone number" : ""}</Typography>
                      <IntlTelInput
                        containerClassName="intl-tel-input"
                        inputClassName="intl-form-control"
                        value={phone}
                        onPhoneNumberChange={handlePhoneChange}
                        fieldName="Phone"
                        defaultCountry={countryCode}
                      />
                    </Grid>
                  )} */}

                  <Grid item md={12}>
                    <Textfield name="newPassword" type="password" label="New Password" />
                  </Grid>

                  <Grid item md={12}>
                    <Textfield name="cPassword" type="password" label="Confirm Password" />
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent="flex-end"
                  style={{ paddingTop: "20px", paddingRight: "10px" }}
                  spacing={1}
                >
                  <Grid item>
                    <Button variant="contained" color="primary">
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Container>
            </Form>
          </Formik>
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
    </React.Fragment>
  );
};

export default PasswordChange;

export async function getServerSideProps(context) {
  const { params } = context;

  return {
    props: { passwordCode: params.id },
  };
}
