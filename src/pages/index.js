import React, { useEffect, useState } from "react";
import { Button, Container } from "@mui/material";

import Head from "next/head";
import Copyright from "../components/layout/Copyright";
import Stepsection from "../components/layout/Stepsection";
import Timeline from "../components/layout/Timeline";
import MemoryTiles from "../components/layout/MemoryTiles";
import Uploader from "../components/drop-zone/uploader";

function HomePage({ data }) {
  const [openUploader, setOpenUploader] = useState(false);
  const [urls, setUrls] = useState([]);

  // useEffect(() => {
  //   console.log(urls);
  // }, [urls]);

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - Home`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Timeline memorials={data} />
      {/* <Banner /> */}
      {/* <Box sx={{ mb: 12 }} /> */}
      {/* <Button variant="contained" color="primary" onClick={() => setOpenUploader(true)}>
        Upload
      </Button>
      <Uploader openUploader={openUploader} setOpenUploader={setOpenUploader} setUrls={setUrls} /> */}
      <Stepsection />
      {/* <TestimonyHome /> */}
      <MemoryTiles />

      {/* Footer */}
      <Container
        // maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          background: "rgba(232,240,248)",
          mt: 8,
          py: [3, 4],
          maxWidth: "unset !important",
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}

export default HomePage;

export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/obituary/all`);
  const data = await res.json();

  // console.log({ data });

  return {
    props: { data },
  };
}
