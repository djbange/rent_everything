import React from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  z-index: 100;

  display: flex;
  align-items: center;

  width: 100%;
  height: 60px;

  background-color: #ddd;
  border-bottom: 1px solid #ccc;

  padding: 0 0.5rem;
`;

const Logo = styled.img`
  height: 30px;
`;

const LogoLink = styled(Link).attrs({ className: 'btn' })`
  background-color: #0000;
  border-color: #0000;
  padding: 0.35rem;

  &:hover {
    background-color: #bbbf;
    border-color: #bbbf;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const NameLink = styled(LogoLink)`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const LeftAlignDiv = styled.div`
  margin-left: auto;
`;

const LoginDiv = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DropdownDiv = styled.div`
  position: relative;
  cursor: pointer;
  background-color: #dddf;
  border-radius: 0.375rem;
`;

const LoginDropdownDiv = styled(DropdownDiv)`
  width: 150px;
`;

const DropdownDisplay = styled.p.attrs({ className: 'btn' })`
  color: white;
  background-color: #666;
  border-color: #666;
  width: 100%;
  margin: 0;

  &:hover {
    color: white;
    background-color: #333;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 37px;
  width: 100%;
  flex-flow: column wrap;

  background-color: #ddd;
  border-radius: 0 0 0.375rem 0.375rem;
`;

const DropdownLink = styled(Link).attrs({ className: 'btn' })`
  color: white;
  background-color: #666;
  border-color: #666;
  margin: 0;
  text-align: left;
  width: 100%;
  border-top: 1px solid #999;
  border-bottom: 1px solid #999;

  &:hover {
    color: white;
    background-color: #333;
    border-color: #333;
  }

  &:not(:last-child) {
    border-radius: 0;
  }
  &:first-child {
    border-top: 1px solid white;
  }
  &:last-child {
    border-bottom: none;
    border-radius: 0 0 0.375rem 0.375rem;
  }
`;

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      signup: false,
      user: false,
    };
    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    googleLogout();
    const cookies = new Cookies();
    cookies.remove(`login_${cookies.get('role')}`);
    cookies.remove('login');
    cookies.remove('email');
    cookies.remove('role');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('role');
  }

  render() {
    const name = require('images/name.svg');
    const logo = require('images/logo.svg');
    const cookies = new Cookies();
    return (
      <Nav>
        <LogoLink to="/">
          <Logo src={logo} />
        </LogoLink>
        <NameLink to="/">
          <Logo src={name} />
        </NameLink>
        <LeftAlignDiv>
          {(() => {
            switch (cookies.get('role')) {
              case 'Customer':
                return (
                  <DropdownDiv>
                    <DropdownDisplay
                      onClick={() => {
                        if (this.state.user) {
                          event.target.style.borderRadius = '0.375rem';
                          this.setState({ user: false });
                        } else {
                          event.target.style.borderRadius =
                            '0.375rem 0.375rem 0 0';
                          this.setState({ user: true });
                        }
                      }}
                    >
                      {cookies.get('email')}
                    </DropdownDisplay>
                    {this.state.user && (
                      <DropdownContainer>
                        <DropdownLink to="/pastBookings">
                          Past Bookings
                        </DropdownLink>
                        <DropdownLink to="/" onClick={this.logOut}>
                          Log Out
                        </DropdownLink>
                      </DropdownContainer>
                    )}
                  </DropdownDiv>
                );
              case 'Owner':
                return (
                  <DropdownDiv>
                    <DropdownDisplay
                      onClick={() => {
                        if (this.state.user) {
                          event.target.style.borderRadius = '0.375rem';
                          this.setState({ user: false });
                        } else {
                          event.target.style.borderRadius =
                            '0.375rem 0.375rem 0 0';
                          this.setState({ user: true });
                        }
                      }}
                    >
                      {cookies.get('email')}
                    </DropdownDisplay>
                    {this.state.user && (
                      <DropdownContainer>
                        <DropdownLink to="/owner">Owner Home</DropdownLink>
                        <DropdownLink to="/" onClick={this.logOut}>
                          Log Out
                        </DropdownLink>
                      </DropdownContainer>
                    )}
                  </DropdownDiv>
                );
              case 'Admin':
                return (
                  <DropdownDiv>
                    <DropdownDisplay
                      onClick={() => {
                        if (this.state.user) {
                          event.target.style.borderRadius = '0.375rem';
                          this.setState({ user: false });
                        } else {
                          event.target.style.borderRadius =
                            '0.375rem 0.375rem 0 0';
                          this.setState({ user: true });
                        }
                      }}
                    >
                      {cookies.get('email')}
                    </DropdownDisplay>
                    {this.state.user && (
                      <DropdownContainer>
                        <DropdownLink to="/adminDashboard">
                          Admin Dashboard
                        </DropdownLink>
                        <DropdownLink to="/" onClick={this.logOut}>
                          Log Out
                        </DropdownLink>
                      </DropdownContainer>
                    )}
                  </DropdownDiv>
                );
              default:
                return (
                  <LoginDiv>
                    <LoginDropdownDiv>
                      <DropdownDisplay
                        onClick={() => {
                          if (this.state.login) {
                            event.target.style.borderRadius = '0.375rem';
                            this.setState({ login: false });
                          } else {
                            event.target.style.borderRadius =
                              '0.375rem 0.375rem 0 0';
                            this.setState({ login: true });
                          }
                        }}
                      >
                        Log in
                      </DropdownDisplay>
                      {this.state.login && (
                        <DropdownContainer>
                          <DropdownLink to="/login?type=Customer">
                            For Customers
                          </DropdownLink>
                          <DropdownLink to="/login?type=Owner">
                            For Owners
                          </DropdownLink>
                          <DropdownLink to="/login?type=Admin">
                            For Admins
                          </DropdownLink>
                        </DropdownContainer>
                      )}
                    </LoginDropdownDiv>
                    <LoginDropdownDiv>
                      <DropdownDisplay
                        onClick={() => {
                          if (this.state.signup) {
                            event.target.style.borderRadius = '0.375rem';
                            this.setState({ signup: false });
                          } else {
                            event.target.style.borderRadius =
                              '0.375rem 0.375rem 0 0';
                            this.setState({ signup: true });
                          }
                        }}
                      >
                        Sign up
                      </DropdownDisplay>
                      {this.state.signup && (
                        <DropdownContainer>
                          <DropdownLink to="/signup?type=Customer">
                            For Customers
                          </DropdownLink>
                          <DropdownLink to="/signup?type=Owner">
                            For Owners
                          </DropdownLink>
                        </DropdownContainer>
                      )}
                    </LoginDropdownDiv>
                  </LoginDiv>
                );
            }
          })()}
        </LeftAlignDiv>
      </Nav>
    );
  }
}
