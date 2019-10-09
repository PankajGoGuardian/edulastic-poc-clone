import React from "react";
import styled from "styled-components";
import ChoicesBox from "./ChoicesBox";

export const StyledChoicesBox = styled(ChoicesBox)`
  .ant-select {
    font-size: ${({ theme }) => theme?.fontSize}px;

    .ant-select-selection__rendered {
      line-height: ${({ theme }) => theme?.fontSize}px;
    }
  }

  .ant-select-dropdown-menu-item {
    font-size: 64px;
    line-height: 64px;
    white-space: normal;
  }
`;

const ChoicesBoxContainer = props => (
  <StyledChoicesBox
    {...props}
    style={{
      width: "auto",
      height: "auto"
    }}
  />
);

export default ChoicesBoxContainer;
