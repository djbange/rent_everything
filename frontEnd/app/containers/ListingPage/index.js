import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import LoadingElement from 'containers/LoadingElement/Loadable';
import Cookies from 'universal-cookie';

import NavBar from 'containers/NavBar/Loadable';
import CarouselComp from 'containers/CarouselComp/Loadable';
import MapComp from 'containers/ListingPage/MapComp/Loadable';
import ReviewComp from 'containers/ListingPage/ReviewComp/Loadable';

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

const HeadingDiv = styled.div`
  margin-bottom: 0.5rem;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const RenterText = styled.p`
  margin: 0;
  font-weight: 500;
`;

const BodyDiv = styled.div`
  @media (min-width: 625px) {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    height: 454px;
  }
`;

const BookingForm = styled.form`
  display: flex;
  flex-flow: row wrap;
  align-items: end;
  justify-content: center;
  gap: 7px;
  margin: 0 auto;
  padding: 1rem 0;
`;

const BookingDivs = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: end;
  gap: 7px;
`;

const Label = styled.p`
  margin: 0;
`;

const Price = styled.h2`
  margin: 0;
  font-size: 31px;
`;

const BookInput = styled.input`
  height: 37px;
`;

const LogInToBook = styled.p`
  font-size: 30px;
  text-align: center;
  max-width: 400px;
  margin: 0.5rem auto;
  padding: 1rem;
  background-color: #666;
  color: white;
  border-radius: 15px;
`;

const DescriptionText = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 13;
  line-clamp: 13;
  @media (min-width: 625px) {
    -webkit-line-clamp: 7;
    line-clamp: 7;
  }
  @media (min-width: 885px) {
    -webkit-line-clamp: 7;
    line-clamp: 7;
  }
`;

const DirecitonsLink = styled.a.attrs({ className: 'btn' })`
  color: white;
  background-color: #a00;
  border-color: #a00;

  &:hover {
    color: white;
    background-color: #333;
    border-color: #333;
  }
`;

const ReviewForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
  margin-top: 0.5rem;
  gap: 10px;
  width: 100%;

  @media (min-width: 600px) {
    width: 60%;
  }

  @media (min-width: 992px) {
    width: 50%;
  }
`;

const ReviewNumInput = styled.input`
  width: 100px;
`;

const ReviewTextArea = styled.textarea`
  width: 100%;
  height: 200px;
  resize: none;
`;

