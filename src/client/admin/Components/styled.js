import styled from "styled-components";
import { Input } from "antd";
import { FlexDiv } from "../Common/Styled-Components";

const { Search } = Input;

export const MainDiv = styled.div`
  padding: 15px;
`;

export const TextInput = styled(Search)`
  margin-right: 10px;
  ${({ circular }) =>
    circular &&
    `input {
    border-radius: 20px;
  }`}
`;

export const FirstDiv = styled(FlexDiv)`
  margin-bottom: 10px;
`;
