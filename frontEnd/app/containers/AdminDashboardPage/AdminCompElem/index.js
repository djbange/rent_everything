import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AdminBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  padding: 12px;
  gap: 12px;
  background-color: #dddf;
`;

const AdminImage = styled.img`
  object-fit: cover;
  height: 100px;
  aspect-ratio: 1 / 1;
  border-radius: 15px;
`;

const AdminTitle = styled.h3`
  margin: 0;
`;
const AdminUser = styled.h4`
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

export default function AdminCompElem(props) {
  const params = new URLSearchParams({ id: props.listingID });
  return (
    <AdminBlock>
      <AdminImage src={props.imageUrl} />
      <div>
        <AdminTitle>{props.title}</AdminTitle>
        <AdminUser>{`Owner: ${props.ownerName} (${props.ownerEmail})`}</AdminUser>
        <AdminUser>{`Renter: ${props.renterName} (${props.renterEmail})`}</AdminUser>
      </div>
      <ButtonDiv>
        <ListingButton to={`/listing?${params}`}>View Related Listing</ListingButton>
        <ComplaintButton onClick={props.complaintClick}>
          View Complaint
        </ComplaintButton>
      </ButtonDiv>
    </AdminBlock>
  );
}
