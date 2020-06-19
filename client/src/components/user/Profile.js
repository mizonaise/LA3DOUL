import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link, Redirect } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';

import { profile } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

const Profile = ({ auth: { user } }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios
      .get('/api/auth')
      .then((res) => {
        const { name, email } = res.data;
        setFormData({ ...formData, name, email });
      })
      .catch((err) => {
        setAlert(
          `Error To Your Information ${err.response.statusText}`,
          'danger'
        );
      });
  };

  const { name, email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(name);
    axios
      .put('/api/update', JSON.stringify({ name, email }), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        // const { name, email } = res.data;
        // setFormData({ ...formData, name, email });
      })
      .catch((err) => {
        const errors = err.response.data.errors;

        if (errors)
          errors.forEach((error) => setAlert(error.msg, 'danger'));
      });
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Profile</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <small className='form-text'>Name</small>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        {/* <div className='form-group'>
          <small className='form-text'>Email</small>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div> */}
        <input type='submit' className='btn btn-primary' value='Update' />
      </form>
    </Fragment>
  );
};

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(Profile);
