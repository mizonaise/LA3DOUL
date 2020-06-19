import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import store from './store';

import Login from './components/auth/Login';
import Reset from './components/auth/Reset';
import Forget from './components/auth/Forget';
import Verify from './components/auth/Verify';
import Alert from './components/layout/Alert';
import Profile from './components/user/Profile';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Landing from './components/layout/Landing';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) setAuthToken(localStorage.token);

const App = () => {
  React.useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <React.Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/forget_password' component={Forget} />
              <Route exact path='/reset_password/:token' component={Reset} />
              <Route exact path='/verify_email/:token' component={Verify} />
              <PrivateRoute exact path='/profile' component={Profile} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
            </Switch>
          </section>
        </React.Fragment>
      </Router>
    </Provider>
  );
};

export default App;
