import React from "react";
import styled from "styled-components";

// components
import { FlexContainer } from "@edulastic/common";

// constants
import { STATUS_LIST } from "../transformers";

const GradebookStatusColors = () => (
  <FlexContainer padding="10px 0" width="600px" justifyContent="space-between" flexWrap="wrap">
    {STATUS_LIST.map(item => (
      <FlexContainer key={`status_color_${item.id}`}>
        <Color color={item.color} />
        <Label>{item.name}</Label>
      </FlexContainer>
    ))}
  </FlexContainer>
);

export default GradebookStatusColors;

const Color = styled.div`
  background: ${({ color }) => color};
  width: 16px;
  height: 16px;
`;

const Label = styled.div`
  font-size: 8px;
  line-height: 11px;
  letter-spacing: 0.15px;
  text-transform: uppercase;
  margin: 0 10px 0 6px;
  white-space: nowrap;
`;
