import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    color: theme.palette.secondary.main,
  },
}));

export default function ErrorMessage({ error }) {
  const classes = useStyles();

  return (
    <div>
      <h3 className={classes.root}>{error}</h3>;
    </div>
  );
}
