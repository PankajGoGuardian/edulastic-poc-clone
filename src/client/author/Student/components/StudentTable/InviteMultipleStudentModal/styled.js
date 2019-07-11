import styled from "styled-components";
import { Input, Row, Icon, Col, Button } from "antd";
import { themeColor } from "@edulastic/colors";

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
export const ItemDiv = styled.div`
  padding: 0.5rem;
  border-radius: 4px;
  color: black;
  text-align: center;
  margin: 0.2rem;
  border: 1px solid lightgrey;
`;

export const Text = styled.h3`
  font-size: 16px;
  color: darkgray;
  font-weight: 600;
  font-family: "Open Sans";
`;
export const IconWrapper = styled(Icon)`
  color: green;
  font-size: 20px;
`;

export const ColWrapper = styled(Col)`
  border: 0.3px solid lightgrey;
  text-align: center;
  height: 200px;
`;

export const ActionButton = styled(Button)`
  background: ${themeColor};
  border-color: ${themeColor};
  &:hover,
  &:focus {
    background: ${themeColor};
    border-color: ${themeColor};
  }
`;
