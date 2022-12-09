import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SearchBlock = styled(Link)`
  display: block;
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
  color: inherit;
  text-decoration: inherit;

  &:hover {
    background-color: #dddf;
  }
`;
const SearchImage = styled.img`
  object-fit: cover;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 15px;
`;
const InfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
`;
const SearchLocation = styled.h3`
  margin: 0;
`;
const SearchDistance = styled.p`
  margin: 0;
`;
const SearchPrice = styled.p`
  margin: 0;
`;
const SearchRating = styled.p`
  width: 40px;
  text-align: right;
  flex-shrink: 0;
  margin: 0;
`;

export default function RentalSearchResult(props) {
  const params = new URLSearchParams({ id: props.listingID });
  return (
    <SearchBlock to={`/listing?${params}`}>
      <SearchImage src={props.imageUrl} />
      <InfoDiv>
        <div>
          <SearchLocation>{props.location}</SearchLocation>
          <SearchDistance>{`${props.distance} miles from you`}</SearchDistance>
          <SearchPrice>{`$${props.price} per night`}</SearchPrice>
        </div>
        <SearchRating>{`★${props.rating}`}</SearchRating>
      </InfoDiv>
    </SearchBlock>
  );
}
