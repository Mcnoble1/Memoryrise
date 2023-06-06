import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CustomProgress } from "../../common/CustomProgress";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Photos } from "./Photos";
import { Audios } from "./Audios";
import { Videos } from "./Videos";

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    // bgcolor: "background.paper",
    backgroundColor: "#fff",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  },
  TabPanel: {
    width: "100%",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`scrollable-auto-tabpanel-${index}`} aria-labelledby={`scrollable-auto-tab-${index}`} {...other}>
      <Box p={3}>
        <div>{children}</div>
      </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `memorial-tab-${index}`,
    "aria-controls": `memorial-tabpanel-${index}`,
  };
}

function Gallery({ ObituaryID, user, session }) {
  const classes = useStyles();
  const [showProgress, setShowProgress] = useState(false);
  const [value, setValue] = useState(0);

  // useEffect(() => {
  //   console.log("user", { session, user });
  // });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="memorial tabs">
            <Tab label="Photo" {...a11yProps(0)} />
            {user && user.planId > 0 && <Tab label="Video" {...a11yProps(1)} />}
            {user && user.planId > 0 && <Tab label="Audio" {...a11yProps(2)} />}
          </Tabs>
        </Box>
        {/* Photos */}
        <TabPanel value={value} index={0} className={classes.TabPanel}>
          {value == 0 && <Photos ObituaryID={ObituaryID} session={session} showProgress={showProgress} setShowProgress={setShowProgress} user={user} />}
        </TabPanel>
        {/* Video */}
        <TabPanel value={value} index={1} className={classes.TabPanel}>
          {value == 1 && <Videos ObituaryID={ObituaryID} session={session} showProgress={showProgress} setShowProgress={setShowProgress} user={user} />}
        </TabPanel>
        {/* Audios */}
        <TabPanel value={value} index={2} className={classes.TabPanel}>
          {value == 2 && <Audios ObituaryID={ObituaryID} session={session} showProgress={showProgress} setShowProgress={setShowProgress} user={user} />}
        </TabPanel>
      </Grid>

      {/* Circular Progress */}
      <CustomProgress showProgress={showProgress} />
    </React.Fragment>
  );
}

export default Gallery;
