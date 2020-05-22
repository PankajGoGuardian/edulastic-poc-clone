import styled from "styled-components";
import { Layout, Spin, Input, List, Col, Row } from "antd";
import { themeColor, white, lightGreySecondary, sectionBorder, mediumDesktopExactWidth } from "@edulastic/colors";
import { ThemeButton } from "../../../src/components/common/ThemeButton";

const { Content } = Layout;

export const StandardsProficiencyDiv = styled.div`
  display: flex;
  flex-direction: row;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    text-align: center;
  }

  .ant-table-thead > tr > th:first-child,
  .ant-table-tbody > tr > td:first-child {
    text-align: left;
  }
`;

export const StyledContent = styled(Content)`
  width: 100%;
  padding: 90px 30px 30px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 126px 30px 30px;
  }
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  pointer-events: ${props => (props.loading === "true" ? "none" : "auto")}
  min-height: 400px;
`;

export const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(68, 68, 68, 0.1);
  z-index: 999;
  border-radius: 10px;
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`;

export const CreateProfile = styled(ThemeButton)`
  font-size: 11px;
  text-transform: uppercase;
  height: 45px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  i {
    width: 19px;
    height: 19px;
    background: ${white};
    color: ${themeColor};
    line-height: 20px;
    border-radius: 50%;
    margin-right: 10px;
    font-style: normal;
    font-size: 20px;
    text-align: center;
  }
`;

export const ModalInput = styled(Input)`
  background: ${lightGreySecondary};
  border-color: ${sectionBorder};
  border-radius: 2px;
  height: 40px;
  margin-top: 10px;
`;

export const ListItemStyled = styled(List.Item)`
  display: block;
  background-color: #fff;
  border: 0;
  padding: 0;
  &.ant-list-item {
    border: none;
    padding: 0px;
  }
`;

export const RowStyled = styled(Row)`
  background: ${white};
`;

export const StyledProfileRow = styled(Row)`
  display: block;
  padding: 0px 20px;
  background-color: ${lightGreySecondary};
  border: 1px solid ${sectionBorder} !important;
  margin-bottom: 7px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  h3 {
    font-weight: 500;
    font-size: 15px;
    margin: 0px;
  }
`;

export const StyledProfileCol = styled(Col)`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-content: center;
  & > i.anticon {
    color: ${themeColor};
    height: 15px;
    width: 15px;
    margin-left: 20px;
  }
`;

export const StyledList = styled(List)`
  border: none;
`;
