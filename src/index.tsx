import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import App from 'components/App';
import { AppContextProvider } from 'contexts/AppContext';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.sass';

const theme = createMuiTheme({
  overrides: {
    MuiBreadcrumbs: {
      root: {
        marginBottom: '1rem',
        '@media print': {
          display: 'none',
        },
      },
      li: {
        '& a': {
          color: 'blue',
          textDecoration: 'none',
        },
      },
    },
    MuiButtonBase: {
      root: {
        '&:disabled': {
          cursor: 'not-allowed',
          pointerEvents: 'auto',
        },
        '@media print': {
          display: 'none',
        },
      },
    },
    MuiCheckbox: {
      root: {
        paddingTop: '0px',
        paddingBottom: '0px',
      },
    },
    MuiDivider: {
      root: {
        marginTop: '1rem',
        marginBottom: '1rem',
      },
    },
    MuiInputBase: {
      input: {
        '&$disabled': {
          cursor: 'not-allowed',
        },
      },
    },
    MuiFormControlLabel: {
      root: {
        '&$disabled': {
          cursor: 'not-allowed',
        },
      },
    },
    MuiPaper: {
      elevation1: {
        '@media print': {
          boxShadow: 'none',
        },
      },
      root: {
        '@media print': {
          background: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiRadio: {
      root: {
        paddingTop: '3px',
        paddingBottom: '3px',
      },
    },
    MuiSelect: {
      select: {
        '&$disabled': {
          cursor: 'not-allowed',
        },
      },
    },
    MuiTypography: {
      h1: {
        fontSize: '2rem',
      },
      h2: {
        fontSize: '1.25rem',
      },
      h3: {
        fontSize: '1rem',
      },
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
