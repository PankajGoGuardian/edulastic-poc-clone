import styled from "styled-components";
import { Form, Input } from "antd";

export const EditableLabelDiv = styled.div`
  display: flex;
`;

export const StyledFormItem = styled(Form.Item)`
  width: 220px;
  .ant-input {
    width: 100%;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 24px;

  .anticon {
    line-height: 40px;
  }
`;

export const StyledP = styled.p`
  margin-right: 10px;
  line-height: 40px;
  padding-left: 12px;
`;

export const StyledLabel = styled.label`
  margin-right: 20px;
  text-align: right;
  width: 200px;
  line-height: 40px;
`;

export const StyledInput = styled(Input)`
  ${props => {
    if (props.isItalic === "true")
      return `::placeholder {
				color: rgba(68, 68, 68, 0.4);
				font-style: italic;
			}`;
  }};
`;
