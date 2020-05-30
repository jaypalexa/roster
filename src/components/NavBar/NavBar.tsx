import { AppBar, Badge, Button, Drawer, IconButton, Menu, MenuItem, MenuList, Toolbar, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import WifiIcon from '@material-ui/icons/Wifi';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import browserHistory from 'browserHistory';
import MenuItemLink from 'components/MenuItemLink/MenuItemLink';
import useMount from 'hooks/UseMount';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import AuthenticationService from 'services/AuthenticationService';
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
      logInButton: {
        textTransform: 'none',
      },
      menuButton: {
        marginRight: theme.spacing(0),
      },
      menuSeparator: {
        marginTop: '.5rem',
        marginBottom: '.5rem',
      },
      title: {
        flexGrow: 1,
      },
      titleText: {
        cursor: 'pointer',
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
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [menuAnchorElement, setMenuAnchorElement] = React.useState<null | HTMLElement>(null);
  const isAccountMenuOpen = Boolean(menuAnchorElement);

  const toggleDrawer = (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
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
  
  const onLogInClick = () => {
    onCloseAccountMenu();
    browserHistory.push('/login');
  };

  const onLogOutClick = () => {
    AuthenticationService.signOut();
    onCloseAccountMenu();
    browserHistory.push('/login');
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
  useMount(() => {
    const userName = AuthenticationService.getCognitoUserNameFromToken();
    setLoggedInUserName(userName);
  });

  /* listen for 'user name changed' notifications */
  useMount(() => {
    const subscription = MessageService.observeUserNameChanged().subscribe(message => {
      if (message) {
        setLoggedInUserName(message.userName);
      }
    });
    return () => subscription.unsubscribe();
  });

  /* listen for 'is update available' notifications */
  useMount(() => {
    const subscription = MessageService.observeIsUpdateAvailableChanged().subscribe(message => {
      if (message) {
        setIsUpdateAvailable(message.isUpdateAvailable);
      }
    });
    return () => subscription.unsubscribe();
  });

  /* add online/offline event handlers */
  useMount(() => {
    window.addEventListener('online', onlineOfflineHandler);
    window.addEventListener('offline', onlineOfflineHandler);
    return () => {
      window.removeEventListener('online', onlineOfflineHandler);
      window.removeEventListener('offline', onlineOfflineHandler);
    }
  });

  return (
    <div id='navBar'>
      <div className={classes.root}>
        <AppBar position='static' className={classes.appBar}>
          <Toolbar>
            <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' onClick={toggleDrawer(true)}>
              <Badge badgeContent={1} color='error' invisible={!isUpdateAvailable}>
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
            </Typography>

            {loggedInUserName ?
              <div>
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
                  <MenuItem onClick={onLogOutClick}>Log Out</MenuItem>
                </Menu>
              </div>
            : <Button className={classes.logInButton} color='inherit' onClick={onLogInClick}>Log In</Button>
            }
          </Toolbar>
        </AppBar>
      </div>

      <Drawer classes={{ paper: classes.drawer }} open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div className={classes.fullList} role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} >
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
            <hr className={classes.menuSeparator} />
            <MenuItemLink href='/about-roster' 
              content={<>
                <span>About ROSTER</span>
                <span className={classes.badgeMenuItem}>
                  <Badge variant='dot' color='error' invisible={!isUpdateAvailable}>
                  </Badge>
                </span>
                </>}
            >
            </MenuItemLink>
            <hr className={classes.menuSeparator} />
            <MenuItem onClick={onLogOutClick}>Log Out</MenuItem>
          </MenuList>
        </div>
      </Drawer>
    </div>
  );
};

export default withRouter(NavBar);