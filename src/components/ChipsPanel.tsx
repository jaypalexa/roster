import { Avatar, Box, Chip, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

export interface ChipData {
  label: string;
  avatar: string | number;
}

type ChipsPanelProps = {
  chipData: Array<ChipData>;
}

const ChipsPanel: React.FC<ChipsPanelProps> = ({chipData}) => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
      },
      chip: {
        borderColor: 'white',
        color: 'white',
        cursor: 'pointer',
        margin: theme.spacing(0.5),
        '& div': {
          backgroundColor: 'rgba(200, 200, 200, .5)',
          color: 'white !important',
        }
      },
    }),
  );
  const classes = useStyles();

  return (
    <Box component="ul" className={classes.root}>
      {chipData.map((data, index) => {
        return (
          <li key={index}>
            <Chip variant='outlined'
              label={data.label}
              avatar={<Avatar>{data.avatar}</Avatar>}
              className={classes.chip}
            />
          </li>
        );
      })}
    </Box>
  );
};

export default ChipsPanel;
