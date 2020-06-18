import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { forget } from '../../actions/auth';

const Forget = ({ forget, isAuthenticated }) => {
  const [formData, setFormData] = React.useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    forget(email);
  };
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <React.Fragment>
      <h1 className='large text-primary'>Forget Password</h1>
      <p className='lead'>
        <i className='fas fa-envelope' /> Reset your password
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Send' />
      </form>
    </React.Fragment>
  );
};

Forget.propTypes = {
  forget: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { forget })(Forget);
