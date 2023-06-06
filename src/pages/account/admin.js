import React from "react";
import { getSession } from "next-auth/react";
import Container from "@mui/material/Container";
import Copyright from "../../components/layout/Copyright";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProfilePage from "../../components/account/Profile";
import Settings from "../../components/account/Settings";
import AllMemorials from "../../components/admin/AllMemorials";
import Users from "../../components/admin/Users";
import Testimonials from "../../components/admin/Testimonials";
import Payments from "../../components/admin/Payments";
import PricingPlans from "../../components/admin/Plans";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other} style={{ width: "100%" }}>
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

const AdminPage = ({ session, data }) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <React.Fragment>
      <Container sx={{ mt: 10 }}>
        <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", mt: "40px" }}>
          <Tabs orientation="vertical" variant="scrollable" value={tabValue} onChange={handleChange} aria-label="Vertical tabs example" sx={{ borderRight: 1, borderColor: "divider" }}>
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Memorials" {...a11yProps(1)} />
            <Tab label="Users" {...a11yProps(2)} />
            <Tab label="Settings" {...a11yProps(3)} />
            <Tab label="Testimonials" {...a11yProps(4)} />
            <Tab label="Payments" {...a11yProps(5)} />
            <Tab label="Plans" {...a11yProps(6)} />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <ProfilePage session={session} data={data} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <AllMemorials session={session} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Users session={session} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Settings session={session} />
          </TabPanel>
          <TabPanel value={tabValue} index={4}>
            <Testimonials />
          </TabPanel>
          <TabPanel value={tabValue} index={5}>
            <Payments />
          </TabPanel>
          <TabPanel value={tabValue} index={6}>
            <PricingPlans session={session} />
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

  if (!session || session.roles[0] != "ROLE_ADMIN") {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/${session.userID}`);
  const data = await res.json();

  return {
    props: { session, data },
  };
}

export default AdminPage;
