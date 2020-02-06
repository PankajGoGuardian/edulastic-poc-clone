import React from "react";
import styled from "styled-components";
import { mediumDesktopExactWidth } from "@edulastic/colors";
import { Radio } from "antd";

export const RadioStyle = styled(Radio)`
  width: ${({ width }) => width || "unset"};
  margin-bottom: ${({ mb }) => mb || "0px"};
  font-size: ${props => props.theme.widgetOptions.labelFontSize};
  font-weight: ${props => props.theme.widgetOptions.labelFontWeight};
  letter-spacing: -0.4px;
  text-align: left;
  color: ${props => props.theme.widgetOptions.labelColor};
  text-transform: uppercase;
  .ant-radio + span {
    padding: 0px 20px;
  }
  .ant-radio-inner {
    border-color: #878a91;
    background: #f8f8f8;
  }
  .ant-radio-checked {
    .ant-radio-inner {
      &:after {
        background: #878a91;
      }
    }
  }
  .ant-radio-input:focus + .ant-radio-inner,
  &.ant-radio-wrapper:hover .ant-radio-inner,
  .ant-radio:hover .ant-radio-inner {
    border-color: #878a91;
    background: #f8f8f8;
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;

export const RadioLabel = ({ children, ...props }) => {
  return <RadioStyle {...props}>{children}</RadioStyle>;
};
