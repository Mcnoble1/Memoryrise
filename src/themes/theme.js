import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

let theme = createTheme({
  palette: {
    primary: {
      // main: "#556cd6",
      // main: "#873abb",
      main: "#0A435D",
    },
    secondary: {
      // main: "#19857b",
      main: "#4593a7",
    },
    error: {
      main: red.A400,
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
