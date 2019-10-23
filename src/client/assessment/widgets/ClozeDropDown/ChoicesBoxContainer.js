import React from "react";
import styled from "styled-components";
import ChoicesBox from "./ChoicesBox";

const minWidthMap = {
  xs: 100,
  sm: 100,
  md: 150,
  lg: 200,
  xl: 250
};

export const StyledChoicesBox = styled(ChoicesBox)`
  .ant-select {
    font-size: ${({ theme }) => theme?.fontSize}px;

    .ant-select-selection__rendered {
      line-height: ${({ theme }) => theme?.fontSize}px;
    }
  }

  .ant-select-selection {
    min-width: ${({ theme }) => minWidthMap[(theme?.zoomLevel)] || 250}px;
  }

  .ant-select-dropdown-menu-item {
    font-size: ${({ theme }) => theme?.fontSize}px;
    line-height: ${({ theme }) => theme?.fontSize}px;
    white-space: normal;
  }
`;

const ChoicesBoxContainer = props => <StyledChoicesBox {...props} />;

export default ChoicesBoxContainer;
