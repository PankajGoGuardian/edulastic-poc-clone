import styled from "styled-components";
import { Form, Select } from "antd";

export const StyledFormItem = styled(Form.Item)`
  margin: 0;
`;

export const ScoreColorSpan = styled.span`
  display: block;
  border: 1px solid #000;
  width: 20px;
  height: 15px;
  background-color: ${props => props.color};
`;

export const StyledColorSelect = styled(Select)`
  &.ant-select {
    min-width: 62px;
    width: 62px;
  }
  .ant-select-selection-selected-value {
    margin: 7px 0 0 0;
  }
`;

export const ScoreSpan = styled.span`
  margin-left: 5px;
`;
