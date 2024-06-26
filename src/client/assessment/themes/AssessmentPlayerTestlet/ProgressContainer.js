/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { IPAD_PORTRAIT_WIDTH } from "../../constants/others";

const ProgressContainer = ({ questions, current, desktop }) => (
  <Container desktop={desktop}>
    <CompletedItems data-cy="progressItem">
      {current} / {questions.length} Completed
    </CompletedItems>
    <QIndicationContainer>
      {questions.map((item, index) => (
        <Items key={index} fillColor={current > index} />
      ))}
    </QIndicationContainer>
  </Container>
);

ProgressContainer.propTypes = {
  questions: PropTypes.array.isRequired,
  current: PropTypes.number.isRequired
};

export default ProgressContainer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  max-width: 425px;
  @media (max-width: ${IPAD_PORTRAIT_WIDTH}px) {
    width: 100%;
    margin-left: 0;
    max-width: initial;
    ${props => props.desktop === "true" && "display:none;"}
  }
`;

const Items = styled.div`
  background: ${props => (props.fillColor ? "#fff" : "#63e5ab")};
  height: 8px;
  margin-right: 5px;
  width: 50px;
  border-radius: 2px;
`;

const CompletedItems = styled.div`
  color: ${({ theme }) => theme.header.headerButtonColor};
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
`;

const QIndicationContainer = styled.div`
  display: flex;
`;
