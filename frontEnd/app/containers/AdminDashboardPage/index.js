/* eslint-disable react/button-has-type */
import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';
import { imgurUrl } from 'utils/imgurUtil';

import NavBar from 'containers/NavBar/Loadable';
import AdminListElem from 'containers/AdminDashboardPage/AdminListElem/Loadable';
import AdminCompElem from 'containers/AdminDashboardPage/AdminCompElem/Loadable';
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

const AdminGrid = styled.div`
  display: grid;
  overflow: hidden;
  grid-template-columns: 1;
  grid-gap: 0.75rem;
  margin-top: 1rem;
`;

const ComplaintContent = styled.p`
  background-color: #dddf;
  padding: 0.5rem;
  border-radius: 10px;
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

const ComplaintPopup = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 1rem;
  gap: 10px;
  width: 80%;
  border-radius: 10px;
  background-color: white;
`;

const ButtonDiv = styled.div`
  display: flex;
  gap: 12px;
`;

const AccessDenied = styled.h3`
  margin: 3rem;
`;

export default class AdminDashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentType: 'complaint',
      pendingListings: [],
      pendingComplaints: [],
      loading: true,
      readingComplaint: false,
      complaintTitle: '',
      complaintOwnerName: '',
      complaintOwnerEmail: '',
      complaintRenterName: '',
      complaintRenterEmail: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.approveListing = this.approveListing.bind(this);
    this.resolveComplaint = this.resolveComplaint.bind(this);
    //this.handleRefund = this.handleRefund.bind(this);
    this.exitComplaint = this.exitComplaint.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
  }

  componentDidMount() {
    const cookies = new Cookies();
    if (cookies.get('role') === 'Admin') {
      // this.loadPendingListings();
      this.loadPendingComplaints();
    }
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async loadPendingListings() {
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/admin/pending_listings`,
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
      const newResults = [];
      jsonResponse.data.forEach(item => {
        const data = {};
        data.listingID = item.productid;
        data.imageUrl = item.defaultimagelink;
        data.title = item.title;
        data.startDate = item.startDate;
        data.endDate = item.endDate;
        newResults.push(data);
      });
      this.setState({ pendingListings: newResults }, () => {
        this.setState({ loading: false });
      });
    }
  }

  async approveListing() {
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/admin/approve_listing`,
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
      // if gets response that complaint was successfully resolved
      this.loadPendingListings();
      alert(`Listing Approved`);
    }
  }

  async loadPendingComplaints() {
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/admin/complaints`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${cookies.get('login')}`,
        },
        // body: JSON.stringify({
        //   email: cookies.get('email'),
        //   role: cookies.get('role'),
        // }),
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
      const newResults = [];
      jsonResponse.data.forEach(item => {
        const data = {};
        data.listingID = item.productid;
        data.imageUrl = item.defaultimagelink;
        data.title = item.productspecification;
        data.ownerName = item.r_name;
        data.ownerEmail = item.r_email;
        data.renterName = item.c_name;
        data.renterEmail = item.c_email;
        data.content = item.complaint;
        data.date = item.complaintdate;
        data.status = item.complaintstatus;
        newResults.push(data);
      });
      this.setState({ pendingComplaints: newResults }, () => {
        this.setState({ loading: false });
      });
    }
  }

  exitComplaint() {
    this.setState({ readingComplaint: false });
  }

  stopPropagation(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  async resolveComplaint() {
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/admin/resolve_complaint`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${cookies.get('login')}`,
        },
        body: JSON.stringify({
          email: cookies.get('email'),
          role: cookies.get('role'),
          complaint_id: this.state.complaintProp,
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
      // if gets response that complaint was successfully resolved
      this.loadPendingComplaints();
      this.setState(
        { readingComplaint: false },
        alert(`Complaint Successfully Resolved`),
      );
    }
  }

  render() {
    const cookies = new Cookies();
    const listings = this.state.pendingListings.map(res => (
      <AdminListElem
        listingID={res.listingID}
        imageUrl={imgurUrl(res.imageUrl)}
        title={res.title}
        startDate={res.startDate}
        endDate={res.endDate}
        approveClick={() => {
          this.approveListing();
        }}
      />
    ));

    const complaints = this.state.pendingComplaints.map(res => (
      <AdminCompElem
        listingID={res.listingID}
        imageUrl={imgurUrl(res.imageUrl)}
        title={res.title}
        ownerName={res.ownerName}
        ownerEmail={res.ownerEmail}
        renterName={res.renterName}
        renterEmail={res.renterEmail}
        complaintClick={() => {
          this.setState(
            {
              complaintTitle: res.title,
              complaintOwnerName: res.ownerName,
              complaintOwnerEmail: res.ownerEmail,
              complaintRenterName: res.renterName,
              complaintRenterEmail: res.renterEmail,
              complaintContent: res.content,
              complaintProp: res.listingID,
            },
            this.setState({
              readingComplaint: true,
            }),
          );
        }}
      />
    ));

    return (
      <div>
        <Helmet>
          <title> Admin Dashboard </title>
        </Helmet>
        <NavBar />
        {this.state.readingComplaint ? (
          <PopupContainer onClick={this.exitComplaint}>
            <ComplaintPopup onClick={this.stopPropagation}>
              <p>
                {`${this.state.complaintRenterName} 
                (${this.state.complaintRenterEmail}) had these problems with 
                "${this.state.complaintTitle}" owned by 
                ${this.state.complaintOwnerName} 
                (${this.state.complaintOwnerEmail})`}
              </p>
              <ComplaintContent>{this.state.complaintContent}</ComplaintContent>
              <ButtonDiv>
                <a
                  className="btn btn-primary"
                  href={`mailto:${
                    this.state.complaintRenterEmail
                  }?subject=Regarding%20your%20complaint%20about%20your%20recent%20rental%20${
                    this.state.complaintTitle
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`Email ${this.state.complaintRenterEmail}`}
                </a>
                <a
                  className="btn btn-primary"
                  href={`mailto:${
                    this.state.complaintOwnerEmail
                  }?subject=A%20renter%20has%20a%20complaint%20about%20your%20rental%20${
                    this.state.complaintTitle
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`Email ${this.state.complaintOwnerEmail}`}
                </a>
                <button
                  className="btn btn-primary"
                  onClick={this.resolveComplaint}
                >
                  Resolve Complaint
                </button>
                <button
                  className="btn btn-primary"
                  onClick={this.handleRefund}
                >
                  Offer Refund
                </button>
              </ButtonDiv>
            </ComplaintPopup>
          </PopupContainer>
        ) : (
          <div />
        )}
        {cookies.get('role') === 'Admin' ? (
          <div className="navBarDrop">
            <ContentDiv>
              <h1>Admin Dashboard</h1>
              <select
                value={this.state.currentType}
                name="currentType"
                onChange={this.handleInputChange}
              >
                <option value="complaint">Pending Complaints</option>
                <option value="listing">Pending Listings</option>
              </select>
              {this.state.loading ? (
                <LoadingElement />
              ) : (
                (() => {
                  switch (this.state.currentType) {
                    case 'listing':
                      return <AdminGrid>{listings}</AdminGrid>;
                    case 'complaint':
                      return <AdminGrid>{complaints}</AdminGrid>;
                    default:
                      return <div />;
                  }
                })()
              )}
            </ContentDiv>
          </div>
        ) : (
          <center className="navBarDrop">
            <AccessDenied>Only Admins Can Access This Page</AccessDenied>
          </center>
        )}
      </div>
    );
  }
}
