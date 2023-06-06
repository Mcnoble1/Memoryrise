import React from "react";
import { Avatar, Button, Container } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/router";

const testimonyMessage = {
  color: "#0a3f7a",
  fontSize: "32px",
  fontWeight: 700,
  mb: 2,
};

const textRowHeader = {
  display: "flex !important",
  flexDirection: "row",
  mb: 2,
  // alignItems: "center",
};

const headUserFlowerSection = {
  width: "240px",
  height: "100px",
  padding: "0px 0px",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",
  backgroundImage: 'url("/prettypurple.jpg")',
};

const headUserFlowerSectionTwo = {
  width: "240px",
  height: "100px",
  padding: "0px 0px",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",
  backgroundImage: 'url("/pinkyellow.jpg")',
};

function Timeline({ memorials }) {
  const router = useRouter();

  return (
    <Box maxWidth="lg" sx={{ background: "#fff" }} align="center">
      <Box
        align="center"
        flex-direction="row"
        sx={{ display: { md: "flex", xs: "block" }, mt: { xs: "-10px" } }}
      >
        <Box>
          <Grid
            item
            sx={{
              mt: 12,
              width: "20%",
              mb: 2,
              padding: { xs: "20px", md: "0px" },
              mr: { sm: "60px", xs: 0 },
              float: { xs: "left", sm: "right" },
            }}
          >
            <Link href="/create-memory">
              <Button
                variant="contained"
                disableElevation
                color="primary"
                sx={{ whiteSpace: "nowrap" }}
              >
                Create a memory
              </Button>
            </Link>
          </Grid>
        </Box>
      </Box>
      <Grid container align="center">
        {memorials.length ? (
          memorials.slice(0, 4).map((m, i) => {
            if (!m.deleted)
              return (
                <Grid item md={3} sx={{ ml: { xs: "60px" } }}>
                  <Box
                    spacing={2}
                    key={m.obituaryId}
                    sx={{ mt: { xs: 4 }, ml: { md: 4 } }}
                    onClick={() => router.push(`/memories/${m.obituaryId}`)}
                  >
                    <Stack
                      sx={{
                        boxShadow: "0 4px 17px 6px rgb(0 0 0 / 10%)",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "12px",
                        width: "240px",
                        cursor: "pointer",
                      }}
                    >
                      <Box sx={{ ...headUserFlowerSection }}></Box>
                      <Stack
                        sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          alt="Remy Sharp"
                          src={m.imageUrl || "/userAvatar.png"}
                          sx={{
                            width: "80px",
                            height: "80px",
                            border: "3px solid #fff",
                            bottom: "31px",
                          }}
                        />
                      </Stack>
                      <Stack
                        sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}
                      >
                        <Typography variant="h5">{m.fullName}</Typography>
                      </Stack>
                      <Stack
                        sx={{
                          justifyContent: "center",
                          display: "flex",
                          alignItems: "center",
                          pb: 3,
                        }}
                      >
                        <Typography variant="h7">
                          Sunrise {format(new Date(m.dob), "dd MMM yyyy")}
                        </Typography>
                        <Typography variant="h7">
                          Sunset {format(new Date(m.dod), "dd MMM yyyy")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              );
          })
        ) : (
          <React.Fragment>
            <Box spacing={2} sx={{ mt: { xs: 4 }, ml: { md: 4 } }}>
              <Stack
                sx={{
                  boxShadow: "0 4px 17px 6px rgb(0 0 0 / 10%)",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "12px",
                  width: "240px",
                }}
              >
                <Box sx={{ ...headUserFlowerSection }}></Box>
                <Stack sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                  <Avatar
                    alt="Remy Sharp"
                    src="/userAvatar.png"
                    sx={{
                      width: "80px",
                      height: "80px",
                      border: "3px solid #fff",
                      bottom: "31px",
                    }}
                  />
                </Stack>
                <Stack sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                  <Typography variant="h5">Memere Zenton</Typography>
                </Stack>
                <Stack
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    pb: 3,
                  }}
                >
                  <Typography variant="h7">Born 18th October 1980</Typography>
                </Stack>
              </Stack>
            </Box>
            <Box justify="center" sx={{ mt: { xs: 4 }, ml: { md: 4 } }} spacing={2}>
              <Stack
                sx={{
                  boxShadow: "0 4px 17px 6px rgb(0 0 0 / 10%)",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "12px",
                  width: "240px",
                }}
              >
                <Box sx={{ ...headUserFlowerSectionTwo }}></Box>
                <Stack sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                  <Avatar
                    alt="Remy Sharp"
                    src="/userAvatar.png"
                    sx={{
                      width: "80px",
                      height: "80px",
                      border: "3px solid #fff",
                      bottom: "31px",
                    }}
                  />
                </Stack>
                <Stack sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                  <Typography variant="h5">Oemere Yenton</Typography>
                </Stack>
                <Stack
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    pb: 3,
                  }}
                >
                  <Typography variant="h7">Born 18th October 1950</Typography>
                </Stack>
              </Stack>
            </Box>
          </React.Fragment>
        )}
      </Grid>
    </Box>
  );
}

export default Timeline;
