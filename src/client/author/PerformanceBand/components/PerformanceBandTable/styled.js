import styled from "styled-components";
import { Button, Row, Col, Icon, Input } from "antd";

export const StyledTableContainer = styled.div`
  display: flex;
  flex-direction: column;

  // tr:nth-child(2n) {
  //   background-color: #fafafa !important;
  // }

  .ant-table-thead > tr > th {
    text-align: center;
    text-transform: uppercase;
    background-color: #fff;
    font-size: 11px;
    font-weight: bold;
    color: #aaafb5;
    box-sizing: border-box;
    height: 47px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .ant-table-tbody tr:hover > td {
    background-color: #fff;
  }

  .ant-table-tbody tr > td {
    padding: 4px 4px;
    border: 0;
  }

  .ant-table-thead > tr {
    border: 1px solid #e1e1e1;
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

export const StyledSaveButton = styled(Button)`
  margin-right: 20px;
  margin-bottom: 15px;
  text-transform: uppercase;
  border-radius: 4px;
  color: #fff;
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
  margin-left: 10px;
  margin-right: 10px;
  pointer-events: none;
  user-select: none;
  text-align: center;
  line-height: 32px;
  width: 100px;
`;

export const StyledIcon = styled(Icon)`
  font-size: 16px;
  font-weight: bold;
`;

export const StyledDivCenter = styled.div`
  text-align: center;
`;

export const StyledEnableContainer = styled.div`
  display: flex;
  justify-content: space-around;

  .ant-input {
    width: 80px;
    min-width: 80px;
    text-align: center;
  }

  .ant-form-item-children {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const SaveAlert = styled.p`
  color: #f9ac59;
  text-align: right;
  margin-right: 20px;
  line-height: 32px;
`;
