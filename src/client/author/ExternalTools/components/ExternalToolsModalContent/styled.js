import styled from "styled-components";
import { themeColor } from "@edulastic/common";
import { Row, Input, Select } from "antd";

export const StyledContentRow = styled(Row)`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 10px 0 5px 0;
`;

export const StyledLabel = styled.label`
  font-size: 11px;
  margin-bottom: 9px;
  height: 15px;
  font-weight: 600;
`;

export const StyledInput = styled(Input)`
  .ant-input {
    border-radius: 0;
  }
`;

export const StyledSelect = styled(Select)`
  .ant-select-selection {
    border-radius: 0;
  }
  .ant-select-arrow {
    color: ${themeColor};
  }
`;
