/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { lightGrey1 } from "@edulastic/colors";
import { Subtitle } from "@edulastic/common";

const CorrectAnswersContainer = ({
  title,
  children,
  imageStyle,
  maxWidth,
  className,
  style = {},
  titleMargin,
  minWidth,
  minHeight,
  noBackground,
  showBorder,
  padding,
  margin
}) => (
  <div className="__prevent-page-break">
    <Container
      className={`${className} __print_fit_content`}
      maxWidth={maxWidth}
      minWidth={minWidth}
      minHeight={minHeight}
      imageStyle={imageStyle}
      style={style}
      noBackground={noBackground}
      showBorder={showBorder}
      padding={padding}
      margin={margin}
    >
      <Subtitle margin={titleMargin}>{title}</Subtitle>
      {children}
    </Container>
  </div>
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
  height: auto;
  flex: 1 1 30%;
  margin: ${({ margin }) => margin || "20px 0px"};
  padding: ${({ padding }) => padding || "22px 12px"};
  min-height: ${({ minHeight }) => minHeight || 200}px;
  background-color: ${({ noBackground }) => !noBackground && lightGrey1};
  max-width: ${({ maxWidth }) => maxWidth || null};
  min-width: ${({ minWidth }) => minWidth || "650px"};
  border: ${({ showBorder }) => showBorder && "1px solid #d6d6d6"};
  border-radius: 4px;

  width: 100%;
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
`;
