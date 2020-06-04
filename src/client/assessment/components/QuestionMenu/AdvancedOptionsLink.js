import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { themeColor } from "@edulastic/colors";

const AdvancedOptionsLink = ({ handleAdvancedOpen, advancedAreOpen, bottom, hideAdvancedToggleOption }) => (
  <AdvancedOptionsHeader
    onClick={handleAdvancedOpen}
    advancedAreOpen={advancedAreOpen}
    bottom={bottom}
    hideAdvancedToggleOption={hideAdvancedToggleOption}
  >
    <p>{hideAdvancedToggleOption ? "" : advancedAreOpen ? "HIDE" : "SHOW"} ADVANCED OPTIONS</p>
  </AdvancedOptionsHeader>
);

AdvancedOptionsLink.propTypes = {
  handleAdvancedOpen: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool.isRequired,
  bottom: PropTypes.bool
};

AdvancedOptionsLink.defaultProps = {
  bottom: false
};

export default AdvancedOptionsLink;

const AdvancedOptionsHeader = styled.div`
  cursor: ${({ hideAdvancedToggleOption }) => !hideAdvancedToggleOption && "pointer"};
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ bottom, advancedAreOpen }) => {
    if (bottom && advancedAreOpen) {
      return "20px 0px 8px";
    }
    if (bottom && !advancedAreOpen) {
      return "20px 0px 0px";
    }
    return "50px 0px";
  }};
  position: relative;
  ${({ hideAdvancedToggleOption }) =>
    !hideAdvancedToggleOption &&
    `
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    right: -27px;
    transform: translateY(-50%) ${props => props.advancedAreOpen && "rotate(180deg)"};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5.5px solid ${themeColor};
    transition: all 0.2s ease;
  }`}

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.size7}px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.36;
    letter-spacing: 0.2px;
    text-align: left;
    color: ${({ theme }) => theme.labelStyle};
  }
`;
