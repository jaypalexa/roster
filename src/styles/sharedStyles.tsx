import { Theme } from '@material-ui/core/styles';

export default (theme: Theme) => ({
  formActionButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
    marginTop: '2rem',
    '& button': {
      marginLeft: '.5rem',
      marginRight: '.5rem',
      textTransform: 'none',
    },
  },
  formAddButtonContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '1rem',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  formAddButtonsContainer: {
    marginBottom: '1.5rem',
    marginTop: '1.5rem',
    '& button': {
      textTransform: 'none',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    }
  },
  hiddenWhenMobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  hiddenWhenNotMobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  horizontalScroll: {
    overflowX: 'scroll' as 'scroll',
  },
  fixedWidthLarge: {
    width: '240px',
  },
  fixedWidthMedium: {
    width: '120px',
  },
  saveButton: {
    background: 'green',
    color: 'white',
    '&:hover': {
      background: 'darkgreen',
    },
  },
  tabButton: {
    maxWidth: '100%',
    textTransform: 'none' as 'none',
  },
});
