import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';

import LandingPage from '../index';

describe('<LandingPage />', () => {
  it('should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale="en">
        <LandingPage />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
