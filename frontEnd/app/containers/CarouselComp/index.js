import React from 'react';
import styled from 'styled-components';
import { imgurUrl } from 'utils/imgurUtil';
import Flickity from 'react-flickity-component';

const Container = styled.div`
  padding-bottom: 2rem;
`;

const CarouselImage = styled.img`
  object-fit: cover;
  height: 350px;
  flex: 0 0 auto;
  margin: 0 10px;
  border-radius: 10px;

  @media (min-width: 625px) {
    height: 450px;
  }
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

const PopupImage = styled.img`
  object-fit: contain;
  max-width: 80%;
  max-height: 90%;
  border-radius: 10px;
`;

const flickityOptions = {
  contain: true,
  imagesLoaded: true,
  initialIndex: 0,
  freeScroll: true,
  // enable dragging for touch devices only
  draggable:
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0,
};

export default class CarouselComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      fullscreenUrl: '',
    };
    this.fullImage = this.fullImage.bind(this);
    this.exitFullImage = this.exitFullImage.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
  }

  fullImage(event) {
    this.setState({ fullscreen: true, fullscreenUrl: event.target.src });
  }

  exitFullImage() {
    this.setState({ fullscreen: false, fullscreenUrl: '' });
  }

  stopPropagation(event) {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const images = this.props.imageLinks.map(url => (
      <CarouselImage
        src={imgurUrl(url)}
        className="carousel-cell"
        onClick={this.fullImage}
      />
    ));

    return (
      <div>
        {this.state.fullscreen ? (
          <PopupContainer onClick={this.exitFullImage}>
            <PopupImage
              src={this.state.fullscreenUrl}
              onClick={this.stopPropagation}
            />
          </PopupContainer>
        ) : (
          <div />
        )}
        <Container>
          <Flickity
            elementType="div"
            options={flickityOptions}
            disableImagesLoaded={false}
            static
          >
            {images}
          </Flickity>
        </Container>
      </div>
    );
  }
}
