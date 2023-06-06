import React from "react";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  Progress: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
}));

export const CustomProgress = ({ showProgress }) => {
  const classes = useStyles();
  return (
    <div className={classes.Progress} style={{ display: showProgress ? "unset" : "none" }}>
      <CircularProgress />
    </div>
  );
};
