import styled, { css } from "styled-components";
import { white, green, greenDark, fadedGrey, blueButton, boxShadowDefault } from "@edulastic/colors";
import { Button, Table, Select } from "antd";
import { IconManage, IconPlus } from "@edulastic/icons";

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  text-align: left;
  display: flex;
  color: ${white};
`;

export const IconManageClass = styled(IconManage)`
  margin-top: 5px;
  margin-right: 10px;
`;

export const CreateIcon = styled(IconPlus)`
  margin-right: 10px;
`;

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 11px;
  border-radius: 10px;
  height: 40px;
  display: flex;
`;
export const CreateClassButton = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border: none;
  text-transform: uppercase;
  color: ${white};
  background: #42d184;
  &:hover {
    background: #42d184;
    color: ${white};
  }
`;

export const SyncButtons = styled(Button)`
  ${ShareButtonStyle}
  color: #ffffff;
  padding: 0px 25px;
  background-color: #42d184;
  border-color: #42d184;
  margin-right: 20px;
  font-size: 12px;
  &:hover {
    color: #ffffff;
    background-color: #42d184;
    border-color: #42d184;
  }
`;
export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`;
// main content

export const TableWrapper = styled.div`
  background: ${white};
  margin: 40px 40px;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: ${boxShadowDefault};
`;

// class select

export const ClassSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  font-weight: bold;
`;
export const LabelMyClasses = styled.span`
  margin-right: 10px;
`;
export const ClassListTable = styled(Table)`
  .ant-table-tbody > tr {
    cursor: pointer;
  }
`;
export const StyledSelect = styled(Select)`
  width: 100%;
`;
