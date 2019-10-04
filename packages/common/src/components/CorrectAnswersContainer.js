import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { dashBorderColor } from "@edulastic/colors";
import { Subtitle } from "@edulastic/common";

const CorrectAnswersContainer = ({ title, children, imageStyle, maxWidth, minHeight, className }) => (
  <Container className={className} maxWidth={maxWidth} minHeight={minHeight} imageStyle={imageStyle}>
    <Subtitle style={{ marginBottom: 30 }}>{title}</Subtitle>
    {children}
  </Container>
);

CorrectAnswersContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any,
  imageStyle: PropTypes.object
};

CorrectAnswersContainer.defaultProps = {
  children: null,
  imageStyle: {}
};

export default CorrectAnswersContainer;

const Container = styled.div`
  margin: 20px 0;
  padding: 22px 35px;
  min-height: ${({ minHeight }) => minHeight || 200}px;
  height: 100%;
  border-radius: 10px 0px 0px 10px;
  background-color: ${dashBorderColor};
  flex: 2;
  max-width: ${({ maxWidth }) => maxWidth || null};
  img {
    ${({ imageStyle }) => {
      return imageStyle
        ? `
        z-index: 1;
        position: relative;
      `
        : null;
    }}
    ${({ imageStyle }) => imageStyle}
  }
`;
