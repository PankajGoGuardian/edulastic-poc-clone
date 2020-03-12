import styled from "styled-components";
import { Row, Col, List, Select, Input } from "antd";
import { lightGreySecondary, sectionBorder } from "@edulastic/colors";

export const StyledColRight = styled(Col)`
  display: flex;
  justify-content: flex-end;
`;
export const StyledRow = styled(Row)`
  display: flex;
  align-items: center;
  background-color: ${lightGreySecondary};
  border-color: ${sectionBorder};

  i {
    margin-right: 10px;
  }
`;

export const StyledListItem = styled(List.Item)`
  padding: 6px 0;
`;

export const StyledSelect = styled(Select)`
  width: 300px;
`;

export const FormItem = styled(Row)`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;

export const StyledLabel = styled.label`
  float: right;
  margin-right: 40px;
`;

export const StyledInput = styled(Input)`
  width: 300px;
`;
