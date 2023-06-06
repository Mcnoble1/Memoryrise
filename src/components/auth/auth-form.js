import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import classes from "./auth-form.module.css";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import Link from "next/link";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import axios from "axios";

async function createUser(email, phone, password, fullname, planId) {
  let response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
    {
      fullName: fullname,
      username: email,
      password: password,
      phone: phone,
      role: ["user"],
      planId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data;

  if (response.status != 200) {
    throw new Error(response.statusText || "Something went wrong!");
  }

  return data;
}

function AuthForm({ page }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  let _planId = 1;
  if (sessionStorage.getItem("planId")) {
    _planId = parseInt(sessionStorage.getItem("planId"), 10);
  }

  const [planId, setPlanId] = useState(_planId);
  const [signupStatus, setSignupStatus] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneStatus, setPhoneStatus] = useState(false);
  const [countryCode, setCountryCode] = useState("us");
  const [phoneCountryCode, setPhoneCountryCode] = useState();
  const [phoneError, setPhoneError] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [plans, setPlans] = useState([]);

  const router = useRouter();

  useEffect(() => {
    GetCountryCode();
    GetPlans();
  }, []);

  const GetCountryCode = () => {
    axios
      .get("https://ipapi.co/json", { withCredentials: false })
      .then((res) => setCountryCode(res.data.country_code.toLowerCase()))
      .catch((err) => console.log(err));
  };

  const GetPlans = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (!response.ok) {
      throw new Error(res.message || "Something went wrong!");
    }

    setPlans(res);
  };

  const handleChange = (event) => {
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
      case "planId":
        setPlanId(value);
        break;
      default:
        break;
    }
  };

  const handlePhoneChange = (status, value, country) => {
    // console.log({ value, country });
    setPhoneCountryCode(country.dialCode);
    setPhone(value);
    setPhoneStatus(status);
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const signInWithCredentials = async () => {
    if (!isLogin && !fullname) {
      setSignupStatus("Please provide your full name!");
      return false;
    }

    if ((!isPhone && !validateEmail(email)) || (!isLogin && !validateEmail(email))) {
      setSignupStatus("Please provide a valid email address!");
      return false;
    }

    if ((isPhone || !isLogin) && !phoneStatus) {
      setPhoneError(true);
      return false;
    }

    if (isLogin && !password) {
      setSignupStatus("Please provide your password!");
      return false;
    }

    if (!isLogin && !checkPassword(password)) {
      setSignupStatus(
        "A password should have a min of 8 characters, at least a special character, upper and lower case and a number!"
      );
      return false;
    }

    if (!isLogin && !planId) {
      setSignupStatus("Please select your subscription plan!");
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

    console.log({ email, password, isPhone, _phone });

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password: password,
        isPhone: isPhone,
        phone: _phone.replaceAll(" ", ""),
      });

      if (!result.error) {
        // set some auth state
        if (page == "auth") {
          //if session page is set
          if (sessionStorage.getItem("page")) {
            const routePage = sessionStorage.getItem("page");
            sessionStorage.removeItem("page");
            router.replace(routePage);
          } else {
            router.replace("/account");
          }
        } else if (page == "obituary") {
          location.reload();
        }
      } else {
        // console.log({ result });
        // setSignupStatus("Either email or password is incorrect");
        setSignupStatus(result.error);
      }
    } else {
      try {
        const result = await createUser(email.trim(), _phone, password, fullname, planId);
        setSignupStatus(result.message);

        // if (planId == 2) {
        //   //Pay
        //   sessionStorage.setItem("planId", 2);
        // }

        setIsLogin(true);
        // console.log(result);
      } catch (error) {
        // console.log(error);
        setSignupStatus(error.message);
      }
    }
  };

  const signInWithGoogle = async () => {
    const result = await signIn("google");
    console.log(result);

    if (!result.error) {
      // set some auth state
      router.replace("/");
    } else {
      setSignupStatus(result.error);
    }
  };

  const signInWithFacebook = async () => {
    const result = await signIn("facebook");
    console.log(result);

    if (!result.error) {
      // set some auth state
      router.replace("/");
    } else {
      setSignupStatus(result.error);
    }
  };

  const signInWithTwitter = async () => {
    const result = await signIn("twitter");
    console.log(result);

    if (!result.error) {
      // set some auth state
      router.replace("/");
    } else {
      setSignupStatus(result.error);
    }
  };

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const checkPassword = (str) => {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(str);
  };

  return (
    <section className={classes.auth} style={{ marginTop: "8rem" }}>
      <h3>{isLogin ? "LOGIN" : "SIGN UP"}</h3>

      {!isLogin && (
        <div className={classes.control}>
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            required
            value={fullname}
            name="fullname"
            onChange={handleChange}
          />
        </div>
      )}

      {!isPhone || !isLogin ? (
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            name="email"
            onChange={handleChange}
          />
        </div>
      ) : undefined}

      {isPhone || !isLogin ? (
        <Grid item className={classes.control}>
          <label htmlFor="phone">Phone</label>
          <Typography sx={{ color: "red" }}>
            {isPhone && phoneError && !phoneStatus ? "Invalid phone number" : ""}
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
      ) : undefined}

      <div className={classes.control}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          name="password"
          onChange={handleChange}
        />
      </div>

      {/* {isLogin ? (
        <Grid item md={12}>
          <FormGroup>
            <FormControlLabel control={<Checkbox sx={{ color: "#fff" }} />} label="Use email to login" value={isPhone} onChange={(e) => setIsPhone((prev) => !isPhone)} sx={{ color: "#fff" }} />
          </FormGroup>
        </Grid>
      ) : undefined} */}

      {!isLogin && (
        <div className={classes.control}>
          <label htmlFor="planId">Plan</label>
          <Select
            id="planId"
            value={planId}
            name="planId"
            required
            onChange={handleChange}
            fullWidth
            sx={{ bgcolor: "#fff", height: "36px" }}
          >
            {plans.map((p) => (
              <MenuItem key={p.planId} value={p.planId}>
                {p.planName}
              </MenuItem>
            ))}

            {/* <MenuItem value={1}>Free</MenuItem>
            <MenuItem value={2}>Pro</MenuItem>
            <MenuItem value={3}>Enterprise</MenuItem> */}
          </Select>
        </div>
      )}

      <Grid container className={classes.actions} direction="column">
        <Grid item>
          <p style={{ color: "#fff", textAlign: "center" }}>{signupStatus}</p>
        </Grid>

        <Grid item>
          <Button onClick={signInWithCredentials} sx={{ width: "100%" }}>
            {isLogin ? "Login" : "Create Account"}
          </Button>
        </Grid>
        <Grid item container justifyContent="space-around">
          <Grid item m>
            <Link href="/password-reset">
              <Typography sx={{ color: "#fff", fontSize: "12px", cursor: "pointer" }}>
                Forgot Password?
              </Typography>
            </Link>
          </Grid>
          <Grid item m>
            <Typography
              onClick={switchAuthModeHandler}
              sx={{ color: "#fff", fontSize: "12px", cursor: "pointer" }}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            sx={{
              color: "#fff",
              textAlign: "center",
              mt: "20px",
              fontSize: "15px",
              fontWeight: "bold",
              pb: "25px",
            }}
          >
            Or Login With
          </Typography>
        </Grid>
        <Grid item container spacing={1} justifyContent="space-evenly">
          <Grid item>
            <GoogleIcon
              sx={{ color: "#fff", fontSize: "24px", cursor: "pointer" }}
              onClick={signInWithGoogle}
            />
          </Grid>
          <Grid item>
            <FacebookIcon
              sx={{ color: "#fff", fontSize: "24px", cursor: "pointer" }}
              onClick={signInWithFacebook}
            />
          </Grid>
          <Grid item>
            <TwitterIcon
              sx={{ color: "#fff", fontSize: "24px", cursor: "pointer" }}
              onClick={signInWithTwitter}
            />
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
}

export default AuthForm;
