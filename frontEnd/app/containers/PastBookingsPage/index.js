import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';
import { imgurUrl } from 'utils/imgurUtil';

import NavBar from 'containers/NavBar/Loadable';
import BookingElem from 'containers/PastBookingsPage/BookingElem/Loadable';
import LoadingElement from 'containers/LoadingElement/Loadable';

const ContentDiv = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  overflow: hidden;

  @media (min-width: 1200px) {
    width: 1200px;
    padding: 1rem 0.5rem;
  }
`;

const BookingGrid = styled.div`
  display: grid;
  overflow: hidden;
  grid-template-columns: 1;
  grid-gap: 0.75rem;
  margin-top: 1rem;
`;

const Label = styled.p`
  margin: 0;
`;

const ComplaintTextArea = styled.textarea`
  width: 100%;
  height: 200px;
  resize: none;
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0005;
  z-index: 101;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ComplaintPopup = styled.form`
  display: flex;
  flex-flow: column nowrap;
  padding: 1rem;
  gap: 10px;
  width: 80%;
  border-radius: 10px;
  background-color: white;
`;

export default class PastBookingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      loading: true,
      writingComplaint: false,
      complaintTitle: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleComplaint = this.handleComplaint.bind(this);
    this.exitComplaint = this.exitComplaint.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
  }

  componentDidMount() {
    this.onLoad();
  }

  async onLoad() {
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/cust/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${cookies.get('login')}`,
        },
        body: JSON.stringify({
          email: cookies.get('email'),
          role: cookies.get('role'),
        }),
      },
    );

    const jsonResponse = await response.json();
    if (!response.ok) {
      // || jsonResponse.error == null
      alert(
        `${jsonResponse.error.status}: ${jsonResponse.error.title}\n${
          jsonResponse.error.message
        }`,
      );
    } else {
      // map recieved message to results elements
      const newBooking = [];
      jsonResponse.data.forEach(item => {
        const data = {};
        data.listingID = item.productid;
        data.imageUrl = item.defaultimagelink;
        data.title = item.productspecification;
        data.startDate = item.startdate;
        data.endDate = item.enddate;
        data.amount = item.amountpaid;
        data.status = item.status;
        newBooking.push(data);
      });
      this.setState({ bookings: newBooking }, () => {
        this.setState({ loading: false });
      });
    }
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  exitComplaint() {
    this.setState({ writingComplaint: false });
  }

  stopPropagation(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  // complaint info to send
  // api/cust/add_complaint
  // email, role, product_id, content
  // display complaint successfully filed
  async handleComplaint(event) {
    if (event != null) {
      event.preventDefault();
    }
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/cust/add_complaint`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${cookies.get('login')}`,
        },
        body: JSON.stringify({
          email: cookies.get('email'),
          role: cookies.get('role'),
          product_id: this.state.complaintProp,
          content: this.state.writeComplaintText,
        }),
      },
    );
    const jsonResponse = await response.json();
    if (!response.ok) {
      alert(
        `${jsonResponse.error.status}: ${jsonResponse.error.title}\n${
          jsonResponse.error.message
        }`,
      );
    } else {
      // if gets response that complaint was successfully submitted
      this.setState(
        { writingComplaint: false },
        alert(`Complaint Successfully Submitted`),
      );
    }
  }

  render() {
    const results = this.state.bookings.map(res => (
      <BookingElem
        listingID={res.listingID}
        imageUrl={imgurUrl(res.imageUrl)}
        title={res.title}
        startDate={res.startDate}
        endDate={res.endDate}
        amount={res.amount}
        status={res.status}
        complaintClick={() => {
          this.setState(
            {
              complaintTitle: res.title,
              complaintProp: res.listingID,
            },
            this.setState({
              writingComplaint: true,
            }),
          );
        }}
      />
    ));

    return (
      <div>
        <Helmet>
          <title> Past Bookings </title>
        </Helmet>
        <NavBar />
        {this.state.writingComplaint ? (
          <PopupContainer onClick={this.exitComplaint}>
            <ComplaintPopup
              onClick={this.stopPropagation}
              onSubmit={this.handleComplaint}
            >
              <div>
                <Label>
                  {`Please list the problems you've had with "${
                    this.state.complaintTitle
                  }"`}
                </Label>
                <ComplaintTextArea
                  rows="4"
                  name="writeComplaintText"
                  value={this.state.writeComplaintText}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Submit Complaint"
                />
              </div>
            </ComplaintPopup>
          </PopupContainer>
        ) : (
          <div />
        )}
        <div className="navBarDrop">
          <ContentDiv>
            <h1>Past Bookings</h1>
            {this.state.loading ? (
              <LoadingElement />
            ) : (
              <BookingGrid>{results}</BookingGrid>
            )}
          </ContentDiv>
        </div>
      </div>
    );
  }
}
