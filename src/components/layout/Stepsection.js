import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const stackHeader = {
  p: 3,
  boxShadow: "0 4px 17px 6px rgb(0 0 0 / 10%)",
  borderRadius: "4px",
};

const typoHeader = {
  color: "#0a3f7a",
  fontSize: "21px",
  pb: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const titleHeader = {
  backgroundColor: "#5f2f7f",
  color: "#fff",
  borderRadius: "50%",
  width: "25px",
  fontSize: "12px",
  height: "25px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "10px",
};

const typoDescription = {
  display: "flex",
  color: "#524d4d",
};

function Stepsection() {
  return (
    <Box sx={{ background: "#fff", pt: 5 }} align="center">
      <Box maxWidth="lg" align="center">
        <Stack sx={{ mt: { xs: 4, md: 8 }, ml: { xs: 1.3, md: 8 }, mr: { xs: 1.3, md: 8 }, mb: { md: 4, xs: 3 } }}>
          <Typography
            sx={{
              textTransform: "uppercase",
              lineHeight: { md: "40px", sx: "35px" },
              color: "#0a3f7a",
              fontSize: { md: "25px", xs: "17px" },
              fontWeight: 700,
              mb: { xs: 2 },
            }}
          >
            Honor your loved one with an online memorial from Coworkers, Family, & Friends. KEEPING MEMORIES ALIVE
          </Typography>
          <Typography sx={{ pt: { md: 2 }, pl: { md: 3, xs: 1.3 }, pr: { md: 3, xs: 1.3 } }}>
            Memoryise is a user-friendly social network which lets you create and maintain an online memorial website for your loved ones. This virtual memorial becomes the focal point of a community
            of family and friends that keeps your cherished memories alive. The features we offer are designed to reflect your loved one&apos;s life and personality while keeping control of sensitive
            aspects such as privacy, religion, and security.
          </Typography>
        </Stack>
      </Box>
      <Box maxWidth="lg" align="center">
        <Box sx={{ display: "flex", mb: 8, flexDirection: { md: "row", xs: "column" } }}>
          <Stack sx={{ width: { md: "50%", xs: "100%" }, mt: { xs: 2 }, mb: { xs: 2 }, mr: { md: 3, xs: 2 }, ml: { md: 3, xs: 2 }, ...stackHeader }}>
            <Typography sx={{ ...typoHeader }}>
              <div
                style={{
                  ...titleHeader,
                }}
              >
                1
              </div>
              Create online Memorial
            </Typography>
            <Typography sx={{ ...typoDescription }}>
              Write your loved one&apos;s life story, express your thoughts on their service and their lifetime, announce the time and place of an event on a dedicated page in honor of your loved one.
            </Typography>
          </Stack>
          <Stack sx={{ width: { md: "50%", xs: "100%" }, mt: { xs: 2 }, mb: { xs: 2 }, mr: { md: 3, xs: 2 }, ml: { md: 3, xs: 2 }, ...stackHeader }}>
            <Typography sx={{ ...typoHeader }}>
              {" "}
              <div
                style={{
                  ...titleHeader,
                }}
              >
                2
              </div>
              Invite Friends and Family
            </Typography>
            <Typography sx={{ ...typoDescription }}>
              Connect via email or Facebook to invite friends, co-workers and family from around the world to contribute and share their memories of your loved one.
            </Typography>
          </Stack>
          <Stack sx={{ width: { md: "50%", xs: "100%" }, mt: { xs: 2 }, mb: { xs: 2 }, mr: { md: 3, xs: 2 }, ml: { md: 3, xs: 2 }, ...stackHeader }}>
            <Typography sx={{ ...typoHeader }}>
              {" "}
              <div
                style={{
                  ...titleHeader,
                }}
              >
                3
              </div>
              Share Memories
            </Typography>
            <Typography sx={{ ...typoDescription }}>
              Share your photos and memories with everyone you invite. Allow visitors to add their own photos, express their feelings, pay tribute, and condolences on your own Memorial Wall.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Stepsection;
