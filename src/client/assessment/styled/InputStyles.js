import { Input, Select } from "antd";
import styled from "styled-components";

export const TextInputStyled = styled(Input)`
  &.ant-input {
    background-color: #f8f8f8;
    border: 1px solid #b9b9b9;
    color: #6a737f;
    font-size: ${props => props.fontSize || "13px"};
    width: ${props => props.width || "100%"};
    height: ${props => props.height || "40px"};
    margin: ${props => props.margin || "0px"};
    min-height: 30px;
    padding: 0 15px;
    border-radius: 5px;
    font-weight: 600;
    line-height: 1.38;
    outline: 0;
    &:focus,
    &:hover {
      border: 1px solid #b9b9b9;
      background-color: #f8f8f8;
      box-shadow: none;
    }
  }
`;

export const SelectInputStyled = styled(Select)`
  &.ant-select {
    width: ${props => props.width || "100%"};
    .ant-select-selection {
      background-color: #f8f8f8;
      border: 1px solid #b9b9b9;
      color: #6a737f;
      font-size: ${props => props.fontSize || "13px"};
      width: ${props => props.width || "100%"};
      height: ${props => props.height || "40px"};
      min-height: 30px;
      padding: ${props => props.padding || "0px"};
      border-radius: 5px;
      font-weight: 600;
      line-height: 1.38;
      outline: 0;
      &:focus,
      &:hover {
        border: 1px solid #b9b9b9;
        background-color: #f8f8f8;
        box-shadow: none;
      }
      &.ant-select-selection--single {
        .ant-select-selection__rendered {
          padding: 0px 30px 0px 15px;
          line-height: ${props => props.height || "40px"};
          margin: 0px;
          .ant-select-selection-selected-value {
            padding: 0px;
          }
        }
      }
    }
  }
`;
