import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { CircularProgress, Typography } from "@mui/material";
import { SRLWrapper } from "simple-react-lightbox";
import { format } from "date-fns";
import Image from "next/image";

const MyMemorials = ({ session }) => {
  const [memorials, setMemorials] = useState();
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    GetMyMemorials();
  }, []);

  const GetMyMemorials = async () => {
    setShowProgress(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/obituary/findByUserId/${session.userID}`);
    const data = await res.json();

    console.log(data);
    setMemorials(data);
    setShowProgress(false);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {memorials ? (
          memorials.map((d) => (
            <Grid item md={3} xs={12} sm={6} key={d.obituaryId} align="center" justifyContent="center">
              <SRLWrapper>
                <Image src={d.imageUrl || "/images/No-Image.png"} width="300" height="300" />
              </SRLWrapper>
              <Typography>{d.fullName}</Typography>
              <Typography>Sunrise: {format(new Date(d.dob), "dd MMM yyyy")}</Typography>
              <Typography>Sunset: {format(new Date(d.dod), "dd MMM yyyy")}</Typography>
              <Typography style={{ fontSize: "10px" }}>Created At: {format(new Date(d.createdAt), "dd MMM yyyy HH:mm:ss")}</Typography>
              <a href={`/memories/${d.obituaryId}`}>View</a>
            </Grid>
          ))
        ) : (
          <Typography>No memorials yet.</Typography>
        )}
      </Grid>
      {showProgress && <CircularProgress />}
    </React.Fragment>
  );
};

export default MyMemorials;
