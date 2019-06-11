import React from "react";
import styled from "styled-components";
import { Table } from "antd";

export const OnHoverTable = styled(Table)`
  .ant-table-row {
    &: hover {
      button#onHoverVisible {
        opacity: 100;
      }
    }
  }
`;

export const Button = styled.button`
  ${props =>
    props.noStyle &&
    `
    background:none;
    border:none;
    border:0;
    border-radius:0
  `}
  opacity: ${props => (props.disabled ? "0.2" : "1")};
  cursor: pointer;
`;

Button.defaultProps = {
  noStyle: true
};

export const OnHoverButton = styled(Button).attrs({
  id: "onHoverVisible"
})`
  opacity: 0;
  margin-right: 20px;
  font-size: 20px;
  &:last-child {
    margin-right: 0;
  }
`;
