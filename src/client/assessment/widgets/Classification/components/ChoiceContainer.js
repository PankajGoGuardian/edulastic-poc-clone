/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { dashBorderColor, mobileWidthLarge } from "@edulastic/colors";
import { Subtitle } from "@edulastic/common";

const ChoiceContainer = ({ title, children, direction, choiceWidth }) => (
  <Container direction={direction} choiceWidth={choiceWidth}>
    {title && <Subtitle direction={direction}>{title}</Subtitle>}
    {children}
  </Container>
);

ChoiceContainer.propTypes = {
  title: PropTypes.string.isRequired,
  choiceWidth: PropTypes.number.isRequired,
  children: PropTypes.any,
  direction: PropTypes.string
};

ChoiceContainer.defaultProps = {
  children: null,
  direction: ""
};

export default ChoiceContainer;

const Container = styled.div`
  padding: 22px 12px;
  break-inside: avoid;
  min-height: 140px;
  background-color: ${dashBorderColor};
  flex-shrink: 0;

  ${({ direction, choiceWidth }) => {
    if (direction === "row") {
      return `
        margin-left: 16px;
        max-width: ${choiceWidth}px;
        border-radius: 0px 10px 10px 0px;
        & .choice-items-wrapper {
          flex-direction: column;
          align-items: stretch;
        }
      `;
    }
    if (direction === "row-reverse") {
      return `
        margin-right: 16px;
        max-width: ${choiceWidth}px;
        border-radius: 10px 0px 0px 10px;
        & .choice-items-wrapper {
          flex-direction: column;
          align-items: stretch;
        }
      `;
    }
    return `
      width: 100%;
      border-radius: 10px;
      margin-top: 16px;
      & .choice-items-wrapper {
        width: 100%;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
    `;
  }};

  & .choice-items-wrapper {
    @media (max-width: ${mobileWidthLarge}) {
      flex-direction: column;
      align-items: stretch;
      max-width: 400px;
    }
  }
`;
