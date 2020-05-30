import { Theme } from '@material-ui/core/styles';

export default (theme: Theme) => ({
  fixedWidthMedium: {
    minWidth: '150px',
    width: '150px',
  },
  fixedWidthLarge: {
    minWidth: '240px',
    width: '240px',
  },
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
  htmlReportContainer: {
    //'@media screen': {
      overflowX: 'auto' as 'auto',
    //},
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
  textTransformNone: {
    textTransform: 'none' as 'none',
  },
  whiteSpaceNoWrap: {
    whiteSpace: 'nowrap' as 'nowrap',
  },
});
