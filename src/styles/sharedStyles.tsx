import { Theme } from '@material-ui/core/styles';

const sharedStyles = (theme: Theme) => ({
  dataTableContainer: {
    borderColor: '#EFEFEF',
    borderRadius: '.5rem',
    borderStyle: 'solid',
    marginBottom: '2rem',
  },
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
  hidden: {
    display: 'none',
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
  hoverTextWhite: {
    '&:hover': {
      color: 'white',
    }
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
  textAlignCenter: {
    textAlign: 'center' as 'center',
  },
  textTransformNone: {
    textTransform: 'none' as 'none',
  },
  whiteSpaceNoWrap: {
    whiteSpace: 'nowrap' as 'nowrap',
  },
});

export default sharedStyles;
