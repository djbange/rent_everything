import React from 'react';
import Cookies from 'universal-cookie';

export default class TransactionSuccessPage extends React.Component {
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
      `${process.env.HOST_URL}/api/cust/checkout_success`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${cookies.get('login')}`,
        },
        body: JSON.stringify({
          email: cookies.get('email'),
          role: cookies.get('role'),
          paymentId: params.paymentId,
          token: params.token,
          payerID: params.PayerID,
        }),
      },
    );
    const jsonResponse = await response.json();
    if (!response.ok) {
      // || jsonResponse.error == null
      this.props.history.push('/');
      alert('Sorry: Your payment could not be completed at this time.');
    } else {
      // map recieved message to results elements
      this.props.history.push('/');
    }
  }

  render() {
    return <div />;
  }
}
