import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Grid } from "@mui/material";
import Link from "next/link";

const bannnerSection = {
  width: "100%",
  height: "100%",

  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",
  backgroundImage: 'url("/flowersbackground.jpg")',
};

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

const Banner = () => {
  return (
    <Box sx={{ maxWidth: "unset !important", padding: { xs: 4, md: 12 }, ...bannnerSection }}>
      <Box sx={{ width: { xs: "85%", md: "40%" } }}>
        <Stack sx={{ backgroundColor: "#fff", p: 4, borderRadius: "4px", opacity: "0.85" }}>
          <Typography sx={{ color: "#0a3f7a", fontSize: "24px", fontWeight: 700 }}>
            Share the wonderful memories of loved ones with friends, colleagues and family. Add
            photos, videos, and links to actual memorable events that defined the life of the
            departed. Crowd source obituary, eulogy and the life memories of of life moments of your
            loved one.
          </Typography>
          <Slider {...settings}>
            <Typography sx={{ pt: 2 }}>
              Share Videos, photos, memories, and poems with everyone. Allow visitors to add their
              own videos or photos, express their feelings, pay tribute, and condolences.
            </Typography>
            <Typography sx={{ pt: 2 }}>
              Collaborate to create a unique, online memorial. Add memories, photos, or videos;
              invite others to contribute; visit online anytime or print it out.
            </Typography>
            <Typography sx={{ pt: 2 }}>
              Create Online Memorials in Memory of your loved ones. Share the wonderful memories of
              loved ones with friends, colleagues and family. Add photos, videos, and links to
              actual memorable events that defined the life of the departed. Crowd source obituary,
              eulogy and the life memories of of life moments of your loved one.. Memorials are free
              to create and can be commemorated forever.
            </Typography>
          </Slider>
          <Grid container sx={{ mt: "20px" }}>
            <Link href="/create-memory">
              <Button variant="contained" color="primary" sx={{ borderRadius: "16px" }}>
                Try It Free
              </Button>
            </Link>
          </Grid>
        </Stack>
      </Box>
    </Box>
  );
};

export default Banner;
