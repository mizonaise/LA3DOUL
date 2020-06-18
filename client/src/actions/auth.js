import axios from 'axios';
import { setAlert } from './alert';
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  VERIFY_FAIL,
  VERIFY_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGOUT,
  FORGET_FAIL,
  FORGET_SUCCESS,
  RESET_FAIL,
  RESET_SUCCESS,
} from './types';

import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);

  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/login', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors)
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/register', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    // dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors)
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const verify = (email, email_token) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, email_token });

  try {
    const res = await axios.post('/api/verify_email', body, config);

    dispatch({
      type: VERIFY_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors)
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));

    dispatch({
      type: VERIFY_FAIL,
    });
  }
};

export const reset = (email, password, email_token) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password, email_token });

  try {
    const res = await axios.post('/api/reset_password', body, config);

    dispatch({
      type: RESET_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors)
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));

    dispatch({
      type: RESET_FAIL,
    });
  }
};

export const forget = (email) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email });

  try {
    const res = await axios.post('/api/forget_password', body, config);

    dispatch({
      type: FORGET_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors)
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));

    dispatch({
      type: FORGET_FAIL,
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
