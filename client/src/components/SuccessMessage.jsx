import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    color: 'green',
  },
}));

export default function ErrorMessage({ success }) {
  const classes = useStyles();

  return (
    <div>
      <h3 className={classes.root}>{success}</h3>
    </div>
  );
}
