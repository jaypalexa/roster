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
      }
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
      }
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
      }
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </ThemeProvider>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.register(); // <<== DOING THIS WITH A CUSTOM onUpdate() HANDLER IN App.tsx
