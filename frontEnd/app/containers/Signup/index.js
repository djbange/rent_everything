/* eslint-disable indent */
import React from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import NavBar from 'containers/NavBar/Loadable';

const InvalidUserType = styled.h3`
  margin: 3rem;
`;

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      mobile: '',
      dob: '',
      address: '',
      pincode: '',
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleMobileChange = this.handleMobileChange.bind(this);
    this.handleDobChange = this.handleDobChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handlePincodeChange = this.handlePincodeChange.bind(this);

    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleNameChange = e => {
    e.preventDefault();
    this.setState({ name: e.target.value });
  };

  handleEmailChange = e => {
    e.preventDefault();
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };

  handleMobileChange = e => {
    e.preventDefault();
    this.setState({ mobile: e.target.value });
  };

  handleDobChange = e => {
    e.preventDefault();
    this.setState({ dob: e.target.value });
  };

  handleAddressChange = e => {
    e.preventDefault();
    this.setState({ address: e.target.value });
  };

  handlePincodeChange = e => {
    e.preventDefault();
    this.setState({ pincode: e.target.value });
  };

  async handleSignUp(e) {
    e.preventDefault();
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const response = await fetch(
      `${process.env.HOST_URL}/api/signup`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
          auth_method: '',
          role: params.type,
          dob: this.state.dob,
          address: this.state.address,
          pincode: Number(this.state.pincode),
          phone_number: this.state.mobile,
        }),
      },
    );
    const jsonResponse = await response.json();
    if (jsonResponse.token) {
      const cookies = new Cookies();
      cookies.set(`login_${jsonResponse.user.role}`, jsonResponse.token, { path: '/' });
      cookies.set('login', jsonResponse.token, { path: '/' });
      cookies.set('email', jsonResponse.user.email, { path: '/' });
      cookies.set('role', jsonResponse.user.role, { path: '/' });
      sessionStorage.setItem('email', jsonResponse.user.email);
      sessionStorage.setItem('role', jsonResponse.user.role);
      if (jsonResponse.user.role === 'Customer') {
        this.props.history.push('/');
      } else if (jsonResponse.user.role === 'Owner') {
        this.props.history.push('/owner');
      } else if (jsonResponse.user.role === 'Admin') {
        this.props.history.push('/adminDashboard');
      }
    } else {
      alert('Enter correct credentials');
    }
  }

  render() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    return (
      <div>
        <Helmet>
          <title> Signup </title>
        </Helmet>
        <NavBar />
        {params.type === 'Customer' || params.type === 'Owner' ? (
          <div className="navBarDropLoginSignup">
            <form className="formContainer" onSubmit={this.handleSignUp}>
              <h3>{params.type} Sign Up</h3>
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="Enter your name"
                  value={this.state.name}
                  onChange={this.handleNameChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Mobile</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  name="mobile"
                  className="form-control"
                  placeholder="Enter mobile number"
                  value={this.state.mobile}
                  onChange={this.handleMobileChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>DOB</label>
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  placeholder="Enter DOB"
                  value={this.state.dob}
                  onChange={this.handleDobChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Enter address"
                  value={this.state.address}
                  onChange={this.handleAddressChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  className="form-control"
                  placeholder="Enter pincode"
                  value={this.state.pincode}
                  onChange={this.handlePincodeChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  pattern=".{8,}"
                  title="Eight or more characters"
                  className="form-control"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  required
                />
              </div>

              <div className="d-grid">
                <button type="submit" name="signUp" className="btn btn-primary">
                  Sign Up as {params.type}
                </button>
              </div>
              <p className="forgot-password text-right">
                Already a registered {params.type}? <Link to={`/login?type=${params.type}`}>Log in here</Link>
              </p>
            </form>
          </div>
        ) : (
          <center className="navBarDrop">
            <InvalidUserType>Invalid User Type</InvalidUserType>
          </center>
        )}
      </div>
    );
  }
}
