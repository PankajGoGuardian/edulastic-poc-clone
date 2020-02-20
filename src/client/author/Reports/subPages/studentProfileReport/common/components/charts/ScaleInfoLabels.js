import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { textColor } from "@edulastic/colors";

const ScaleInfoLabels = ({ scaleInfo = [] }) => {
  return (
    <StyledDiv>
      {scaleInfo.map(item => (
        <StyledDiv2>
          <StyledColorSpan color={item.color} />
          <StyledLabel>{item.masteryName}</StyledLabel>
          <StyledLabel weight="Bold" alignment="right" leftMargin="auto">
            {item.percentage}%
          </StyledLabel>
        </StyledDiv2>
      ))}
    </StyledDiv>
  );
};

export default ScaleInfoLabels;

const StyledLabel = styled.span`
  display: inline-block;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: ${props => props.leftMargin || "0px"};
  text-align: ${props => props.alignment || "left"};
  font: ${props => props.weight || ""} 13px/26px Open Sans;
  letter-spacing: 0;
  color: ${textColor};
`;

const StyledColorSpan = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: ${props => props.color};
`;

const StyledDiv = styled.div`
  text-align: center;
`;

const StyledDiv2 = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  display: inline-flex;
  align-items: baseline;
  width: 230px;
`;
