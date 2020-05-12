import React from "react";
import styled from "styled-components";

// components
import { FlexContainer } from "@edulastic/common";

const colorLabelsMap = [
  {
    label: "not started",
    color: "#B1B1B1"
  },
  {
    label: "in progress",
    color: "#7BC0DF"
  },
  {
    label: "submitted",
    color: "#ECAB28"
  },
  {
    label: "graded",
    color: "#00AD50"
  },
  {
    label: "absent",
    color: "#F35F5F"
  }
];

const ColorLabel = ({ item }) => (
  <FlexContainer>
    <Color color={item.color} />
    <Label>{item.label}</Label>
  </FlexContainer>
);

const GradebookStatusColors = () => (
  <FlexContainer padding="10px 0" width="600px" justifyContent="space-between" style={{ marginTop: "-48px" }}>
    {colorLabelsMap.map(item => (
      <ColorLabel item={item} />
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
