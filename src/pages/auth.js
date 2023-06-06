import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import AuthForm from "../components/auth/auth-form";
import Head from "next/head";
import Copyright from "../components/layout/Copyright";
import { CircularProgress, Container, Grid } from "@mui/material";

function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace("/");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return (
      <React.Fragment>
        <Head>
          <title>{`Memoryise - Login`}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Grid container justifyContent="center">
          <Grid item justifyItems="center">
            <CircularProgress sx={{ mt: "50%" }} />
          </Grid>
        </Grid>
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
  }

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - Login`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container>
        <AuthForm page="auth" />
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
}

export default AuthPage;
