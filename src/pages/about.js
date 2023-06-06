import React from "react";
import Head from "next/head";
import { Container, Typography } from "@mui/material";
import Copyright from "../components/layout/Copyright";

function AboutPage() {
  return (
    <React.Fragment>
      <Head>
        <title>{`Memoryise - About Us`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container sx={{ mt: 10 }}>
        <h2>About Us</h2>
        <Typography variant="body">
          When we lose loved ones, we cling to the wonderful memories we recall about their
          lifetime. The majority of these memories are either observed or from stories we have heard
          from our loved ones, their friends, and colleagues. At death, unfortunately, the pressure
          revolves around giving the departed a befitting send off which centers around close family
          and friends. We lose a golden opportunity to collect/harvest and record the memories of
          other people who interacted with our loved ones in their various spheres of life. We
          always get to learn of the great positive impact our loved ones have had on others beyond
          family and close friends, and these memories keep the family going. These memories inform
          the lives of the relatives left and others to see the effect of one life when applied to
          touch others&apos; lives.
        </Typography>
        <br></br>
        <Typography variant="body">
          We exist to support grieving families and post an online obituary to reach as many people
          as possible with the announcement. We then extend the space to also allow for all people
          to contribute to available memories of the departed with additional capabilities such as
          online condolence books. Users are enabled to add text messages as well as photos and
          videos that define the life of the departed. This extends the positive eulogy messages
          from the monotony of close family and friends to that former colleague whose life the
          departed touched deeply, to the neighbor in another town who has fond memories etc.
        </Typography>
        <br></br>
        <Typography variant="body">
          Memoryise, therefore, is a platform that has been created to crowdsource people who have
          interacted with the departed at any point of their life offering them an opportunity to
          eulogize the departed and also condole with the family of the departed (bereft). The admin
          has the right to restrict access and also content including the ability to delete posts
          considered offensive to the purpose.
        </Typography>
        <br></br>
        <Typography variant="body">
          Online Condolence Book. Online Obituary. Online Euology. Online Tributes. Death Notice.
          Online Memorials.
        </Typography>
      </Container>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}

export default AboutPage;
