import React from "react";
import styled from "styled-components";
import { greyThemeDark1 } from "@edulastic/colors";

export const H4InnerTitle = styled.h4`
  font-size: ${({ fontSize }) => fontSize || "13px"};
  margin: ${({ margin }) => margin || "0px 0px 10px"};
  text-transform: ${({ textTransform }) => textTransform || "uppercase"};
  color: ${({ color }) => color || greyThemeDark1};
  font-weight: 600;
`;

export const InnerTitle = ({ innerText }) => <H4InnerTitle>{innerText}</H4InnerTitle>;
