/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { dashBorderColor } from "@edulastic/colors";
import { Subtitle } from "@edulastic/common";

const CorrectAnswersContainer = ({ title, children, imageStyle, maxWidth, className, style = {} }) => (
  <Container className={className} maxWidth={maxWidth} imageStyle={imageStyle} style={style}>
    <Subtitle>{title}</Subtitle>
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
  padding: 22px 12px;
  min-height: ${({ minHeight }) => minHeight || 200}px;
  height: auto;
  border-radius: 10px 0px 0px 10px;
  background-color: ${dashBorderColor};
  flex: 2;
  max-width: ${({ maxWidth }) => maxWidth || null};
  min-width: 200px;
  img {
    ${({ imageStyle }) =>
      imageStyle
        ? `
        z-index: 1;
        position: relative;
      `
        : null}
    ${({ imageStyle }) => imageStyle}
  }
  h3 {
    margin-bottom: 30px;
  }
`;
