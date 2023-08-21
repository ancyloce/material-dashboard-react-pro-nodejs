/**
 =========================================================
 * Material Dashboard 2 PRO React - v2.1.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import { useContext, useEffect, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import AuthService from "services/auth-service";
import { AuthContext } from "context";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

// Image
import bgImage from "assets/images/illustrations/illustration-reset.jpg";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

function Login() {
  const authContext = useContext(AuthContext);
  const [rememberMe, setRememberMe] = useState(false);
  const [inputs, setInputs] = useState({
    email: "admin@jsonapi.com",
    password: "secret",
  });
  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
    credentialsErros: false,
    textError: "",
  });

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    debugger;
    e.preventDefault();

    const mailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      inputs.email.trim().length === 0 ||
      !inputs.email.trim().match(mailFormat)
    ) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    const newUser = { email: inputs.email, password: inputs.password };

    const myData = {
      data: {
        type: "token",
        attributes: { ...newUser },
      },
    };

    try {
      const response = await AuthService.login(myData);
      authContext.login(response.access_token, response.refresh_token);
    } catch (res) {
      if (res.hasOwnProperty("message")) {
        setErrors({
          ...errors,
          credentialsErros: true,
          textError: res.message,
        });
      } else {
        setErrors({
          ...errors,
          credentialsErros: true,
          textError: res.errors[0].detail,
        });
      }
    }

    return () => {
      setInputs({
        email: "",
        password: "",
      });

      setErrors({
        emailError: false,
        passwordError: false,
        credentialsErros: false,
        textError: "",
      });
    };
  };

  const pathfixHandler = () => {
    window.addEventListener("$pinc.ui.auth.loggedin", () => {
      // To show user details on success
      console.log("ready", window.$pinc.auth.profile);
    });
    window.addEventListener("$pinc.oauth.notconsented", () => {
      // To show error message in login failed
      console.log("error occurred");
    });

    function loggedInCallback() {
      //do something now that your user is logged in
      console.log("window.$pinc.auth.profile", window?.$pinc?.auth?.profile);
    }

    function loggedOutCallback() {
      console.log("window.$pinc.auth.profile", window?.$pinc?.auth?.profile);
    }

    // load helper script
    const script = document.createElement("script");
    script.id = "pinc.helper";
    script.src = "https://labs.pathfix.com/helper.js";
    script.setAttribute("modules", "pinc.auth.min");
    script.setAttribute(
      "data-client-id",
      "36603516-98F9-487E-9337-ADE75090D977"
    );
    script.setAttribute("data-ui-providers", "github");
    script.setAttribute("data-on-logged-in", loggedInCallback());
    script.setAttribute("data-on-logged-out", loggedOutCallback());
    document.body.appendChild(script);
  };

  useEffect(() => {
    pathfixHandler();
  }, []);

  const githubHandler = async (e) => {
    e.preventDefault();
    try {
      window.location.replace(
        `https://labs.pathfix.com/integrate/command?provider=github&public_key=36603516-98F9-487E-9337-ADE75090D977&consented_redirect=${window.location.href}?isSocial=true&consented_action=redirect`
      );
      // const response = await AuthService.github();
      // debugger;
    } catch (res) {
      if (res.hasOwnProperty("message")) {
        setErrors({
          ...errors,
          credentialsErros: true,
          textError: res.message,
        });
      } else {
        setErrors({
          ...errors,
          credentialsErros: true,
          textError: res.errors[0].detail,
        });
      }
    }
  };

  return (
    <IllustrationLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      illustration={bgImage}
    >
      <MDBox
        component="form"
        role="form"
        method="POST"
        onSubmit={submitHandler}
      >
        <MDBox mb={2}>
          <MDInput
            type="email"
            label="Email"
            fullWidth
            name="email"
            value={inputs.email}
            onChange={changeHandler}
            error={errors.emailError}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="password"
            label="Password"
            fullWidth
            name="password"
            value={inputs.password}
            onChange={changeHandler}
            error={errors.passwordError}
          />
        </MDBox>
        <MDBox display="flex" alignItems="center" ml={-1}>
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <MDTypography
            variant="button"
            fontWeight="regular"
            color="text"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
          >
            &nbsp;&nbsp;Remember me
          </MDTypography>
        </MDBox>
        {errors.credentialsErros && (
          <MDTypography variant="caption" color="error" fontWeight="light">
            {errors.textError}
          </MDTypography>
        )}
        <MDBox mt={4} mb={1}>
          <MDButton
            variant="gradient"
            color="info"
            size="large"
            fullWidth
            type="submit"
          >
            sign in
          </MDButton>
        </MDBox>
        <Grid
          mt={3}
          container
          spacing={3}
          justifyContent="center"
          sx={{ mt: 1, mb: 2 }}
        >
          <Grid item xs={2}>
            <MDTypography component={MuiLink} href="#" variant="body1">
              <FacebookIcon color="inherit" />
            </MDTypography>
          </Grid>
          <Grid item xs={2}>
            <MDTypography
              component={MuiLink}
              variant="body1"
              onClick={githubHandler}
            >
              <GitHubIcon color="inherit" />
            </MDTypography>
          </Grid>
          <Grid item xs={2}>
            <MDTypography component={MuiLink} href="#" variant="body1">
              <GoogleIcon color="inherit" />
            </MDTypography>
          </Grid>
        </Grid>
        <MDBox mt={3} mb={1} textAlign="center">
          <MDTypography variant="button" color="text">
            Forgot your password? Reset it{" "}
            <MDTypography
              component={Link}
              to="/auth/forgot-password"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              here
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox mt={3} textAlign="center">
          <MDTypography variant="button" color="text">
            Don&apos;t have an account?{" "}
            <MDTypography
              component={Link}
              to="/auth/register"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
    </IllustrationLayout>
  );
}

export default Login;
