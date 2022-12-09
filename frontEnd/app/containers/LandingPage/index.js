import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { imgurUrl } from 'utils/imgurUtil';

import NavBar from 'containers/NavBar/Loadable';
import RentalSearchResult from 'containers/LandingPage/RentalSearchResult/Loadable';
import LoadingElement from 'containers/LoadingElement/Loadable';

const SearchGrid = styled.div`
  display: grid;
  overflow: hidden;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
  grid-gap: 0.5rem;
  margin: 1.25rem;
`;
const SearchBar = styled.form`
  display: flex;
  flex-flow: row wrap;
  align-items: end;
  gap: 7px;
  width: 80%;
  margin: 0 auto;
  padding: 1rem 0;
`;
const SearchLabel = styled.p`
  margin: 0;
`;
const SearchSelect = styled.select`
  height: 37px;
  width: 120px;
`;
const SearchInput = styled.input`
  height: 37px;
`;
const SearchZip = styled(SearchInput)`
  width: 200px;
`;
const SearchNumInput = styled(SearchInput)`
  width: 100px;
`;
const DateBox = styled.div`
  display: flex;
`;
const SearchSubmit = styled(SearchInput)`
  width: 140px;
  margin-top: 7px;
`;

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'All',
      zipCode: '',
      priceMin: '0',
      priceMax: '',
      distance: '20000',
      ratingMin: '1',
      ratingMax: '',
      startDate: '',
      endDate: '',
      search: [],
      loading: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === 'priceMin') {
      if (
        parseInt(event.target.value, 10) > parseInt(this.state.priceMax, 10)
      ) {
        this.setState({ priceMax: event.target.value });
      }
    } else if (event.target.name === 'ratingMin') {
      if (
        parseInt(event.target.value, 10) > parseInt(this.state.ratingMax, 10)
      ) {
        this.setState({ ratingMax: event.target.value });
      }
    }
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
    if (event.target.name == 'endDate') {
      const date1 = new Date(this.state.startDate);
      const date2 = new Date(event.target.value);
      let days = date2.getTime() - date1.getTime();
      days /= 1000 * 3600 * 24;
      this.setState({
        totalPrice: parseInt(this.state.nightlyPrice, 10) * days,
      });
    }
  }

  componentDidMount() {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.setState(
      {
        startDate: today.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0],
        minEndDate: tomorrow.toISOString().split('T')[0],
      },
      () => {
        this.handleSubmit();
      },
    );
  }

  async handleLocation() {
    const response = await fetch('https://geolocation-db.com/json/', {
      method: 'GET',
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    if (response.ok) {
      await this.setState({ zipCode: jsonResponse.postal });
    } else {
      await this.setState({ zipCode: '47404' });
    }
  }

  async handleSubmit(event) {
    if (event != null) {
      event.preventDefault();
    } else {
      await this.handleLocation();
    }
    this.setState({ loading: true });
    const response = await fetch(
      `${process.env.HOST_URL}/api/cust/home`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          category: this.state.category,
          zipCode: this.state.zipCode,
          price: {
            min: parseInt(this.state.priceMin, 10),
            max: parseInt(this.state.priceMax, 10),
          },
          distance: parseInt(this.state.distance, 10),
          rating: {
            min: parseInt(this.state.ratingMin, 10),
            max: parseInt(this.state.ratingMax, 10),
          },
          startDate: this.state.startDate,
          endDate: this.state.endDate,
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
      const newSearch = [];
      jsonResponse.data.forEach(item => {
        const data = {};
        data.listingID = item.productid;
        data.imageUrl = imgurUrl(item.defaultimagelink);
        data.location = `${item.address}, ${item.zipcode}`;
        data.distance = item.distance;
        data.price = item.amount;
        data.rating = item.rating;
        newSearch.push(data);
      });
      this.setState({ search: newSearch }, () => {
        this.setState({ loading: false });
      });
    }
  }

  render() {
    const results = this.state.search.map(res => (
      <RentalSearchResult
        listingID={res.listingID}
        imageUrl={res.imageUrl}
        location={res.location}
        distance={res.distance}
        price={res.price}
        rating={res.rating}
      />
    ));

    return (
      <div>
        <Helmet>
          <title> Rent Everything </title>
        </Helmet>
        <NavBar />
        <div className="navBarDrop">
          <SearchBar onSubmit={this.handleSubmit}>
            <div>
              <SearchLabel>Category</SearchLabel>
              <SearchSelect
                value={this.state.category}
                name="category"
                onChange={this.handleInputChange}
              >
                <option value="All">All</option>
                <option value="House">Homes</option>
                <option value="Car">Cars</option>
                <option value="Service">Services</option>
                <option value="Boat">Boats</option>
              </SearchSelect>
            </div>
            <div>
              <SearchLabel>Zip Code</SearchLabel>
              <SearchZip
                type="text"
                value={this.state.zipCode}
                pattern="[0-9]{5}"
                name="zipCode"
                title="Please enter a valid zip code."
                placeholder="47404"
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div name="price">
              <SearchLabel>Price</SearchLabel>
              <SearchNumInput
                type="number"
                name="priceMin"
                value={this.state.priceMin}
                placeholder="Min $"
                min="0"
                onChange={this.handleInputChange}
                required
              />
              <SearchNumInput
                type="number"
                name="priceMax"
                value={this.state.priceMax}
                placeholder="Max $"
                min={this.state.priceMin}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              <SearchLabel>Distance</SearchLabel>
              <SearchSelect
                value={this.state.distance}
                name="distance"
                onChange={this.handleInputChange}
              >
                <option value={10}>10 miles</option>
                <option value={25}>25 miles</option>
                <option value={50}>50 miles</option>
                <option value={100}>100 miles</option>
                <option value={200}>200 miles</option>
                <option value={20000}>Anywhere</option>
              </SearchSelect>
            </div>
            <div>
              <SearchLabel>Min Rating</SearchLabel>
              <SearchNumInput
                type="number"
                name="ratingMin"
                value={this.state.ratingMin}
                placeholder="Min ★"
                min="1"
                max="5"
                onChange={this.handleInputChange}
                required
              />
            </div>
            <DateBox>
              <div>
                <SearchLabel>Start Date</SearchLabel>
                <SearchInput
                  type="date"
                  name="startDate"
                  value={this.state.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div>
                <SearchLabel>End Date</SearchLabel>
                <SearchInput
                  type="date"
                  name="endDate"
                  value={this.state.endDate}
                  min={this.state.minEndDate}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
            </DateBox>
            <div>
              <SearchLabel />
              <SearchSubmit
                type="submit"
                className="btn btn-primary"
                value="Search"
              />
            </div>
          </SearchBar>
          {this.state.loading ? (
            <LoadingElement />
          ) : (
            <SearchGrid>{results}</SearchGrid>
          )}
        </div>
      </div>
    );
  }
}
