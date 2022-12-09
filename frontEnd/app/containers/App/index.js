/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LandingPage from 'containers/LandingPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Login from 'containers/Login/Loadable';
import Signup from 'containers/Signup/Loadable';
import ListingPage from 'containers/ListingPage/Loadable';
import TransactionSuccessPage from 'containers/TransactionSuccessPage/Loadable';
import TransactionCancelPage from 'containers/TransactionCancelPage/Loadable';
import PastBookingsPage from 'containers/PastBookingsPage/Loadable';
import AdminDashboardPage from 'containers/AdminDashboardPage/Loadable';

import GlobalStyle from '../../global-styles';

export default function App() {
  return (
    <div>
      <Helmet>
        <title> Rent Everything </title>
      </Helmet>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/listing" component={ListingPage} />
        <Route exact path="/success" component={TransactionSuccessPage} />
        <Route exact path="/cancel" component={TransactionCancelPage} />
        <Route exact path="/pastBookings" component={PastBookingsPage} />
        <Route exact path="/adminDashboard" component={AdminDashboardPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </div>
  );
}
