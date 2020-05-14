import React from "react";
import styled from "styled-components";
import {
  mediumDesktopExactWidth,
  greyThemeLighter,
  greyThemeDark2,
  themeColor,
  greyThemeLight,
  white
} from "@edulastic/colors";
import { Radio } from "antd";

export const RadioGrp = Radio.Group;

export const RadioBtn = ({ children, ...props }) => {
  return <StyledRadioBtn {...props}>{children}</StyledRadioBtn>;
};

const StyledRadioBtn = styled(Radio)`
  margin-bottom: ${({ mb }) => mb || "0px"};
  font-size: ${props => props.theme.widgetOptions.labelFontSize};
  text-align: left;
  &.ant-radio-wrapper {
    & + .ant-radio-wrapper {
      margin-left: 0px;
    }
    .ant-radio-input:focus + .ant-radio-inner {
      box-shadow: none;
    }
    .ant-radio {
      margin-right: 10px;
      & + span {
        font-size: ${props => props.labelFontSize || "12px"};
        padding: ${props => props.labelPadding || "0px 10px"};
        text-transform: uppercase;
      }
      .ant-radio-inner {
        border-color: ${greyThemeLight};
        background: ${greyThemeLighter};
        width: 18px;
        height: 18px;
        &:after {
          top: 4px;
          left: 4px;
        }
      }
      &.ant-radio-checked {
        &:after {
          border-color: ${themeColor};
        }
        .ant-radio-inner {
          border-color: ${themeColor};
          background: ${greyThemeLighter};
        }
      }
      &.ant-radio-disabled {
        &:after {
          border-color: ${greyThemeLight};
        }
        .ant-radio-inner {
          border-color: ${greyThemeLight};
          background: ${greyThemeLight};
          &:after {
            background-color: ${greyThemeLight};
          }
        }
      }
      &.ant-radio-checked {
        &.ant-radio-disabled {
          .ant-radio-inner {
            background: ${greyThemeLight};
            &:after {
              background-color: ${white};
            }
          }
        }
      }
    }
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;
