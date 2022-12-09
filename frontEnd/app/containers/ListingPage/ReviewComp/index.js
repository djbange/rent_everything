import React from 'react';
import styled from 'styled-components';

const ReviewDiv = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem 0.75rem;
  background-color: #ddd;
  border-radius: 15px;
`;

const ContentText = styled.p`
  margin: 0;
`;

const Rating = styled(ContentText)`
  font-size: 22px;
`;

const ContentTitle = styled(ContentText)`
  font-size: 18px;
  font-weight: bold;
`;

export default class ReviewComp extends React.Component {
  

  render() {
    let stars = "";
    for(let i=0; i<this.props.rating;i++) {
      stars +="★"
    }

    let date = "";
    let parts = this.props.date.split("-");
    date += (parts[1] + "/" + parts[2] + "/" + parts[0]);

    return (
      <ReviewDiv>
        <Rating>{stars}</Rating>
        <ContentTitle>{this.props.reviewer}, {date}</ContentTitle>
        <ContentText>{this.props.reviewText}</ContentText>
      </ReviewDiv>
    );
  }
}