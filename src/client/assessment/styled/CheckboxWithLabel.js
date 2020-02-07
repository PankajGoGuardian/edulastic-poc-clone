import React from "react";
import styled from "styled-components";
import { mediumDesktopExactWidth, greyThemeDark2, greyThemeLighter } from "@edulastic/colors";
import { Checkbox } from "antd";

export const CheckboxStyle = styled(Checkbox)`
  width: ${({ width }) => width || "unset"};
  margin-bottom: ${({ mb }) => mb || "0px"};
  font-size: ${props => props.theme.widgetOptions.labelFontSize};
  font-weight: ${props => props.theme.widgetOptions.labelFontWeight};
  letter-spacing: -0.4px;
  text-align: left;
  color: ${props => props.theme.widgetOptions.labelColor};
  text-transform: uppercase;
  &.ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0px;
  }
  .ant-checkbox-checked {
    &:after,
    & *:after {
      border-color: ${greyThemeDark2};
    }
  }
  .ant-checkbox-inner {
    border-color: ${greyThemeDark2};
    background: ${greyThemeLighter};
  }
  .ant-checkbox + span {
    font-size: ${props => props.labelFontSize || "12px"};
    padding: ${props => props.labelPadding || "0px 20px"};
  }
  .ant-checkbox-input:focus + .ant-checkbox-inner,
  &.ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: ${greyThemeDark2};
    background: ${greyThemeLighter};
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;

export const CheckboxLabel = ({ children, ...props }) => {
  return <CheckboxStyle {...props}>{children}</CheckboxStyle>;
};
