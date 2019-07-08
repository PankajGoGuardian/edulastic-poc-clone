import React from "react";
import { StyledAxisTickText, StyledText } from "../../../styled";
import { isMobileScreen } from "../../../util";

export const CustomChartCursor = props => {
  // PROPS FORMAT
  //   const { right, height, width, payload, points, lineYDomain, getJSX } = props;
  const { getJSX } = props;
  return getJSX(props);
};
