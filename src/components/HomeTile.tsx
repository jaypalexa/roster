import { createStyles, makeStyles, Paper, Theme } from '@material-ui/core';
import browserHistory from 'browserHistory';
import React from 'react';

type HomeTileProps = {
  color: string;
  content: string;
  linkTo: string;
}

const HomeTile: React.FC<HomeTileProps> = ({color, content, linkTo}) => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        background: color, 
        color: 'white',
        cursor: 'pointer',
        fontSize: 'xx-large',
        padding: '3rem', 
        textAlign: 'center', 
        wordBreak: 'keep-all', 
      },
    }),
  );
  const classes = useStyles();

  return (
    <Paper className={classes.root} 
      onClick={() => browserHistory.push(linkTo)}>
      {content}
    </Paper>
  );
};

export default HomeTile;
