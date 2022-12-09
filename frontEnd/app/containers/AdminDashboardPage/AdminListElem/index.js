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

const ButtonDiv = styled.div`
  margin-left: auto;
  display: flex;
  flex-flow: column nowrap;
  gap: 8px;
`;
const ListingButton = styled(Link).attrs({ className: 'btn btn-primary' })`
  height: 37px;
`;

export default function AdminListElem(props) {
  const params = new URLSearchParams({ id: props.listingID });
  return (
    <AdminBlock>
      <AdminImage src={props.imageUrl} />
      <div>
        <AdminTitle>{props.title}</AdminTitle>
      </div>
      <ButtonDiv>
        <ListingButton to={`/listing?${params}`}>Preview Listing</ListingButton>
        <ListingButton onClick={props.approveClick}>
          Approve Listing
        </ListingButton>
      </ButtonDiv>
    </AdminBlock>
  );
}
