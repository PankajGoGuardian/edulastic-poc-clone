import styled from "styled-components";
import { Input, Row } from "antd";

const { TextArea } = Input;

export const StyledTextArea = styled(TextArea)`
  margin-top: 20px;
  min-height: 200px !important;
  background-color: transparent;
`;

export const PlaceHolderText = styled.p`
  color: #bfbfbf;
  position: absolute;
  margin-top: 22px;
  margin-left: 14px;
  font-size: 14px;
  line-height: 21px;
  pointer-events: none;
  user-select: none;
  display: ${props => (props.visible ? "block" : "none")};
`;

export const SelUserKindDiv = styled(Row)`
  margin-top: 10px;
  .ant-col-8 {
    line-height: 32px;
  }
  .ant-select {
    width: 100%;
  }
`;
