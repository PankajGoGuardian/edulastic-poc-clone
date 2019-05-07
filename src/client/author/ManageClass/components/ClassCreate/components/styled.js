import styled from "styled-components";
import { darkGrey } from "@edulastic/colors";

export const Field = styled.fieldset`
  width: 100%;
  padding: 0px;

  legend {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 0px;
    border: 0px;
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
  font-style: italic;
  font-size: 14px;
  color: ${darkGrey};
  margin-left: 10px;
`;
