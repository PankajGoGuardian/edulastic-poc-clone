import styled from "styled-components";
import { lightBlue } from "@edulastic/colors";
import { Input, Col } from "antd";

export const LightBlueSpan = styled.span`
  color: ${lightBlue};
  font-weight: bold;
`;

export const StyledCol = styled(Col)`
  justify-content: center;
  display: flex;
`;

export const StyledInput = styled(Input)`
  margin: 0 auto;
  width: 100px;
  text-align: center;
`;

export const StyledP = styled.p`
  margin-bottom: 5px;
`;

export const StyledClassName = styled.p`
  text-align: center;
  color: ${lightBlue};
  font-weight: bold;
  margin-bottom: 5px;
`;
