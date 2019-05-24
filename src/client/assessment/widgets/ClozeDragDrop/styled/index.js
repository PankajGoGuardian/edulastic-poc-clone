import styled from "styled-components";
import { fadedBlack } from "@edulastic/colors";

export const Label = styled.label`
  color: ${fadedBlack};
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 1.5;
  list-style: none;
  display: inline-block;
  cursor: pointer;
  font-weight: 400;
`;

export const Heading = styled.span`
  color: ${fadedBlack};
  margin-bottom: 15px;
  font-size: 16px;
  line-height: 1.5;
  list-style: none;
  display: block;
  font-weight: 600;
`;
