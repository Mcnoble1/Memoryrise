import React, { useEffect } from "react";
import { getSession } from "next-auth/react";
import Container from "@mui/material/Container";
import Copyright from "../../components/layout/Copyright";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProfilePage from "../../components/account/Profile";
import MyMemorials from "../../components/account/MyMemorials";
import Settings from "../../components/account/Settings";
import Billing from "../../components/account/Billing";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Account = ({ session, data, inv }) => {
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    let timer;

    if (inv.length) {
      if (!inv[0].paid) {
        setTabValue(3);

        timer = setTimeout(() => {
          let el = document.getElementById("paywithmpesa");
          if (el) {
            el.click();
          }
        }, 3000);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [inv]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <React.Fragment>
      <Container sx={{ mt: 10 }}>
        <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", mt: "40px" }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="My Memorials" {...a11yProps(1)} />
            <Tab label="Settings" {...a11yProps(2)} />
            <Tab label="Billing" {...a11yProps(3)} />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <ProfilePage session={session} data={data} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <MyMemorials session={session} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Settings session={session} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Billing session={session} />
          </TabPanel>
        </Box>
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
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    sessionStorage.setItem("page", "/account");
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/${session.userID}`);
  const data = await res.json();

  const res2 = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payments/invoices/${session.userID}`
  );
  const inv = await res2.json();

  // console.log(inv);

  return {
    props: { session, data, inv },
  };
}

export default Account;
