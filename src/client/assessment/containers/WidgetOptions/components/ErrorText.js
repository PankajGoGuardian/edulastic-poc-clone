import React from "react";
import { Tooltip } from "antd";
import styled from "styled-components";
import { redDark } from "@edulastic/colors";

export default () => (
  <Tooltip title="You should use the same variable name as the name of the formula.">
    <Container>Error</Container>
  </Tooltip>
);

const Container = styled.div`
  color: ${redDark};
`;
