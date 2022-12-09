/* eslint-disable indent */
import React from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { Helmet } from 'react-helmet';
import { Buffer } from 'buffer';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import NavBar from 'containers/NavBar/Loadable';

const StyledGoogle = styled.div`
  margin: 0.5rem auto;
`;

const InvalidUserType = styled.h3`
  margin: 3rem;
`;

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      email: '',
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogle = this.handleGoogle.bind(this);
  }

  handleEmailChange = e => {
    e.preventDefault();
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };

  async handleSubmit(e) {
    e.preventDefault();
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    const response = await fetch(
      `${process.env.HOST_URL}/api/login`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: Buffer.from(this.state.password).toString('base64'),
          role: params.type,
          source: 'Website',
        }),
      },
    );
    const jsonResponse = await response.json();
    if (jsonResponse.token) {
      const cookies = new Cookies();
      cookies.set(`login_${jsonResponse.user.role}`, jsonResponse.token, {
        path: '/',
      });
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

  async handleGoogle(credentialResponse) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    const response = await fetch(
      `${process.env.HOST_URL}/api/login`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          password: credentialResponse.credential,
          role: params.type,
          source: 'Google',
        }),
      },
    );
    const jsonResponse = await response.json();
    if (jsonResponse.token) {
      const cookies = new Cookies();
      cookies.set(`login_${jsonResponse.user.role}`, jsonResponse.token, {
        path: '/',
      });
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
          <title> Login </title>
        </Helmet>
        <NavBar />
        {params.type === 'Customer' ||
        params.type === 'Owner' ||
        params.type === 'Admin' ? (
          <GoogleOAuthProvider clientId="14955663052-bavcufb8bmkk27ptjei7vh4i5c610kbq.apps.googleusercontent.com">
            <div className="navBarDropLoginSignup">
              <form className="formContainer" onSubmit={this.handleSubmit}>
                <h3>{`${params.type} Login`}</h3>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    placeholder="Enter email address"
                    value={this.state.email}
                    onChange={this.handleEmailChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={this.handlePasswordChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customCheck1"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheck1"
                    >
                      Remember me
                    </label>
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Log in as {params.type}
                  </button>
                </div>

                <StyledGoogle>
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      console.log(credentialResponse);
                      this.handleGoogle(credentialResponse);
                    }}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </StyledGoogle>

                <p className="forgot-password text-right">
                  Forgot <a href="#">password?</a>
                </p>
              </form>
            </div>
          </GoogleOAuthProvider>
        ) : (
          <center className="navBarDrop">
            <InvalidUserType>Invalid User Type</InvalidUserType>
          </center>
        )}
      </div>
    );
  }
}
