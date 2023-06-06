import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

const testimonyMessage = {
  color: "#0a3f7a",
  fontSize: "32px",
  fontWeight: 700,
  display: "flex",

  alignItems: "center",
  justifyContent: "center",
};

function MemoryTiles() {
  return (
    <Box maxWidth="lg" sx={{ mt: 13, mb: 13 }}>
      <Box maxWidth="lg" direction="row" align="center">
        <Box spacing={5} align="center" justify="center">
          <Slider {...settings}>
            <Box sx={{ display: { xs: "block", md: "flex !important" }, flexDirection: "row" }} direction="row">
              <Stack sx={{ display: "flex", width: { md: "50%", xs: "90%" }, mb: { xs: 3 } }}>
                <Image width={640} height={426} src="/roseflower.jpg" style={{ borderRadius: "25px" }} />
              </Stack>
              <Stack sx={{ width: { md: "50%", xs: "90%" }, ...testimonyMessage }}>It can feel as if your loved one&apos;s memory might vanish.</Stack>
            </Box>

            <Box sx={{ display: { xs: "block", md: "flex !important" }, flexDirection: "row" }} direction="row">
              <Stack sx={{ display: "flex", width: { md: "50%", xs: "90%" }, mb: { xs: 3 } }}>
                <Image width={640} height={426} src="/redwhite.jpg" style={{ borderRadius: "25px" }} />
              </Stack>
              <Stack sx={{ width: { md: "50%", xs: "90%" }, ...testimonyMessage }}>Grief is never easy, but it&apos;s harder when family and friends can&apos;t be there.</Stack>
            </Box>

            <Box sx={{ display: { xs: "block", md: "flex !important" }, flexDirection: "row" }} direction="row">
              <Stack sx={{ display: "flex", width: { md: "50%", xs: "90%" }, mb: { xs: 3 } }}>
                <Image width={640} height={426} src="/purpleflowers.jpg" style={{ borderRadius: "25px" }} />
              </Stack>
              <Stack sx={{ width: { md: "50%", xs: "90%" }, ml: { md: 5 }, ...testimonyMessage }}>Remember together with a Memories online memorial. Anywhere, any time, forever.</Stack>
            </Box>
          </Slider>
        </Box>
      </Box>
    </Box>
  );
}

export default MemoryTiles;
