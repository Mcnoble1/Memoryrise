import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  AppBar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/system";
import Image from "next/image";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const MainNavigation = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [pageName, setPageName] = useState("HOME");
  const [searchMem, setSearchMem] = useState("");

  const router = useRouter();

  useEffect(() => {
    console.log(router);
    setPageName(getPageName());
  }, [router.pathname]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function logoutHandler() {
    signOut();
  }

  const getPageName = () => {
    let _pageName = "HOME";

    switch (router.pathname) {
      case "/about":
        _pageName = "ABOUT US";
        break;
      case "/memories":
        _pageName = "MEMORIES";
        break;
      case "/create-memory":
        _pageName = "CREATE MEMORY";
        break;
      case "/auth":
        _pageName = "LOGIN";
        break;
      case "/contacts":
        _pageName = "CONTACT US";
        break;
      case "/pricing":
        _pageName = "PRICING";
        break;
      case "/privacy-policy":
        _pageName = "PRIVACY POLICY";
        break;
      case "/terms-and-conditions":
        _pageName = "TERMS & CONDITIONS";
        break;
      case "/testimonials":
        _pageName = "TESTIMONIALS";
        break;

      default:
        _pageName = "HOME";
        break;
    }

    console.log(router.pathname, _pageName);

    return _pageName;
  };

  const searchMemorials = async (e) => {
    if (e.charCode === 13 && searchMem) {
      router.push(`/memories/search?q=${searchMem}`);
    }
  };

  return (
    <React.Fragment>
      <AppBar
        component="nav"
        className="header"
        sx={{ top: "0", boxShadow: "none" }}
        position="fixed"
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              <Link href="/">
                <Box sx={{ p: 1.2 }}>
                  <Image width={220} height={45} src="/LogoCroped.png" />
                </Box>
              </Link>
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "block", md: "none" },
                justifyContent: "flex-end",
                justify: "end",
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "flex" },
                }}
                className="menu2"
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link href="/" sx={{ textDecoration: "none", fontSize: "12px" }}>
                      Home
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link href="/about" sx={{ textDecoration: "none", fontSize: "12px" }}>
                      About Us
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link href="/memories" sx={{ textDecoration: "none", fontSize: "12px" }}>
                      Memories
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link href="/pricing" sx={{ textDecoration: "none", fontSize: "12px" }}>
                      Pricing
                    </Link>
                  </Typography>
                </MenuItem>
                {/* <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Link href="/testimonials" sx={{ textDecoration: "none", fontSize: "12px" }}>
                    Testimonials
                  </Link>
                </Typography>
              </MenuItem> */}
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link href="/contacts" sx={{ textDecoration: "none", fontSize: "12px" }}>
                      Contact Us
                    </Link>
                  </Typography>
                </MenuItem>

                {!session && !loading && (
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link href="/auth" sx={{ textDecoration: "none", fontSize: "12px" }}>
                      Login
                    </Link>
                  </MenuItem>
                )}

                {session && session.roles[0] == "ROLE_USER" && (
                  <MenuItem>
                    <Typography textAlign="center">
                      <Link href="/account" sx={{ textDecoration: "none", fontSize: "12px" }}>
                        My Account
                      </Link>
                    </Typography>
                  </MenuItem>
                )}

                {session && session.roles[0] == "ROLE_ADMIN" && (
                  <MenuItem>
                    <Typography textAlign="center">
                      <Link href="/account/admin" sx={{ textDecoration: "none", fontSize: "12px" }}>
                        Admin
                      </Link>
                    </Typography>
                  </MenuItem>
                )}

                {session && (
                  <MenuItem>
                    <Typography onClick={logoutHandler} style={{ color: "black !important" }}>
                      Logout
                    </Typography>
                  </MenuItem>
                )}

                <MenuItem onClick={handleCloseNavMenu}>
                  <Link href="/create-memory">
                    <Button variant="contained" color="primary">
                      Create A Memory
                    </Button>
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                ml: "-40px",
                display: { xs: "flex", md: "none" },
              }}
            >
              {/* <Image width={100} height={100} src="/logo2.png" /> */}
              {pageName}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <MenuItem>
                <Typography textAlign="center">
                  <Link href="/">Home</Link>
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography textAlign="center">
                  <Link href="/about">About Us</Link>
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography textAlign="center">
                  <Link href="/memories">Memories</Link>
                </Typography>
              </MenuItem>
              <MenuItem>
                <Typography textAlign="center">
                  <Link href="/pricing">Pricing</Link>
                </Typography>
              </MenuItem>
              {/* <MenuItem>
              <Typography textAlign="center">
                <Link href="/testimonials">Testimonials</Link>
              </Typography>
            </MenuItem> */}
              <MenuItem>
                <Typography textAlign="center">
                  <Link href="/contacts">Contact Us</Link>
                </Typography>
              </MenuItem>

              {session && session.roles[0] == "ROLE_USER" && (
                <MenuItem>
                  <Typography textAlign="center">
                    <Link href="/account">My Account</Link>
                  </Typography>
                </MenuItem>
              )}

              {session && session.roles[0] == "ROLE_ADMIN" && (
                <MenuItem>
                  <Typography textAlign="center">
                    <Link href="/account/admin">Admin</Link>
                  </Typography>
                </MenuItem>
              )}

              {!session && !loading && (
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link href="/auth">Login</Link>
                </MenuItem>
              )}

              {session && (
                <MenuItem>
                  <Button variant="outlined" color="primary">
                    <Typography onClick={logoutHandler} style={{ color: "#fff", fontSize: "12px" }}>
                      Logout
                    </Typography>
                  </Button>
                </MenuItem>
              )}

              <MenuItem>
                <Typography textAlign="center">
                  <Link href="/create-memory">
                    <Button variant="contained" disableElevation>
                      <a style={{ color: "#fff", fontSize: "12px" }}>Create A Memory</a>
                    </Button>
                  </Link>
                </Typography>
              </MenuItem>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search memorial"
                  inputProps={{ "aria-label": "search" }}
                  value={searchMem}
                  onChange={(e) => setSearchMem(e.target.value)}
                  onKeyPress={searchMemorials}
                />
              </Search>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </React.Fragment>
  );
};

export default MainNavigation;
