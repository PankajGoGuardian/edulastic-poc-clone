import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { dashBorderColor } from "@edulastic/colors";
import { Subtitle } from "@edulastic/common";

const CorrectAnswersContainer = ({ title, children, imageStyle }) => (
  <Container imageStyle={imageStyle}>
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
  min-height: 206px;
  border-radius: 10px;
  background-color: ${dashBorderColor};
  flex: 2;
  img {
    width: 220px;
    z-index: 100;
    position: relative;
    ${({ imageStyle }) => imageStyle}
  }
`;
