import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AuthContext } from './authContext';

import { useAuth } from './authContext';
import MainPage from '../src/components/MainPage';
import LogIn from './components/LogIn';
import Register from './components/Register';

function App() {
  const { login, logout, token, userId, isReady, userEmail, userPassword } =
    useAuth();
  const isLogin = !!token;

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        token,
        userId,
        isReady,
        isLogin,
        userEmail,
        userPassword,
      }}
    >
      <div className="app">
        <BrowserRouter>
          <Navbar />
          <Switch>
            {isLogin ? (
              <>
                <Route path="/" exact component={MainPage} />
                <Redirect to="/" />
              </>
            ) : (
              <React.Fragment>
                <Route path="/login" component={LogIn}></Route>
                <Route path="/registration" component={Register}></Route>
                <Redirect to="/login" />
              </React.Fragment>
            )}
          </Switch>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
