import { createStyles, makeStyles, Paper, Theme } from '@material-ui/core';
import browserHistory from 'browserHistory';
import ChipsPanel, { ChipData } from 'components/ChipsPanel';
import React from 'react';

type HomeTileProps = {
  color: string;
  content: string;
  linkTo: string;
  chipData?: ChipData[];
}

const HomeTile: React.FC<HomeTileProps> = ({color, content, linkTo, chipData}) => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        background: color, 
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        fontSize: 'xx-large',
        justifyContent: 'center',
        padding: '3rem', 
        textAlign: 'center', 
        wordBreak: 'keep-all', 
      },
    }),
  );
  const classes = useStyles();

  return (
    <Paper className={classes.root} onClick={() => browserHistory.push(linkTo)}>
      {content}
      {chipData ? <ChipsPanel chipData={chipData} /> : null}
    </Paper>
  );
};

export default HomeTile;
