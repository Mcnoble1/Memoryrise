import React from "react";
import { Grid, Typography, Container } from "@mui/material";
import Link from "@mui/material/Link";
import Image from "next/image";
import Stack from "@mui/material/Stack";

const Copyright = (props) => {
  const copyLinks = {
    textDecoration: "none",
    fontSize: "12px",
    mr: 1,
  };

  return (
    <Container maxWidth="xl">
      <Grid container>
        <Grid item sm={12} md={8} lg={8} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          <Stack sx={{ mr: 2 }}>
            <Image width={30} height={30} src="/twitter.svg" />
          </Stack>
          <Stack sx={{ mr: 2 }}>
            <Image width={30} height={30} src="/facebook.svg" />
          </Stack>
          <Stack sx={{ mr: 2 }}>
            <Image width={30} height={30} src="/pinterest.svg" />
          </Stack>
          <Link href="/about" sx={{ ...copyLinks }}>
            <Typography variant="body2" color="text.secondary">
              About
            </Typography>
          </Link>
          <Link href="/pricing" sx={{ ...copyLinks }}>
            <Typography variant="body2" color="text.secondary">
              Pricing
            </Typography>
          </Link>
          {/* <Link href="/testimonials" sx={{ ...copyLinks }}>
            <Typography variant="body2" color="text.secondary">
              Testimonials
            </Typography>
          </Link> */}
          <Link href="/contact" sx={{ ...copyLinks }}>
            <Typography variant="body2" color="text.secondary">
              Contact
            </Typography>
          </Link>
          <Link href="/memories" sx={{ ...copyLinks }}>
            <Typography variant="body2" color="text.secondary">
              Memories
            </Typography>
          </Link>
        </Grid>

        <Grid item sm={12} md={4} lg={4} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Link href="/terms-of-service" sx={{ textDecoration: "none", pr: "3px" }}>
            <Typography variant="body2" color="text.secondary">
              Terms of Service
            </Typography>
          </Link>
          <>|</>
          <Link href="/privacy-policy" sx={{ textDecoration: "none", pl: "3px" }}>
            <Typography variant="body2" color="text.secondary">
              Privacy Policy
            </Typography>
          </Link>
        </Grid>

        {/* <Grid item sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
          {"Copyright © "}
          <Link color="inherit" href="https://memoryise.com">
            Memoryise
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Grid> */}
      </Grid>
    </Container>
  );
};

export default Copyright;
