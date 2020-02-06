import React from "react";
import styled from "styled-components";
import { mediumDesktopExactWidth } from "@edulastic/colors";
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
  .ant-checkbox-checked {
    &:after,
    & *:after {
      border-color: #878a91;
    }
  }
  .ant-checkbox-inner {
    border-color: #878a91;
    background: #f8f8f8;
  }
  .ant-checkbox-input:focus + .ant-checkbox-inner,
  &.ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: #878a91;
    background: #f8f8f8;
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;

export const CheckboxLabel = ({ children, ...props }) => {
  return <CheckboxStyle {...props}>{children}</CheckboxStyle>;
};
