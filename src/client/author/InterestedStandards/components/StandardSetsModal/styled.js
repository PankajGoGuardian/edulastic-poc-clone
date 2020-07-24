import styled from "styled-components";
import { Select, Row, Input } from "antd";

export const SubjectContainer = styled.div`
  max-height: 300px;
  height: 300px;
  overflow-y: auto;

  .ant-checkbox-group {
    display: flex;
    flex-direction: column;
  }
`;

export const StyledRow = styled(Row)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const SubjectSelect = styled(Select)`
  width: 100%;
`;

export const MyStandardInput = styled(Input)`
  &:hover,
  &:focus {
    border-color: ${props => props.theme.themeColor};
    box-shadow: 0 0 0 2px ${props => props.theme.themeColor}33;
  }
`;
