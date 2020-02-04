import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "antd";
import { themeColorLight } from "@edulastic/colors";

const Item = styled.li`
  color: ${themeColorLight};
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 10px;
  margin-bottom: 10px;
  a {
    padding: 12px 20px;
    width: 100%;
    display: inline-block;
    color: #58606f;
    font-weight: 600;
    &:hover {
      background-color: #f8f8f8;
      border-radius: 10px;
    }
  }
`;

const StyledIcon = styled(Icon)`
  font-weight: bold;
  float: right;
  color: #8e959e;
  margin-top: 3px;
`;

export const LinkItem = props => {
  return (
    <Item>
      <Link data-cy={props.data.key} to={!props.inverse && props.data.location}>
        {props.data.title}
        {!props.inverse && <StyledIcon type="right" />}
      </Link>
    </Item>
  );
};
