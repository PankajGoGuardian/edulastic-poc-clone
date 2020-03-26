import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: ${({ top }) => top || "0px"};
  right: ${({ showAnswer, right }) => (showAnswer ? "14px" : right || "0px")};
  bottom: ${({ bottom }) => bottom || "0px"};
  padding: ${({ noPadding }) => (noPadding ? "0px" : "8px 4px 8px 4px")};
  background-color: ${({ showAnswer }) => (showAnswer ? "inherit" : "white")};
`;

const Ellipsis = ({ showAnswer, ...rest }) => (
  <Container showAnswer={showAnswer} {...rest}>
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
