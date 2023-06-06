import React from "react";
import Box from "@mui/material/Box";
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
  mt: "60px",
  mb: "30px",
};

function TestimonyHome() {
  return (
    <Box sx={{ maxWidth: "unset !important", background: "rgba(232,240,248)", height: { md: "300px", xs: "100%" }, display: "flex", justifyContent: "center" }}>
      <Box maxWidth="lg" align="center" sx={{ width: "80%" }}>
        <Slider {...settings}>
          <Box sx={{ ...testimonyMessage }}>
            “Thank you for allowing me to keep my memories of my mum at my fingertips on my phone. I love to have the ability to reminisce just when I need a pick up.”
          </Box>
          <Box sx={{ ...testimonyMessage }}>
            “Thank you for allowing me to keep my memories of my mum at my fingertips on my phone. I love to have the ability to reminisce just when I need a pick up.”
          </Box>
          <Box sx={{ ...testimonyMessage }}>
            “Thank you for allowing me to keep my memories of my mum at my fingertips on my phone. I love to have the ability to reminisce just when I need a pick up.”
          </Box>
          <Box sx={{ ...testimonyMessage }}>
            “Thank you for allowing me to keep my memories of my mum at my fingertips on my phone. I love to have the ability to reminisce just when I need a pick up.”
          </Box>
        </Slider>
      </Box>
    </Box>
  );
}

export default TestimonyHome;
