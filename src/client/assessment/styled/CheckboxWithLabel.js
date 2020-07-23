import React from "react";
import styled from "styled-components";
import {
  mediumDesktopExactWidth,
  greyThemeDark2,
  greyThemeLighter,
  themeColorBlue,
  greyThemeLight
} from "@edulastic/colors";
import { Checkbox } from "antd";

export const CheckboxStyle = styled(Checkbox)`
  width: ${({ width }) => width || "unset"};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.widgetOptions.labelFontWeight};
  letter-spacing: -0.4px;
  text-align: left;
  color: ${props => props.theme.widgetOptions.labelColor};
  text-transform: uppercase;
  margin-bottom: ${({ mb }) => mb || "0px"};
  margin-top: ${({ mt }) => mt || "0px"};
  &.ant-checkbox-wrapper {
    & + .ant-checkbox-wrapper {
      margin-left: 0px;
    }
    .ant-checkbox {
      & + span {
        font-size: ${props => props.labelFontSize || "12px"};
        padding: ${props => props.labelPadding || "0px 16px"};
      }
      .ant-checkbox-inner {
        border-color: ${greyThemeDark2};
        background: ${greyThemeLighter};
      }
      &.ant-checkbox-checked {
        &:after {
          border-color: ${themeColorBlue};
        }
        .ant-checkbox-inner {
          border-color: ${themeColorBlue};
          background: ${themeColorBlue};
        }
      }
      &.ant-checkbox-disabled {
        &:after {
          border-color: ${greyThemeLight};
        }
        .ant-checkbox-inner {
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

export const CheckboxLabel = ({ children, ...props }) => <CheckboxStyle {...props}>{children}</CheckboxStyle>;
