import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import FadeLoader from 'react-spinners/FadeLoader';

const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
`;

const TimeoutText = styled.h3`
  margin: 1.5rem;
`;

export default function LoadingElement() {
  const timeOut = useRef(null);
  const [TO, setTO] = useState(false);
  clearTimeout(timeOut.current);
  timeOut.current = setTimeout(() => {
    setTO(true);
  }, 5000);

  return (
    <CenterDiv>
      {TO ? (
        <TimeoutText>
          Could not communicate with server, please try again later
        </TimeoutText>
      ) : (
        <FadeLoader color="#666" />
      )}
    </CenterDiv>
  );
}
