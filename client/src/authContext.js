import { useState, useEffect, useCallback, createContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userPassword, setUserPassword] = useState(null);

  const login = useCallback((jwtToken, id, email, password) => {
    setToken(jwtToken);
    setUserId(id);
    setUserEmail(email);
    setUserPassword(password);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: id,
        token: jwtToken,
        userEmail: email,
        userPassword: password,
        email,
        password,
      }),
    );
  }, []);

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('userData');
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data && data.token) {
      login(data.token, data.userId, data.userEmail, data.userPassword);
    }
    setIsReady(true);
  }, [login]);
  return { login, logout, token, userId, isReady, userEmail, userPassword };
};
