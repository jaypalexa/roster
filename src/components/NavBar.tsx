import { AppBar, Badge, Box, Button, Drawer, IconButton, Menu, MenuItem, MenuList, Toolbar, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import WifiIcon from '@material-ui/icons/Wifi';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import browserHistory from 'browserHistory';
import MenuItemLink from 'components/MenuItemLink';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import AuthenticationService from 'services/AuthenticationService';
import LogEntryService from 'services/LogEntryService';
import MessageService from 'services/MessageService';

const NavBar: React.FC = (props: any) => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
        '@media print': {
          display: 'none',
        },
      },
      appBar: {
        backgroundColor: 'black',
      },
      badgeMenuItem: {
        marginTop: '-1rem',
        marginLeft: '.25rem',
      },
      drawer: {
        width: 300,
      },
      fullList: {
        width: 'auto',
      },
      homeButton: {
        marginRight: theme.spacing(0),
      },
      signInButton: {
        textTransform: 'none',
      },
      menuButton: {
        marginRight: theme.spacing(0),
      },
      menuSeparator: {
        marginTop: '.5rem',
        marginBottom: '.5rem',
      },
      organizationName: {
        cursor: 'pointer',
        fontWeight: 300,
        '@media (max-width: 768px)': { // hide when mobile
          display: 'none',
        }
      },
      title: {
        flexGrow: 1,
      },
      titleText: {
        cursor: 'pointer',
        fontWeight: 300,
      },
      wifiIcon: {
        paddingTop: '14px',
        paddingRight: '8px',
        paddingBottom: '12px',
        paddingLeft: '12px',
        marginLeft: '-12px',
      },
    }),
  );

  const classes = useStyles();

  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [loggedInOrganizationName, setLoggedInOrganizationName] = useState(localStorage.getItem('lastOrganizationName'));
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuAnchorElement, setMenuAnchorElement] = React.useState<null | HTMLElement>(null);
  const isAccountMenuOpen = Boolean(menuAnchorElement);

  const toggleDrawer = (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (!AuthenticationService.isUserAuthenticated()) return;
    if (event.type === 'keydown' 
      && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) 
    {
      return;
    }
    setIsDrawerOpen(isOpen);
  };

  const onAccountIconButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget);
  };

  const onCloseAccountMenu = () => {
    setMenuAnchorElement(null);
  };
  
  const onSignInClick = () => {
    onCloseAccountMenu();
    browserHistory.push('/sign-in');
  };

  const onSignOutClick = () => {
    setIsDrawerOpen(false);
    LogEntryService.saveLogEntry(`SIGN OUT: ${AuthenticationService.getLastAuthUser()}`);
    AuthenticationService.signOut();
    onCloseAccountMenu();
    browserHistory.push('/sign-in');
  };
  
  const onlineOfflineHandler = (event: Event) => {
    setIsOnline(navigator.onLine);

    if (event.type === 'online') {
      //TODO:  do something when browser goes back online
      //alert('ONLINE');
    } else {
      //TODO:  do something when browser goes offline
      //alert('OFFLINE');
    }
  }

  /* fetch user name */
  useEffect(() => {
    const userName = AuthenticationService.getCognitoUserNameFromToken();
    setLoggedInUserName(userName);
  }, []);

  /* listen for 'user name changed' notifications */
  useEffect(() => {
    const subscription = MessageService.observeUserNameChanged().subscribe(message => {
      if (message) {
        setLoggedInUserName(message.userName);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  /* listen for 'organization name changed' notifications */
  useEffect(() => {
    const subscription = MessageService.observeOrganizationNameChanged().subscribe(message => {
      if (message) {
        setLoggedInOrganizationName(message.organizationName);
        localStorage.setItem('lastOrganizationName', message.organizationName);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  /* listen for 'is update available' notifications */
  useEffect(() => {
    const subscription = MessageService.observeIsUpdateAvailableChanged().subscribe(message => {
      if (message) {
        setIsUpdateAvailable(message.isUpdateAvailable);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  /* add online/offline event handlers */
  useEffect(() => {
    window.addEventListener('online', onlineOfflineHandler);
    window.addEventListener('offline', onlineOfflineHandler);
    return () => {
      window.removeEventListener('online', onlineOfflineHandler);
      window.removeEventListener('offline', onlineOfflineHandler);
    }
  }, []);

  return (
    <Box id='navBar'>
      <Box className={classes.root}>
        <AppBar position='static' className={classes.appBar}>
          <Toolbar>
            <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' onClick={toggleDrawer(true)}>
              <Badge badgeContent={1} color='error' invisible={!isUpdateAvailable} overlap='rectangular'>
                <MenuIcon />
              </Badge>
            </IconButton>
            <span className={classes.wifiIcon}>
              {isOnline ? <WifiIcon /> : <WifiOffIcon />}
            </span>
            <IconButton edge='start' className={classes.homeButton} color='inherit' aria-label='menu' onClick={() => browserHistory.push('/')}>
              <HomeIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              <span className={classes.titleText} onClick={() => browserHistory.push('/')}>ROSTER</span>
              { loggedInOrganizationName ? <span className={classes.organizationName} onClick={() => browserHistory.push('/')}> ({loggedInOrganizationName})</span> : null }
            </Typography>

            {loggedInUserName ?
              <Box>
                <IconButton
                  aria-label='User Account'
                  aria-controls='navbar-account-menu'
                  aria-haspopup='true'
                  onClick={onAccountIconButtonClick}
                  color='inherit'
                  title={loggedInUserName}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  id='navbar-account-menu'
                  anchorEl={menuAnchorElement}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={isAccountMenuOpen}
                  onClose={onCloseAccountMenu}
                >
                  <MenuItem onClick={onSignOutClick}>Sign Out</MenuItem>
                </Menu>
              </Box>
            : <Button className={classes.signInButton} color='inherit' onClick={onSignInClick}>Sign In</Button>
            }
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer classes={{ paper: classes.drawer }} open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box className={classes.fullList} role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} >
          <MenuList>
            <IconButton onClick={toggleDrawer(false)}>
              <ChevronLeftIcon />
            </IconButton>
            <hr className={classes.menuSeparator} />
            <MenuItemLink href='/' content='Home' />
            <hr className={classes.menuSeparator} />
            <MenuItemLink href='/sea-turtles' content='Sea Turtles'/>
            <MenuItemLink href='/holding-tanks' content='Holding Tanks' />
            <MenuItemLink href='/hatchlings-events' content='Hatchlings Events' />
            <MenuItemLink href='/washbacks-events' content='Washbacks Events' />
            <MenuItemLink href='/reports' content='Reports' />
            <MenuItemLink href='/blank-forms' content='Blank Forms' />
            <MenuItemLink href='/organization' content='Organization' />
            <MenuItemLink href='/log-entries' content='Log Entries' />
            <hr className={classes.menuSeparator} />
            <MenuItemLink href='/about-roster' 
              content={<>
                <span>About ROSTER</span>
                <span>
                  <Badge variant='dot' color='error' invisible={!isUpdateAvailable} className={classes.badgeMenuItem} overlap='rectangular'>
                  </Badge>
                </span>
                </>}
            >
            </MenuItemLink>
            <hr className={classes.menuSeparator} />
            <MenuItem onClick={onSignOutClick}>Sign Out</MenuItem>
          </MenuList>
        </Box>
      </Drawer>
    </Box>
  );
};

export default withRouter(NavBar);