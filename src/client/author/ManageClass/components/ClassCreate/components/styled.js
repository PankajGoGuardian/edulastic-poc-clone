import styled from "styled-components";
import { darkGrey } from "@edulastic/colors";

export const Field = styled.fieldset`
  width: 100%;
  padding: 0px;

  legend {
    font-size: ${props => props.theme.smallFontSize};
    font-weight: 600;
    margin-bottom: 5px;
    border: 0px;
    text-transform: uppercase;
  }

  &:first-child {
    margin-top: 0px;
  }
  .ant-calendar-picker,
  .ant-select {
    width: 100%;
  }
`;

export const Optional = styled.span`
  font-size: ${props => props.theme.smallFontSize};
  color: ${darkGrey};
  margin-left: 10px;
  text-transform: lowercase;
`;
