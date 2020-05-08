import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { Input } from "antd";

export const Item = styled(FlexContainer)`
  line-height: 100%;
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const TextAreaAnswer = styled(Input.TextArea)`
  resize: none;
`;
