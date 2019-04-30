import React from "react";
import { Row, Col, Icon } from "antd";
import styled from "styled-components";
import { fadedBlack } from "@edulastic/colors";

export const BoxHeading = props => {
  return (
    <StyledRow type="flex" justify="start">
      <StyledCol>
        <Icon type={props.iconType} />
        <StyledH3>{props.heading}</StyledH3>
      </StyledCol>
    </StyledRow>
  );
};

const StyledRow = styled(Row)`
  margin-bottom: 15px;
`;

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  i {
    font-size: 35px;
    margin-right: 10px;
    color: "#676a6c";
  }
`;

const StyledH3 = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #676a6c;
  margin: 0px;
`;
