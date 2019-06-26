import styled from "styled-components";
import { tabletWidth } from "@edulastic/colors";

export const MainContainer = styled.div`
  padding-left: ${props => {
    if (props.isPrintPreview) {
      return "0";
    }
    return "100px";
  }};
  width: 100%;
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 100px;
    z-index: 999;
  }
  @media (max-width: ${tabletWidth}) {
    padding-left: 0px;
    .fixed-header {
      left: 0;
      background: #00ad50;
    }
  }
  .ant-btn {
    border-color: ${props => props.theme.themeButtonBgColor};
    &:hover,
    &:focus,
    &:active {
      border-color: ${props => props.theme.themeButtonBgColor};
    }
  }
  .ant-btn-primary {
    background-color: ${props => props.theme.themeButtonBgColor};
    border-color: ${props => props.theme.themeButtonBgColor};
    &:hover,
    &:focus,
    &:active {
      background-color: ${props => props.theme.themeButtonBgColor};
      border-color: ${props => props.theme.themeButtonBgColor};
    }
  }
  .ant-select-open,
  .ant-select-focused {
    .ant-select-selection {
      border-color: ${props => props.theme.themeButtonBgColor};
      &:hover,
      &:focus {
        border-color: ${props => props.theme.themeButtonBgColor};
      }
    }
  }
  .ant-select {
    .ant-select-selection {
      &:hover,
      &:focus {
        border-color: ${props => props.theme.themeButtonBgColor};
      }
      .ant-select-arrow-icon {
        svg {
          fill: ${props => props.theme.themeTextColor};
        }
      }
    }
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${props => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${props => props.theme.checkbox.checkboxCheckedColor};
    border-color: ${props => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: ${props => props.theme.checkbox.checkboxCheckedColor};
  }

  .ant-radio-wrapper:hover .ant-radio-inner,
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner {
    border-color: ${props => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-radio-checked .ant-radio-inner {
    border-color: ${props => props.theme.checkbox.checkboxCheckedColor};
    &:after {
      background-color: ${props => props.theme.checkbox.checkboxCheckedColor};
    }
  }

  .ant-input {
    &:hover,
    &:focus {
      border-color: ${props => props.theme.themeBgColor};
    }
  }

  .ant-dropdown-menu {
    .ant-dropdown-menu-item {
      &:hover {
        background-color: ${props => props.theme.themeBgColor};
      }
    }
  }

  .ant-switch-checked {
    background-color: ${props => props.theme.themeBgColor};
  }
`;
