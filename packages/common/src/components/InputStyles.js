import {
  greyThemeDark2,
  greyThemeLight,
  greyThemeLighter,
  themeColor,
  themeColorBlue,
  lightGrey12
} from "@edulastic/colors";
import { DatePicker, Input, InputNumber, Select } from "antd";
import React from "react";
import styled from "styled-components";

export const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: ${props => props.theme.widgetOptions.labelFontWeight};
  font-style: ${props => props.theme.widgetOptions.labelFontStyle};
  font-stretch: ${props => props.theme.widgetOptions.labelFontStretch};
  line-height: 1.38;
  text-align: left;
  color: ${props => props.theme.widgetOptions.labelColor};
  display: ${props => (props.display ? props.display : "block")};
  text-transform: uppercase;
  margin-top: ${props => props.mt || "0px"};
  margin-right: ${props => props.mr || "0px"};
  margin-bottom: ${({ marginBottom }) => marginBottom || "7px"};
  margin-left: ${props => props.ml || "0px"};
  padding-top: ${props => (props.top ? `${props.top}px` : 0)};
  padding-bottom: ${props => (props.bottom ? `${props.bottom}px` : 0)};
  padding-left: ${props => (props.left ? `${props.left}px` : 0)};
  padding-right: ${props => (props.right ? `${props.right}px` : 0)};
`;

const inputCommonStyle = {
  backgroundColor: props => props.bg || greyThemeLighter,
  border: props => (props.noBorder ? "0px" : `2px solid ${lightGrey12}`),
  color: "#6a737f",
  fontSize: props => props.fontSize || "13px",
  width: props => props.width || "100%",
  height: props => props.height || "32px",
  margin: props => props.margin || "0px",
  minHeight: props => props.height || "32px",
  padding: props => props.padding || "0px 15px",
  paddingRight: props => props.pr || "",
  borderRadius: "2px",
  fontWeight: "600",
  lineHeight: "1.38",
  outline: "0"
};

export const SearchInputStyled = styled(Input.Search)`
  &.ant-input-search {
    .ant-input {
      ${inputCommonStyle};
      ${props => props.style};
      color: ${({ theme }) => theme.questionTextColor};
      &:focus,
      &:hover {
        border: 1px solid ${themeColorBlue} !important;
        background-color: ${greyThemeLighter};
        box-shadow: none;
      }
    }
  }
`;

export const TextInputStyled = styled(props => <Input maxLength={128} {...props} ref={props.inputRef} />)`
  &.ant-input {
    text-align: ${props => props.align || "left"};
    ${inputCommonStyle};
    ${props => props.style};
    color: ${({ theme }) => theme.questionTextColor};
    &:focus,
    &:hover {
      border: 1px solid ${themeColorBlue} !important;
      background-color: ${greyThemeLighter};
      box-shadow: none;
    }
  }
  &.ant-input-affix-wrapper {
    padding: 0px;
    .ant-input {
      ${inputCommonStyle};
      ${props => props.style};
      color: ${({ theme }) => theme.questionTextColor};
      &:focus,
      &:hover {
        border: 1px solid ${themeColorBlue} !important;
        background-color: ${greyThemeLighter};
        box-shadow: none;
      }
    }
  }
`;

export const TextAreaInputStyled = styled(props => <Input.TextArea maxLength="2048" {...props} ref={props.inputRef} />)`
  &.ant-input {
    ${inputCommonStyle};
    padding: 15px;
    ${props => props.style};
    &:focus,
    &:hover {
      border: 1px solid ${themeColorBlue} !important;
      background-color: ${greyThemeLighter};
      box-shadow: none;
    }
  }
`;

export const NumberInputStyled = styled(InputNumber)`
  &.ant-input-number {
    ${inputCommonStyle};
    ${props => props.style};
    &:focus,
    &:hover,
    &:active {
      border: 1px solid ${themeColorBlue} !important;
      background-color: ${props => props.bg || greyThemeLighter};
      box-shadow: none;
    }
    .ant-input-number-input {
      height: 38px;
    }
  }
