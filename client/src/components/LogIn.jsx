import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  CssBaseline,
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import { AuthContext } from '../authContext';
import ErrorMessage from './ErrorMessage';
import validator from 'validator';
const bcrypt = require('bcryptjs');

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LogIn = () => {
  const classes = useStyles();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const loginHandler = async () => {
    try {
      await axios
        .post(
          '/api/auth/login',
          { ...form },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => {
          login(
            response.data.token,
            response.data.userId,
            form.email,
            form.password,
          );
        });
    } catch (err) {
      console.log(err);
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6)
      return setError('Passwords must consist of minimum 6 symbols');

    if (!validator.isEmail(form.email)) {
      return setError('Enter valid Email!');
    }

    try {
      const response = await axios.get('/api/users/users');

      let validateEmail = response.data.find(
        (item) => form.email === item.email,
      );

      const passwordValid = await bcrypt.compare(
        form.password,
        validateEmail.password,
      );
      if (!passwordValid) {
        return setError('Invalid password');
      }
    } catch (e) {
      setError('Failed to log in');
    }
    try {
      const response = await axios.get('/api/users/users');

      let validateEmail = response.data.find(
        (item) => form.email === item.email,
      );

      if (validateEmail !== undefined)
        return setError('An account with this email already exists');
    } catch (e) {
      setError('Failed to create an account');
    }
  }

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {error && <ErrorMessage error={error}>{error}</ErrorMessage>}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={changeHandler}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={changeHandler}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={loginHandler}
            >
              Log In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/registration" variant="body2">
                  Create an account? Registration
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default LogIn;
