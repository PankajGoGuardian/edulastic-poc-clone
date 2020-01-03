import styled from "styled-components";
import { Row, Button, Form } from "antd";
import { themeColor, textColor } from "@edulastic/colors";

export const StyledFormDiv = styled.div`
  display: flex;
  width: 100%;
  .ant-form {
    width: 100%;
  }
`;

export const StyledRow = styled(Row)`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;

export const StyledLabel = styled.label`
  text-align: right;
  min-width: 200px;
  margin-right: 40px;
`;

export const SaveButton = styled(Button)`
  color: white;
  border: 1px solid ${themeColor};
  min-width: 85px;
  background: ${themeColor};
  margin-left: auto;
  &:hover,
  &:focus {
    color: ${themeColor};
    background: #fff;
    border-color: ${themeColor};
  }
`;

export const StyledElementDiv = styled.div`
  display: flex;
  flex-direction: column;

  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }

  .ant-checkbox-wrapper {
    margin-bottom: 15px;
  }
`;

export const StyledFormItem = styled(Form.Item)`
  width: 500px;
`;

export const HelperText = styled.p`
  line-height: 20px;
  font-size: 13px;
  color: ${textColor};
`;
