import styled from "styled-components";
import { Form } from "antd";

export const StyledFormItem = styled(Form.Item)`
  width: 440px;
  .ant-input {
    font-size: 18px;
    font-weight: 600;
    width: 100%;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 24px;
  font-size: 18px;
  font-weight: 600;
`;

export const StyledP = styled.p`
  margin-right: 10px;
  line-height: 40px;
  padding-left: 12px;
`;
