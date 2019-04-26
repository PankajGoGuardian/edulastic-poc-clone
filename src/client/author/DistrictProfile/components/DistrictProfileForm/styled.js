import styled from "styled-components";
import { Row, Input, Button } from "antd";
const { TextArea } = Input;

export const StyledFormDiv = styled.div`
  display: flex;
  width: 100%;
  .ant-form {
    display: flex;
    width: 100%;
  }
`;

export const StyledLabel = styled.label`
  margin-right: 20px;
  text-align: right;
  width: 200px;
  line-height: 40px;
`;

export const StyledLabelSH = styled(StyledLabel)`
  line-height: 14px;
`;

export const StyledDivBg = styled.div`
  width: 360px;
  padding-right: 40px;
`;

export const StyledDivMain = styled.div`
  width: 100%;
`;

export const StyledRow = styled(Row)`
  display: flex;
  flex-direction: row;
`;

export const StyledRowLogo = styled(StyledRow)`
  margin-bottom: 20px;
`;

export const StyledRowAnn = styled(StyledRow)`
  .ant-form-item {
    min-width: 500px;
  }
`;

export const DistrictUrl = styled.p`
  margin-left: 10px;
  line-height: 24px;
  align-self: center;
`;

export const StyledInput = styled(Input)`
  width: 220px;
  border: none;

  &:focus {
    border: 1px solid #40a9ff;
  }

  ::placeholder {
    color: rgba(68, 68, 68, 0.4);
    font-style: italic;
  }
`;

export const StyledInputB = styled(StyledInput)`
  .ant-input {
    font-size: 18px;
    font-weight: 600;
  }
`;

export const StyledTextArea = styled(TextArea)`
  width: 100%;
  max-width: 500px !important;
  border: 1px solid #d9d9d9;
`;

export const SaveButton = styled(Button)`
  margin-left: 220px;
  color: white;
  border: 1px solid #00b0ff;
  min-width: 85px;
  background: #00b0ff;
  &:hover {
    background: #fff;
    border-color: #40a9ff;
  }
`;

export const StyledLink = styled.a`
  line-height: 40px;
  margin-left: 20px;
  color: #1890ff;
`;
