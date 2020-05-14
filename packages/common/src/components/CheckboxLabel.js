import React from "react";
import styled from "styled-components";
import { mediumDesktopExactWidth, greyThemeLighter, themeColor, greyThemeLight, white } from "@edulastic/colors";
import { Checkbox } from "antd";

export const CheckBoxGrp = Checkbox.Group;

export const CheckboxStyle = styled(Checkbox)`
  width: ${({ width }) => width || "unset"};
  font-size: ${props => props.theme.widgetOptions.labelFontSize};
  font-weight: ${props => props.theme.widgetOptions.labelFontWeight};
  letter-spacing: -0.4px;
  text-align: left;
  color: ${props => props.theme.widgetOptions.labelColor};
  text-transform: uppercase;
  margin-bottom: ${({ mb }) => mb || "0px"};
  margin-left: ${({ ml }) => ml || "0px"};
  margin-top: ${({ mt }) => mt || "0px"};
  &.ant-checkbox-wrapper {
    & + .ant-checkbox-wrapper {
      margin-left: 0px;
    }
    .ant-checkbox {
      & + span {
        font-size: ${props => props.labelFontSize || "12px"};
        padding: ${props => props.labelPadding || "0px 20px"};
      }
      .ant-checkbox-inner {
        border-color: ${greyThemeLight};
        background: ${greyThemeLighter};
        width: 18px;
        height: 18px;
        &:after {
          left: 28%;
        }
      }
      &.ant-checkbox-indeterminate .ant-checkbox-inner {
        &:after {
          left: 50%;
        }
      }
      &.ant-checkbox-checked {
        &:after {
          border-color: ${themeColor};
        }
        .ant-checkbox-inner {
          border-color: ${themeColor};
          background: ${themeColor};
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
      &.ant-checkbox-checked {
        &.ant-checkbox-disabled {
          .ant-checkbox-inner {
            &:after {
              border-color: ${white};
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

const CheckboxLabel = ({ children, ...props }) => <CheckboxStyle {...props}>{children}</CheckboxStyle>;

export default CheckboxLabel;