`;

export const DatePickerStyled = styled(DatePicker)`
  .ant-calendar-picker-input {
    ${inputCommonStyle};
    ${props => props.style};
    &:focus,
    &:hover,
    &:active {
      border: 1px solid ${themeColorBlue} !important;
      background-color: ${props => props.bg || greyThemeLighter};
      box-shadow: none !important;
    }
  }
  .ant-calendar-picker-icon {
    color: ${themeColor};
  }
`;

export const SelectInputStyled = styled(Select)`
  &.ant-select {
    width: ${props => props.width || "100%"};
    margin: ${props => props.margin || "0px"};
    min-width: ${({ minWidth }) => minWidth || ""};
    &.ant-select-disabled {
      .ant-select-selection {
        background-color: ${props => props.bg || greyThemeLighter};
        cursor: not-allowed;
      }
    }
    &.ant-select-open {
      .ant-select-selection {
        border-color: ${themeColorBlue};
        box-shadow: none;
        &.ant-select-selection--multiple {
          &:after {
            top: 18px;
            transform: rotate(225deg);
            transition: 0.2s;
          }
        }
      }
    }
    &.ant-select-focused {
      .ant-select-selection {
        border-color: ${themeColorBlue};
        box-shadow: none;
      }
    }
    &.ant-select-enabled {
      .ant-select-selection {
        &:focus,
        &:hover {
          border: ${props => (props.noBorder ? "none" : `1px solid ${themeColorBlue}`)};
          background-color: ${props => props.bg || greyThemeLighter};
          box-shadow: none;
        }
      }
    }
    .ant-select-selection {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      background-color: ${props => props.bg || greyThemeLighter};
      border: ${props => (props.noBorder ? "none" : `1px solid ${greyThemeLight}`)};
      color: #6a737f;
      font-size: ${props => props.fontSize || "13px"};
      width: ${props => props.width || "100%"};
      height: ${props => props.height || "100%"};
      min-height: ${props => props.height || "40px"};
      padding: ${props => props.padding || "0px"};
      border-radius: 2px;
      font-weight: 600;
      line-height: 1.38;
      outline: 0;
      &.ant-select-selection--single {
        .ant-select-selection__rendered {
          width: 100%;
          padding: ${props => (props.noBorder ? "0px" : "0px 30px 0px 15px")};
          line-height: ${props => props.height || "38px"};
          margin: 0px;
          .ant-select-selection-selected-value {
            padding: 0px;
          }
          .ant-select-selection__placeholder {
            margin-left: 15px;
          }
        }
      }
      &.ant-select-selection--multiple {
        padding-right: 25px;
        .ant-select-arrow {
          font-size: ${props => props.arrowFontSize || "14px"};
          position: absolute;
          top: 20px;
        }
        .ant-select-selection__rendered {
          width: 100%;
          height: auto;
          margin: 0px;
          line-height: 30px;
          .ant-select-selection__choice {
            & + .ant-select-search--inline {
              margin-top: 5px;
            }
          }
          .ant-select-search--inline {
            margin-left: 10px;
            height: 24px;
            line-height: 24px;
          }
          .ant-select-selection__placeholder {
            color: ${greyThemeDark2};
            margin-left: 15px;
          }
          .ant-select-selection__choice {
            border-radius: 4px;
            height: 24px;
            display: flex;
            align-items: center;
            border: none;
            background: #b3bcc4;
            color: #676e74;
            font-weight: 600;
            margin: 5px 0 5px 5px;
          }
          .ant-select-selection__choice__content {
            font-size: 10px;
            display: flex;
            align-items: center;
            font-weight: bold;
            letter-spacing: 0.2px;
            color: #676e74;
            opacity: 1;
            text-transform: uppercase;
          }
        }
      }
      .ant-select-remove-icon {
        svg {
          fill: #676e74;
          width: 12px;
          height: 12px;
        }
      }
      .ant-select-arrow-icon {
        font-size: ${props => props.arrowFontSize || "14px"};
        svg {
          fill: ${themeColor};
        }
      }
    }
  }
`;
