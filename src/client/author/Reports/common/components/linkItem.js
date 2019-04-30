import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "antd";
import { grey, darkBlue, lightBlue, black } from "@edulastic/colors";

const Item = styled.li`
  color: ${lightBlue};
  width: 100%;
  border-top: 2px solid #f7f7f7;
  a {
    padding: 12px 10px;
    width: 100%;
    display: inline-block;
    &:hover {
      background-color: #f8f8f8;
    }
  }
`;

const StyledIcon = styled(Icon)`
  font-weight: bold;
  float: right;
  color: ${darkBlue};
`;

export const LinkItem = props => {
  return (
    <Item>
      <Link to={props.data.location}>
        {props.data.title}
        <StyledIcon type="right" />
      </Link>
    </Item>
  );
};
