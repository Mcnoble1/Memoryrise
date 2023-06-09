import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import Image from "next/image";
import { useSpring, animated } from "react-spring";

import { SRLWrapper } from "simple-react-lightbox";
import Head from "next/head";
import Copyright from "../../components/layout/Copyright";

const SearchResults = ({ data }) => {
  const props = useSpring({
    from: { marginLeft: -100 },
    to: { marginLeft: 0 },
    delay: 200,
  });
  const [obituaries, setObituaries] = useState();

  console.log(data);

  useEffect(() => {
    if (data && data.length) {
      let newArray = shuffle(data);
      setObituaries(newArray);
    }
  }, []);

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - Memories`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Container sx={{ mt: 12 }}>
        <Grid container spacing={2} sx={{ mt: "30px" }} direction="column">
          {obituaries
            ? obituaries.map((d, i) => {
                if (!d.deleted)
                  return (
                    <animated.div style={props} key={d.obituaryId}>
                      <Grid item container md={12} xs={12} sm={12} spacing={2}>
                        <Grid item md={3}>
                          <SRLWrapper>
                            <Image
                              src={d.imageUrl || "/images/No-Image.png"}
                              width="300"
                              height="300"
                            />
                          </SRLWrapper>
                        </Grid>
                        <Grid item container md={9} direction="column">
                          <Typography>{d.fullName}</Typography>
                          <Typography>Sunrise: {format(new Date(d.dob), "dd MMM yyyy")}</Typography>
                          <Typography>Sunset: {format(new Date(d.dod), "dd MMM yyyy")}</Typography>
                          <Typography style={{ fontSize: "10px" }}>
                            Created At: {format(new Date(d.createdAt), "dd MMM yyyy HH:mm:ss")}
                          </Typography>
                          <a href={`/memories/${d.obituaryId}`}>View</a>
                        </Grid>
                      </Grid>
                    </animated.div>
                  );
              })
            : undefined}
        </Grid>
      </Container>
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
};

export default SearchResults;

export async function getServerSideProps(context) {
  const { params, query } = context;

  // console.log({ query, params });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/user/search/memorials/${query.q}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();

  return {
    props: { data: data },
  };
}
