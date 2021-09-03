import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import DeleteIcon from '@material-ui/icons/Delete';
import { Container } from '@material-ui/core';
import { useContext, useState, useCallback, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { AuthContext } from '../authContext';

import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icons: {
    margin: theme.spacing(1, 1, 1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  task: {
    display: 'flex',
    margin: theme.spacing(1, 0, 0, 2),
  },
  tasks: {
    display: 'flex',
    margin: theme.spacing(1, 0, 0),
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
  completed: {
    textDecoration: 'line-through',
    letterSpacing: '2px',
  },
  important: {
    color: 'orange',
  },
}));

const MainPage = () => {
  const classes = useStyles();
  const [text, setText] = useState('');
  const { userId } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);

  const getTodo = useCallback(async () => {
    try {
      await axios
        .get('/api/todo', {
          headers: {
            'Content-Type': 'application/json',
          },
          params: { userId },
        })
        .then((response) => setTodos(response.data));
    } catch (err) {
      console.log(err);
    }
  }, [userId]);

  const createTodo = useCallback(async () => {
    if (!text) return null;
    try {
      await axios
        .post(
          '/api/todo/add',
          { text, userId },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => {
          setTodos([...todos], response.data);
          setText('');
          getTodo();
        });
    } catch (err) {
      console.log(err);
    }
  }, [text, userId, todos, getTodo]);

  useEffect(() => {
    getTodo();
  }, [getTodo]);

  const removeTodo = async (id) => {
    try {
      await axios
        .delete(
          `/api/todo/delete/${id}`,
          { id },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(() => getTodo());
    } catch (err) {
      console.log(err);
    }
  };

  const completeTodo = useCallback(
    async (id) => {
      try {
        await axios
          .put(
            `/api/todo/complete/${id}`,
            { id },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then((response) => {
            setTodos([...todos], response.data);
            getTodo();
          });
      } catch (err) {
        console.log(err);
      }
    },
    [getTodo, todos],
  );

  const importantTodo = useCallback(
    async (id) => {
      try {
        await axios
          .put(
            `/api/todo/important/${id}`,
            { id },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then((response) => {
            setTodos([...todos], response.data);
            getTodo();
          });
      } catch (err) {
        console.log(err);
      }
    },
    [getTodo, todos],
  );

  return (
    <div>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography gutterBottom variant="h4" component="h2">
            Add new task
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={(e) => e.preventDefault()}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="text"
                  label="Task"
                  name="input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={createTodo}
            >
              Add
            </Button>
          </form>
          <Typography gutterBottom variant="h4" component="h2">
            Active tasks
          </Typography>
        </div>

        {todos.map((todo, index) => {
          let cls = [];
          if (todo.completed) {
            cls.push(classes.completed);
          }
          if (todo.important) {
            cls.push(classes.important);
          }

          return (
            <Paper className={classes.tasks} key={todo._id}>
              <Grid item xs={9}>
                <div className={classes.task}>
                  <Typography>{index + 1}. </Typography>
                  <Typography className={cls.join(' ')}>{todo.text}</Typography>
                </div>
              </Grid>
              <Grid item xs={3} className={classes.icons}>
                <CheckIcon
                  style={{ color: 'green' }}
                  onClick={() => {
                    completeTodo(todo._id);
                  }}
                />
                <WarningIcon
                  style={{ color: 'orange', margin: '0px 5px 0px 5px' }}
                  onClick={() => {
                    importantTodo(todo._id);
                  }}
                />
                <DeleteIcon
                  style={{ color: 'red' }}
                  onClick={() => {
                    removeTodo(todo._id);
                  }}
                />
              </Grid>
            </Paper>
          );
        })}
      </Container>
    </div>
  );
};

export default MainPage;
