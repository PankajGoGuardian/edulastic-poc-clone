import React from "react";
import { FlexContainer } from "@edulastic/common";
import { Color, Label } from "./styled";

const colorLabelsMap = [
  {
    label: "correct",
    color: "#DEF4E8"
  },
  {
    label: "incorrect",
    color: "#FDE0E9"
  },
  {
    label: "partially correct",
    color: "#FFE9A8"
  },
  {
    label: "skipped",
    color: "#E5E5E5"
  },
  {
    label: "manually graded",
    color: "#BEDEFF"
  }
];

const ColorLabel = ({ item }) => (
  <FlexContainer>
    <Color color={item.color} />
    <Label>{item.label}</Label>
  </FlexContainer>
);

const ExpressGraderScoreColors = () => (
  <FlexContainer padding="10px 0" width="600px" justifyContent="space-between">
    {colorLabelsMap.map(item => (
      <ColorLabel item={item} />
    ))}
  </FlexContainer>
);

export default ExpressGraderScoreColors;
