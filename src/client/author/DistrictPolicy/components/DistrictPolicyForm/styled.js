import styled from "styled-components";
import { Row, Button, Select } from "antd";

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
  border: 1px solid #00b0ff;
  min-width: 85px;
  background: #00b0ff;
  margin-left: auto;
  &:hover {
    background: #fff;
    border-color: #40a9ff;
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

export const StyledSelectTag = styled(Select)`
  max-width: 500px;
  .ant-select-selection--multiple .ant-select-selection__rendered {
    margin-top: 5px;
  }
`;
