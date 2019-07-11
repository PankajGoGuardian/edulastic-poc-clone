import styled, { css } from "styled-components";

import { white, themeColor, boxShadowDefault, lightBlue } from "@edulastic/colors";
import { Button, Table, Select, Icon } from "antd";
import { IconManage, IconPlus } from "@edulastic/icons";

export const ClassCreateContainer = styled.div`
  background: white;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 60vh;
  font-style: italic;
`;
export const ButtonsContainer = styled.div`
  display: flex;
  margin: 1rem;
  justify-content: space-between;
`;

export const IconEdit = styled(Icon)`
  color: ${themeColor};
  margin-left: 0.3rem;
  cursor: pointer;
`;
export const IconQuestion = styled(Icon)`
  color: ${themeColor};
  padding: 0.2rem;
  font-size: 20px;
`;
export const SyncClassDiv = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${themeColor};
  font-size: 15px;
  cursor: pointer;
`;
export const SyncImg = styled.img`
  margin-right: 0.5rem;
  width: 30px;
  height: 30px;
  margin-left: 0.5rem;
`;
export const CreateClassBtn = styled(Button)`
  display: flex;
  align-items: center;
  border: 2px solid ${themeColor} !important;
  background-color: transparent;
  border-radius: 50px;
  color: ${themeColor};
  margin-right: 0.5rem;
  &:hover {
    background: ${themeColor};
    color: ${white};
  }
`;

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
  margin-bottom: 15px;
  font-weight: bold;
  button {
    &:hover,
    &:focus {
      color: ${themeColor};
    }
  }
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
