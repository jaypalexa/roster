import { createStyles, ListItem, ListItemText, makeStyles, MenuItem, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemLink: {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
    },
  }),
);

type MenuItemLinkProps = {
  href: string;
  content?: React.ReactNode;
}

const MenuItemLink: React.FC<MenuItemLinkProps> = ({href, content}) => {
  const classes = useStyles();
  return (
    <MenuItem>
      <ListItem className={classes.listItemLink} button component='a' href={href}>
        <ListItemText primary={content} />
      </ListItem>
    </MenuItem>
  );
};

export default MenuItemLink;
