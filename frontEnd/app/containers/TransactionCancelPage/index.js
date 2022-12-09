import React from 'react';
import Cookies from 'universal-cookie';

export default class TransactionCancelPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
  }

  async handleSubmit() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/cust/checkout_cancel`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${cookies.get('login')}`,
        },
        body: JSON.stringify({
          email: cookies.get('email'),
          role: cookies.get('role'),
          token: params.token,
        }),
      },
    );
    const jsonResponse = await response.json();
    if (!response.ok) {
      // || jsonResponse.error == null
      this.props.history.push('/');
      alert('Sorry: There was an error with your payment.');
    } else {
      // map recieved message to results elements
      this.props.history.push('/');
      alert('Sorry: Your payment was interupted.');
    }
  }

  render() {
    return <div />;
  }
}