export default class ListingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      zipCode: '',
      description: '',
      renterName: '',
      renterPhone: '',
      renterEmail: '',
      imageLinks: [],
      lat: 0,
      lng: 0,
      navLink: '',
      category: '',
      title: '',
      nightlyPrice: '',
      totalPrice: '',
      reviews: [],
      loading: true,
      writingComplaint: false,
    };

    this.mapContainer = React.createRef();
    this.handleBook = this.handleBook.bind(this);
    this.handleComplaint = this.handleComplaint.bind(this);
    this.handleReview = this.handleReview.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.flipWriteReview = this.flipWriteReview.bind(this);
    this.exitComplaint = this.exitComplaint.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
  }

  componentDidMount() {
    this.loadContent();
    this.loadReviews();
  }

  async loadContent() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/cust/property?productid=${params.id}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${cookies.get('login')}`,
        },
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
      // map recieved message to results elements
      this.setState(
        {
          address: jsonResponse.data[0].address,
          zipCode: jsonResponse.data[0].zipcode,
          imageLinks: jsonResponse.data[0].images,
          lat: jsonResponse.data[0].latitude,
          lng: jsonResponse.data[0].longitude,
          category: jsonResponse.data[0].producttype,
          title: jsonResponse.data[0].productspecification,
          nightlyPrice: jsonResponse.data[0].amount,
          renterName: jsonResponse.data[0].renter_name,
          renterPhone: jsonResponse.data[0].renter_ph,
          renterEmail: jsonResponse.data[0].renter_email,
        },
        () => {
          this.onDataSet();
        },
      );
    }
  }

  async loadReviews() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const response = await fetch(
      `${process.env.HOST_URL}/api/cust/property_reviews?productid=${
        params.id
      }`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
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
      this.setState({ reviews: jsonResponse.data });
    }
  }

  onDataSet() {
    console.log(this.state);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    this.setState({
      startDate: today.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0],
      minEndDate: tomorrow.toISOString().split('T')[0],
      totalPrice: this.state.nightlyPrice,
    });
    const link = `https://www.google.com/maps/search/?api=1&query=${
      this.state.lat
    },${this.state.lng}`;
    this.setState({
      navLink: link,
      loading: false,
    });
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === 'startDate') {
      const start = new Date(event.target.value);
      const end = new Date(this.state.endDate);
      const date4 = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      const buffer = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      this.setState({ minEndDate: date4.toISOString().split('T')[0] });
      if (isNaN(end.getTime()) || start > buffer) {
        this.setState({ endDate: date4.toISOString().split('T')[0] });
        this.setState({ totalPrice: this.state.nightlyPrice });
      } else {
        let days = end.getTime() - start.getTime();
        days /= 1000 * 3600 * 24;
        this.setState({
          totalPrice: parseInt(this.state.nightlyPrice, 10) * days,
        });
      }
    }
    if (event.target.name === 'endDate') {
      const date1 = new Date(this.state.startDate);
      const date2 = new Date(event.target.value);
      let days = date2.getTime() - date1.getTime();
      days /= 1000 * 3600 * 24;
      this.setState({
        totalPrice: parseInt(this.state.nightlyPrice, 10) * days,
      });
    }
  }

  async handleBook(event) {
    if (event != null) {
      event.preventDefault();
    }
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const cookies = new Cookies();
    const response = await fetch(`${process.env.HOST_URL}/api/cust/checkout`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${cookies.get('login')}`,
      },
      body: JSON.stringify({
        email: cookies.get('email'),
        role: cookies.get('role'),
        item_name: this.state.title,
        product_id: params.id,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      }),
    });

    const jsonResponse = await response.json();
    if (!response.ok) {
      alert(
        `${jsonResponse.error.status}: ${jsonResponse.error.title}\n${
          jsonResponse.error.message
        }`,
      );
    } else {
      // open given paypal in popup
      window.open(jsonResponse.url, '_blank');
    }
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
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
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
          product_id: params.id,
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

  async handleReview(event) {
    if (event != null) {
      event.preventDefault();
    }
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const cookies = new Cookies();
    const response = await fetch(
      `${process.env.HOST_URL}/api/cust/write_review`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${cookies.get('login')}`,
        },
        body: JSON.stringify({
          email: cookies.get('email'),
          role: cookies.get('role'),
          product_id: params.id,
          rating: parseInt(this.state.writeReviewRating, 10),
          content: this.state.writeReviewText,
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
      // if gets response that review was successfully submitted
      this.setState({ writeReview: false });
      this.loadReviews();
    }
  }

  flipWriteReview() {
    if (this.state.writeReview !== true) {
      this.setState({ writeReview: true });
    } else {
      this.setState({ writeReview: false });
    }
  }

  render() {
    const cookies = new Cookies();
    const reviews = this.state.reviews.map(rev => (
      <ReviewComp
        reviewer={rev.name}
        reviewText={rev.comments}
        rating={rev.rating}
        date={rev.reviewdate}
      />
    ));

    return (
      <div>
        <Helmet>
          <title> {this.state.title} </title>
        </Helmet>
        <NavBar />
        <div className="navBarDrop">
          <ContentDiv>
            {this.state.loading ? (
              <LoadingElement />
            ) : (
              <div>
                <HeadingDiv>
                  <div>
                    <h1>{this.state.title}</h1>
                    <h3>
                      {this.state.address}, {this.state.zipCode}
                    </h3>
                  </div>
                </HeadingDiv>
                {this.state.imageLinks !== null ? (
                  <CarouselComp imageLinks={this.state.imageLinks} />
                ) : (
                  <div />
                )}
                <BodyDiv>
                  <div>
                    {cookies.get('role') === 'Customer' ? (
                      <div>
                        <BookingForm onSubmit={this.handleBook}>
                          <BookingDivs>
                            <div>
                              <Label>Price</Label>
                              <Price>${this.state.totalPrice}</Price>
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <BookInput
                                type="date"
                                name="startDate"
                                value={this.state.startDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={this.handleInputChange}
                                required
                              />
                            </div>
                          </BookingDivs>
                          <BookingDivs>
                            <div>
                              <Label>End Date</Label>
                              <BookInput
                                type="date"
                                name="endDate"
                                value={this.state.endDate}
                                min={this.state.minEndDate}
                                onChange={this.handleInputChange}
                                required
                              />
                            </div>
                            <input
                              type="submit"
                              className="btn btn-primary"
                              value="Book"
                            />
                          </BookingDivs>
                        </BookingForm>
                      </div>
                    ) : (
                      <LogInToBook>
                        Please Log In To Book This Rental
                      </LogInToBook>
                    )}
                    <h5>More about this rental...</h5>
                    <div>
                      <RenterText>
                        Listing Provided by {this.state.renterName}
                      </RenterText>
                      <RenterText>Phone: {this.state.renterPhone}</RenterText>
                      <RenterText>Email: {this.state.renterEmail}</RenterText>
                    </div>
                    <DescriptionText>{this.state.description}</DescriptionText>
                  </div>
                  <center>
                    <MapComp lat={this.state.lat} lng={this.state.lng} />
                    <DirecitonsLink
                      href={this.state.navLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Directions
                    </DirecitonsLink>
                  </center>
                </BodyDiv>
                <h3>Reviews</h3>
                {cookies.get('role') === 'Customer' ? (
                  <button
                    type="submit"
                    onClick={this.flipWriteReview}
                    className="btn btn-secondary"
                  >
                    Write a Review
                  </button>
                ) : (
                  <div />
                )}
                {cookies.get('role') === 'Customer' && this.state.writeReview ? (
                  <ReviewForm onSubmit={this.handleReview}>
                    <div>
                      <Label>Rating</Label>
                      <ReviewNumInput
                        type="number"
                        name="writeReviewRating"
                        value={this.state.writeReviewRating}
                        min={1}
                        max={5}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>Review</Label>
                      <ReviewTextArea
                        rows="4"
                        name="writeReviewText"
                        value={this.state.writeReviewText}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="submit"
                        className="btn btn-primary"
                        value="Submit Review"
                      />
                    </div>
                  </ReviewForm>
                ) : (
                  <div />
                )}
                <div>{reviews}</div>
              </div>
            )}
          </ContentDiv>
        </div>
      </div>
    );
  }
}
