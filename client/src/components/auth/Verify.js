import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { verify } from '../../actions/auth';

const Verify = ({ verify, isAuthenticated, match }) => {
  const [formData, setFormData] = React.useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    verify(email, match.params.token);
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <React.Fragment>
      <h1 className='large text-primary'>Confirm Account</h1>
      <p className='lead'>
        <i className='fas fa-envelope' /> Confirm Your Account
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
        <input type='submit' className='btn btn-primary' value='Confirm' />
      </form>
    </React.Fragment>
  );
};

Verify.propTypes = {
  verify: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { verify })(Verify);