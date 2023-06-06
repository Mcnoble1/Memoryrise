import { Grid, Typography } from "@mui/material";
import React, { Fragment } from "react";
import Link from "next/link";

import MainNavigation from "./MainNavigation";
import Divider from "@mui/material/Divider";
import { ThemeContext } from "../../pages/_app";

function Layout(props) {
  const { backgroundImage } = React.useContext(ThemeContext);

  return (
    <body>
      <MainNavigation />

      <main
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {props.children}
      </main>

      <footer style={{ backgroundColor: "rgb(235, 235, 235)", display: "none" }}>
        <Grid container justifyContent="center">
          <Grid item>
            <Link href="/terms-of-service">
              <a>
                <div>Terms of Service</div>
              </a>
            </Link>
            <Divider orientation="vertical" />
            <Link href="/privacy-policy">
              <a>
                <div>Privacy Policy</div>
              </a>
            </Link>
          </Grid>
          <Grid item>
            <Typography style={{ fontSize: "12px" }}>
              Memoryise. Copyright &copy; 2022. All rights reserved
            </Typography>
          </Grid>
        </Grid>
      </footer>
    </body>
  );
}

export default Layout;
