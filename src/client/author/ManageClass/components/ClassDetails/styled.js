import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import {
  white,
  themeColorLight,
  themeColor,
  greyDarken,
  textColor,
  greenDark,
  darkGrey,
  titleColor
} from "@edulastic/colors";
import { Button, Icon, Divider, Menu, Checkbox, Table } from "antd";
import { IconManage } from "@edulastic/icons";

import { Paper } from "@edulastic/common";

export const StudentsTable = styled(Table)`
  .ant-table-tbody > tr > td {
    text-align: center;
  }
  .ant-table-thead > tr > th {
    text-align: center;
  }
`;

export const CheckboxShowStudents = styled(Checkbox)`
  margin-bottom: 1rem;
  .ant-checkbox .ant-checkbox-inner {
    padding: 0.5rem;
  }
  .ant-checkbox + span {
    font-size: 15px;
  }
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  text-align: left;
  display: flex;
  color: ${white};

  span {
    font-weight: 500;
    margin-left: 10px;
  }
`;

export const IconManageClass = styled(IconManage)`
  margin-top: 5px;
  margin-right: 10px;
`;

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 14px;
  border-radius: 25px;
  height: 40px;
  display: flex;
`;

export const EditButton = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border: none;
  color: ${themeColor};
  background: ${white};
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColorLight};
  }
`;

export const CircleIconButton = styled(Button)`
  margin-right: 16px;
`;

export const ActionButton = styled(Button)`
  font-weight: 600;
  font-size: 14px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-right: 16px;
  color: ${themeColor};
`;

export const AddStudentButton = styled(Button)`
  ${ShareButtonStyle}
  padding: 5px 20px;
  border: none;
  color: ${white};
  background: ${themeColor};
  display: flex;
  align-items: center;
  &:hover {
    color: ${white};
    background: ${themeColor};
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`;

export const StyledDivider = styled(Divider)`
  margin-top: 10px;
`;

export const Container = styled(Paper)`
  margin: 15px auto 0 auto;
  padding: 30px 15px;
  border-radius: 0px;
  width: 80%;
`;

export const ContainerHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const LeftContent = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledIcon = styled(Icon)`
  margin-left: 8px;
  svg {
    fill: ${({ fill }) => fill || themeColor};
    font-size: ${({ size }) => size || 20}px;
  }
`;

export const TitleWarapper = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-left: 10px;
  p {
    font-size: 14px;
    font-weight: 400;
    color: ${greyDarken};
  }
`;

export const RightContent = styled.div`
  display: flex;
  align-items: center;
`;

export const AnchorLink = styled(Link)`
  font-size: 14px;
  font-weight: 600;
  color: ${themeColor};
`;

export const ClassCode = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-left: 8px;
  color: ${textColor};
  span {
    font-size: 18px;
    text-transform: uppercase;
    color: ${greenDark};
  }
`;

export const MainContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

export const AddStudentDivider = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const LeftWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const DividerDiv = styled.div`
  width: -webkit-fill-available;
  border-bottom: 1px #e8e8e8 solid;
  height: 1px;
  margin: 12px 8px;
`;

export const Image = styled.img`
  width: 100%;
  height: 140px;
  border-radius: 5px;
`;

export const MidWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 1;
  margin: 0px 16px;
`;

export const RightWrapper = styled.div`
  flex: 1;
`;

export const FieldValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${titleColor};
  margin-top: 12px;
  display: flex;

  div {
    min-width: 120px;
  }

  &:first-child {
    margin-top: 0px;
  }
  span {
    margin-left: 5px;
    color: ${darkGrey};
  }
`;

export const StudentContent = styled.div``;

export const NoStudents = styled.div`
  padding: 3px 8px;
  background: #e4eef3;
  border-radius: 4px;
  display: flex;
`;

export const NoConentDesc = styled.div`
  font-size: 18px;
  font-style: italic;
  margin-left: 16px;
  color: ${textColor};
  p {
    font-size: 14px;
  }
`;

export const MenuItem = styled(Menu.Item)`
  display: flex;
  align-items: center;
  color: ${themeColorLight};

  svg {
    fill: ${themeColorLight};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const ButtonRightWrapper = styled.div`
  display: inline-flex;
`;

export const StyledButton = styled(Button)`
  &:hover,
  &:focus,
  &:active {
    color: ${props => (props.type === "primary" ? white : themeColorLight)};
    border-color: ${themeColorLight};
  }
`;
