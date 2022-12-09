import React from 'react';
import styled from 'styled-components';
import mapboxgl from '!mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API;

const MapDiv = styled.div`
  height: 400px;
  width: 100%;
  border-radius: 15px;
  margin: 0.5rem 0;

  @media (min-width: 600px) {
    width: 300px;
  }

  @media (min-width: 768px) {
    width: 400px;
  }

  @media (min-width: 992px) {
    width: 500px;
  }
`;

export default class MapComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: this.props.lat,
      lng: this.props.lng
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: 16,
    });
    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl());
    const location = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([this.state.lng, this.state.lat])
      .addTo(map);
  }

  render() {
    return (<MapDiv ref={this.mapContainer} />);
  }
}
