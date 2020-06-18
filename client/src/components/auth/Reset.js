import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Fragment, useState } from 'react';

import { reset } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

const Reset = ({ setAlert, reset, isAuthenticated, match }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confPassword: '',
  });

  const { email, password, confPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confPassword) {
      setAlert('Passwords do not match', 'danger');
    } else {
      reset(email, password, match.params.token);
    }
  };

  if (isAuthenticated) return <Redirect to='/dashboard' />;

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='New Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
            required
            minLength='8'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Your New Password'
            name='confPassword'
            value={confPassword}
            onChange={(e) => onChange(e)}
            required
            minLength='8'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='reset' />
      </form>
    </Fragment>
  );
};

Reset.propTypes = {
  setAlert: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, reset })(Reset);