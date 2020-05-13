import styled from "styled-components";
import { Input } from "antd";
import { FlexContainer } from "@edulastic/common";


export const Item = styled(FlexContainer)`
  line-height: 100%;
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const TextAnswer = styled(Input.TextArea)`
  resize: none;
`;
