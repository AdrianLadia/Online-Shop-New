import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#6bd0ff',
        sub: '#379237',
      },
      secondary: {
        main: '#6bd0ff',
      },
      enter: {
        main: '#F49C5C',
      },
    },
  });

export default theme