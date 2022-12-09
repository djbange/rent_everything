/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

import NavBar from 'containers/NavBar/Loadable';

const Message = styled.h1`
  padding-top: 1rem; 
`;

export default function NotFound() {
  return (
    <div>
      <NavBar />
      <Message>
        <FormattedMessage {...messages.header} />
      </Message>
    </div>
  );
}
