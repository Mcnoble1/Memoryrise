import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "next/link";
import LockIcon from "@mui/icons-material/Lock";
import { useSession } from "next-auth/react";
import { Container } from "@mui/material";

const TopBar = () => {
  const [searchMemorial, setSearchMemorial] = useState("");
  const { data: session } = useSession();

  const handleChange = (event) => {
    setSearchMemorial(event.target.value);
  };
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex", cursor: "pointer" } }}
          >
            <Link href="/">
              <Box sx={{ p: 1.2 }}>
                <Image width={220} height={45} src="/LogoCroped.png" />
              </Box>
            </Link>
          </Typography>
        </Grid>

        <Grid item md={3} justifyContent="center" alignItems="center">
          <input
            type="text"
            placeholder="Search memorial"
            value={searchMemorial}
            onChange={handleChange}
            style={{
              height: "36px",
              width: "200px",
              marginTop: "20px",
              borderRadius: "16px",
              paddingLeft: "4px",
            }}
          />
        </Grid>

        <Grid
          item
          container
          md={3}
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ cursor: "pointer" }}
        >
          <Grid item>
            <LockIcon sx={{ color: "#fff" }} />
          </Grid>
          <Grid item>
            {/* <Link href="/auth">
              <a href="/auth" style={{ textDecoration: "none", color: "#fff" }}>
                {session ? "SIGN OUT" : "SIGN IN "}
              </a>
            </Link> */}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TopBar;
