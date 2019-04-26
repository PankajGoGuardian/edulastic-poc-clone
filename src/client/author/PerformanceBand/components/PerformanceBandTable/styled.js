import styled from "styled-components";
import { Button, Row, Col, Icon } from "antd";

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;

  tr:nth-child(2n) {
    background-color: #fafafa !important;
  }

  .ant-table-thead > tr > th {
    text-align: center !important;
  }

  .ant-table-tbody > tr > td {
    border: none !important;
  }
`;

export const StyledRow = styled(Row)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const StyledCol = styled(Col)`
  text-align: center;
`;

export const StyledBottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const StyledAddButton = styled(Button)`
  border-radius: 16px;
  border: 2px solid #409aff;
  color: #409aff;
  &:hover {
    background-color: #409aff;
    color: #fff;
  }
`;

export const StyledSaveButton = styled(Button)`
  margin-right: 20px;
  background-color: #409aff;
  border: 2px solid #409aff;
  color: #fff;

  &:hover {
    background-color: #fff;
    color: #409aff;
  }
`;

export const StyledColFromTo = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const StyledButton = styled.a`
  display: flex;
  align-items: center;
  height: 32px;
  color: #1890ff;
  user-select: none;
  cursor: pointer;
`;

export const StyledProP = styled.p`
  margin-left: 20px;
  margin-right: 20px;
  pointer-events: none;
  user-select: none;
  text-align: center;
  line-height: 32px;
`;

export const StyledIcon = styled(Icon)`
  font-size: 16px;
  font-weight: bold;
`;

export const StyledDivCenter = styled.div`
  text-align: center;
`;
