import { Input, Select } from "antd";
import styled from "styled-components";
import { greyThemeLight, greyThemeLighter } from "@edulastic/colors";

export const TextInputStyled = styled(Input)`
  &.ant-input {
    background-color: ${greyThemeLighter};
    border: ${props => (props.noBorder ? "0px" : `1px solid ${greyThemeLight} !important`)};
    color: #6a737f;
    font-size: ${props => props.fontSize || "13px"};
    width: ${props => props.width || "100%"};
    height: ${props => props.height || "40px"};
    margin: ${props => props.margin || "0px"};
    min-height: 30px !important;
    padding: 0 15px;
    border-radius: 2px;
    font-weight: 600;
    line-height: 1.38;
    outline: 0;
    ${props => props.style};
    &:focus,
    &:hover {
      border: 1px solid ${greyThemeLight};
      background-color: ${greyThemeLighter};
      box-shadow: none;
    }
  }
`;

export const SelectInputStyled = styled(Select)`
  &.ant-select {
    width: ${props => props.width || "100%"};
    margin: ${props => props.margin || "0px"};
    .ant-select-selection {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background-color: ${props => props.bg || greyThemeLighter};
      border: 1px solid ${greyThemeLight};
      color: #6a737f;
      font-size: ${props => props.fontSize || "13px"};
      width: ${props => props.width || "100%"};
      height: ${props => props.height || "100%"};
      min-height: 30px;
      padding: ${props => props.padding || "0px"};
      border-radius: 2px;
      font-weight: 600;
      line-height: 1.38;
      outline: 0;
      &:focus,
      &:hover {
        border: 1px solid ${greyThemeLight};
        background-color: ${props => props.bg || greyThemeLighter};
        box-shadow: none;
      }
      &.ant-select-selection--single {
        .ant-select-selection__rendered {
          padding: 0px 30px 0px 15px;
          line-height: ${props => props.height || "30px"};
          margin: 0px;
          width: 100%;
          .ant-select-selection-selected-value {
            padding: 0px;
          }
          .ant-select-selection__placeholder {
            margin-left: 10px;
          }
        }
      }
    }
  }
`;
