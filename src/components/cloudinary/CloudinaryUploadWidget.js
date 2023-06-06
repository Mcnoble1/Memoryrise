import { Button } from "@mui/material";
import React, { useEffect } from "react";

const CloudinaryUploadWidget = ({ options, callback, title }) => {
  useEffect(() => {
    var myWidget = window.cloudinary.createUploadWidget(options, callback);

    const handleClick = () => {
      myWidget.open();
    };

    if (document.getElementById("upload_widget"))
      document.getElementById("upload_widget").addEventListener("click", handleClick);

    return () => {
      if (document.getElementById("upload_widget"))
        document.getElementById("upload_widget").removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <Button id="upload_widget" variant="contained" color="primary">
      {title}
    </Button>
  );
};

export default CloudinaryUploadWidget;
