import React from "react";
import styled from "styled-components";

export const H4InnerTitle = styled.h4`
  font-size: ${({ fontSize }) => fontSize || "13px"};
  margin: ${({ margin }) => margin || "0px 0px 10px"};
  text-transform: ${({ textTransform }) => textTransform || "uppercase"};
  color: ${({ color }) => color || "#434B5D"};
  font-weight: 600;
`;

export const InnerTitle = ({ innerText }) => <H4InnerTitle>{innerText}</H4InnerTitle>;
