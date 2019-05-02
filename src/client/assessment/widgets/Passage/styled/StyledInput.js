import React from "react";
import styled from "styled-components";
import { Input } from "antd";

const StyledTabInput = props => <Input {...props} tabIndex={1} />;

export const StyledInput = styled(StyledTabInput)`
  width: 100%;
`;
