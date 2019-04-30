import styled from "styled-components";
import { Row, Input, Button, Form } from "antd";
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

  ::placeholder {
    color: rgba(68, 68, 68, 0.4);
    font-style: italic;
  }
`;

export const StyledInputB = styled(StyledInput)`
  .ant-input {
    font-size: 18px;
    font-weight: 600;
    width: 100%;
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

export const StyledUrlButton = styled.a`
  line-height: 40px;
  margin-left: 20px;
  color: #1890ff;
`;

export const StyledPopoverContent = styled.div`
  display: flex;
  justify-contents: space-around;
  border: 1px solid #e8e8e8;
  padding: 5px 10px;
`;

export const PopoverCloseButton = styled(Button)`
  border: none;
  outline: none;
  box-shadow: none;
  color: #1890ff;
  margin-left: 30px;
`;

export const StyledDistrictUrl = styled.p`
  line-height: 32px;
  font-weight: 600;
`;

export const StyledFormItem = styled(Form.Item)`
  width: 100%;
  .ant-form-item-children {
    width: 100%;
  }

  .ant-input-affix-wrapper {
    width: ${props => props.widthSize + 30 + "px"};
    min-width: 220px;
  }
`;
