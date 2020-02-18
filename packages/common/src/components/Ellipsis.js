import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0px;
  right: ${({ showAnswer }) => (showAnswer ? 14 : 0)}px;
  bottom: 0px;
  padding: 8px 4px 8px 4px;
  background-color: ${({ showAnswer }) => (showAnswer ? "inherit" : "white")};
`;

const Ellipsis = ({ showAnswer }) => (
  <Container showAnswer={showAnswer}>
    <p>...</p>
  </Container>
);

Ellipsis.propTypes = {
  showAnswer: PropTypes.bool
};

Ellipsis.defaultProps = {
  showAnswer: false
};

export default Ellipsis;
