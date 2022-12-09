import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BookingBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  padding: 12px;
  gap: 12px;
  background-color: #dddf;
`;

const BookingImage = styled.img`
  object-fit: cover;
  height: 100px;
  aspect-ratio: 1 / 1;
  border-radius: 15px;
`;

const BookingTitle = styled.h3`
  margin: 0;
`;
const InfoDiv = styled.div`
  display: flex;
  gap: 0.75rem;
`;
const DatesDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 160px;
`;
const Info = styled.p`
  margin: 0;
`;

const ButtonDiv = styled.div`
  margin-left: auto;
  display: flex;
  flex-flow: column nowrap;
  gap: 8px;
`;
const ListingButton = styled(Link).attrs({ className: 'btn btn-primary' })`
  height: 37px;
`;
const ComplaintButton = styled.button.attrs({ className: 'btn' })`
  height: 37px;
  color: white;
  background-color: #a00;
  border-color: #a00;

  &:hover {
    color: white;
    background-color: #333;
    border-color: #333;
  }
`;

export default function BookingElem(props) {
  const params = new URLSearchParams({ id: props.listingID });
  return (
    <BookingBlock>
      <BookingImage src={props.imageUrl} />
      <div>
        <BookingTitle>{props.title}</BookingTitle>
        <InfoDiv>
          <div>
            <DatesDiv>
              <Info>Price Paid:</Info>
              <Info>${props.amount}</Info>
            </DatesDiv>
            <DatesDiv>
              <Info>Status:</Info>
              <Info>{props.status}</Info>
            </DatesDiv>
          </div>
          <div>
            <DatesDiv>
              <Info>From:</Info>
              <Info>{props.startDate}</Info>
            </DatesDiv>
            <DatesDiv>
              <Info>To:</Info>
              <Info>{props.endDate}</Info>
            </DatesDiv>
          </div>
        </InfoDiv>
      </div>
      <ButtonDiv>
        <ListingButton to={`/listing?${params}`}>Visit Listing</ListingButton>
        <ComplaintButton onClick={props.complaintClick}>
          File a Complaint
        </ComplaintButton>
      </ButtonDiv>
    </BookingBlock>
  );
}
