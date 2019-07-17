import styled from "styled-components";
import { trendTypes } from "../utils/constants";

export const StyledTrendIcon = styled.i`
  transform: rotate(${props => trendTypes[props.type].rotation}deg);
`;

export const StyledCell = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
`;
