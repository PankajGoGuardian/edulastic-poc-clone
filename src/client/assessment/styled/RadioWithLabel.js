import React from "react";
import styled from "styled-components";
import {
  mediumDesktopExactWidth,
  greyThemeLighter,
  greyThemeDark2,
  themeColorBlue,
  greyThemeLight,
  white
} from "@edulastic/colors";
import { Radio } from "antd";

export const RadioLabelGroup = styled(Radio.Group)`
  margin-top: ${({ mt }) => mt || "0px"};
  padding-left: ${({ pl }) => pl || ""};
`;

export const RadioStyle = styled(Radio)`
  width: ${({ width }) => width || "unset"};
  margin-bottom: ${({ mb }) => mb || "0px"};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.widgetOptions.labelFontWeight};
  letter-spacing: -0.4px;
  text-align: left;
  color: ${props => props.theme.widgetOptions.labelColor};
  text-transform: uppercase;
  &.ant-radio-wrapper {
    & + .ant-radio-wrapper {
      margin-left: 0px;
    }
    .ant-radio-input:focus + .ant-radio-inner {
      box-shadow: none;
    }
    .ant-radio {
      & + span {
        font-size: ${props => props.labelFontSize || "12px"};
        padding: ${props => props.labelPadding || "0px 20px"};
      }
      .ant-radio-inner {
        border-color: ${greyThemeDark2};
        background: ${greyThemeLighter};
      }
      &.ant-radio-checked {
        &:after {
          border-color: ${themeColorBlue};
        }
        .ant-radio-inner {
          border-color: ${themeColorBlue};
          background: ${white};
          &:after {
            background-color: ${themeColorBlue};
          }
        }
      }
      &.ant-radio-disabled {
        &:after {
          border-color: ${greyThemeLight};
        }
        .ant-radio-inner {
          border-color: ${greyThemeLight};
          background: ${greyThemeLight};
        }
      }
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.widgetOptions.labelFontSize};
  }
`;

export const RadioLabel = ({ children, ...props }) => <RadioStyle {...props}>{children}</RadioStyle>;
