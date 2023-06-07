import React, { useState, useEffect } from "react";
import { Container, Grid, Stack, Typography, Button } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { format } from "date-fns";
import Image from "next/image";
import { useSpring, animated } from "react-spring";
import Link from "next/link";

import { SRLWrapper } from "simple-react-lightbox";
import Head from "next/head";
import Copyright from "../../components/layout/Copyright";

function MemorialPage({ data }) {
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
        <Grid container spacing={2} sx={{ mt: "30px" }}>
          {obituaries
            ? obituaries.map((d, i) => {
                if (!d.deleted)
                  return (
                    <Grid
                      item
                      md={4}
                      xs={12}
                      sm={6}
                      key={d.obituaryId}
                      align="center"
                      justifyContent="center"
                    >
                      <animated.div style={props}>
                      <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                      <SRLWrapper>
                          <Image
                            src={d.imageUrl || "/images/No-Image.png"}
                            width="120"
                            height="120"
                          />
                        </SRLWrapper>
                        <Typography>{d.fullName}</Typography>
                        <Typography>Sunrise: {format(new Date(d.dob), "dd MMM yyyy")}</Typography>
                        <Typography>Sunset: {format(new Date(d.dod), "dd MMM yyyy")}</Typography>
                        <Typography style={{ fontSize: "10px" }}>
                          Created At: {format(new Date(d.createdAt), "dd MMM yyyy HH:mm:ss")}
                        </Typography>
                      </CardContent>
                      {/* <CardActions> */}
                      <Link href={`/memories/${d.obituaryId}`}>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: "5px", mb: "20px" }}
                            onClick={() => {`/memories/${d.obituaryId}`}}
                          >View
                          </Button>
                          </Link>
                      {/* </CardActions> */}
                    </Card>
                      </animated.div>
                    </Grid>
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
}

export default MemorialPage;

export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/obituary/all`);

  const data = await res.json();

  return {
    props: { data: data },
  };
}
