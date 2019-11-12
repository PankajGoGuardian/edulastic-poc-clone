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
  titleColor,
  mediumDesktopWidth,
  extraDesktopWidthMax,
  desktopWidth,
  mobileWidthLarge,
  tabGrey,
  mainTextColor,
  title,
  cardTitleColor,
  lightGreySecondary,
  secondaryTextColor,
  boxShadowDefault,
  themeColorLighter,
  smallDesktopWidth,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { Button, Icon, Divider, Menu, Checkbox, Table, Modal } from "antd";
import { IconManage } from "@edulastic/icons";

import { Paper } from "@edulastic/common";
import IconArchive from "@edulastic/icons/src/IconArchive";

export const TableWrapper = styled.div`
  background: ${white};
  padding: 10px 30px;
  border-radius: 10px;
  box-shadow: ${boxShadowDefault};
  margin-bottom: 30px;
`;

export const StudentsTable = styled(Table)`
  .ant-table {
    overflow: auto;
    &-thead {
      & > tr {
        & > th {
          border: none;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          color: ${cardTitleColor};
          background: white;
          padding: 16px 10px;
          &.ant-table-column-has-actions.ant-table-column-has-sorters:hover,
          & .ant-table-header-column .ant-table-column-sorters::before {
            background: ${white};
          }
          &.ant-table-column-has-actions.ant-table-column-has-filters
            &.ant-table-column-has-actions.ant-table-column-has-sorters {
            text-align: center;
          }
          .ant-table-column-sorters {
            display: flex;
            justify-content: center;

            .ant-table-column-sorter-inner {
              &.ant-table-column-sorter-inner-full {
                margin-top: 0em;
              }
              .ant-table-column-sorter {
                &-up,
                &-down {
                  font-size: 10px;
                }
              }
            }
          }
        }
        & > :nth-last-of-type(-n + 3) {
          text-align: center;
        }
      }
    }
    &-tbody {
      & > tr {
        background: ${lightGreySecondary};
        letter-spacing: 0.26px;
        color: ${secondaryTextColor};
        font-size: 14px;
        cursor: pointer;
        border: none;
        border-bottom: 15px solid white;
        & > td {
          border: none;
          &.ant-table-column-sort {
            background: none;
          }
          font-weight: 550;
          padding: 10px 16px;
        }
        & > :nth-last-of-type(-n + 3) {
          text-align: center;
        }
      }
    }
  }
`;

export const HeaderTitle = styled.div`
  max-width: calc(100vw - 350px);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  text-align: left;
  display: flex;
  color: ${white};
  span {
    font-weight: 300;
  }

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
  }
`;

export const IconManageClass = styled(IconManage)`
  margin-top: 5px;
  margin-right: 10px;
`;

export const IconArchiveClass = styled(IconArchive)`
  margin-top: 5px;
  margin-left: 10px;
  cursor: pointer;
`;

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 14px;
  border-radius: 25px;
  height: 40px;
  display: flex;
`;

export const EditButton = styled(Button)`
  width: 135px;
  padding: 0px 1px;
  border: none;
  color: ${themeColor};
  background: ${white};
  font-weight: 600;
  font-size: 11px;
  height: 36px;
  text-transform: uppercase;
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColorLight};
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: 45px;
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
  margin: 10px 0px;
`;

export const Container = styled(Paper)`
  border-radius: 0px;
  margin: 30px;
  width: 95%;
  background: none;
`;

export const ContainerHeader = styled.div`
  width: 100%;
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
  font-weight: 700;
  color: ${themeColor};
  margin-right: 15px;
`;

export const ClassCode = styled.div`
  font-size: 12px;
  font-weight: 700;
  margin: 0px 5px;
  color: ${cardTitleColor};
  text-transform: uppercase;
  span {
    font-size: 18px;
    color: ${themeColorLighter};
    margin-left: 50px;
  }
  @media (max-width: ${desktopWidth}) {
    padding-right: 0px;
  }
`;

export const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-height: 260px;
  padding: 20px;
  background: white;
  border-radius: 10px;
`;

export const AddStudentDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0px;
  justify-content: flex-end;
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
  min-width: 200px;
  min-height: 100px;
  border-radius: 5px;
  @media (min-width: ${extraDesktopWidthMax}) {
    width: 200px;
    height: 60%;
  }
  @media (max-width: ${mediumDesktopExactWidth}) {
    height: 100%;
  }
  @media (max-width: ${smallDesktopWidth}) {
    height: 60%;
  }
`;

export const MidWrapper = styled.div``;

export const RightWrapper = styled.div`
  text-align: start;
  min-width: 200px;
  @media (max-width: ${desktopWidth}) {
    padding-right: 0px;
  }
`;

export const FieldValue = styled.div`
  font-weight: 550;
  color: ${cardTitleColor};
  margin-top: 12px;
  display: flex;
  div {
    min-width: 100px;
    text-transform: uppercase;
    font-size: 12px;
  }

  &:first-child {
    margin-top: 0px;
  }
  span {
    margin-left: 5px;
    color: ${secondaryTextColor};
  }
  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 14px;
  }
  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 13px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    font-size: 11px;
  }
`;

export const FieldLabel = styled.section`
  min-width: 180px;
  text-align: right;
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
  color: ${titleColor};
  &:hover {
    background: ${themeColor}20;
  }

  svg {
    fill: ${themeColor};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledButton = styled(Button)`
  border-radius: 4px;
  width: 114px;
  height: 36px;
  font-size: 11px;
  font-family: Open Sans, Semibold;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => (props.type === "primary" ? themeColor : white)};
  color: ${props => (props.type === "primary" ? white : themeColor)};
  border-color: ${themeColor};
`;

const StyledTabButton = styled.a`
  height: 28px;
  padding: 6px 35px;
  font-size: 10px;
  font-weight: 600;
  background-color: ${white};
  color: ${themeColor};
  &:hover {
    background-color: ${themeColor};
    color: ${white};
  }

  @media (max-width: ${mediumDesktopWidth}) {
    padding: 6px 30px;
  }
  @media (max-width: ${desktopWidth}) {
    padding: 6px 15px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    text-align: center;
    margin: 0 !important;
  }
`;

export const RedirectButton = styled(StyledTabButton)`
  border-radius: 4px;
  display: flex;
  width: 150px;
  color: ${themeColor};
  margin-right: 10px;
  position: relative;
  justify-content: center;
  box-shadow: ${boxShadowDefault};
  &:nth-last-child(1) {
    margin-right: 0px;
  }
  &:hover {
    svg {
      fill: ${white};
      path,
      circle {
        fill: ${white};
      }
    }
  }
  svg {
    fill: ${themeColor};
    path,
    circle {
      fill: ${themeColor};
    }
  }

  @media (max-width: ${mobileWidthLarge}) {
    width: auto;
    padding: 6px 12px;
    svg {
      display: none;
    }
  }
`;

export const CustomRedirectButton = styled(RedirectButton)`
  white-space: nowrap;
  width: auto;
  background: ${themeColor};
  color: ${white};
`;

export const ButtonIconWrap = styled.span`
  display: block;
  left: 10px;
  position: absolute;
`;

export const DropMenu = styled(Menu)`
  margin-top: 10px;
  width: 190px;
`;

export const MenuItems = styled(Menu.Item)`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${title};
  font-weight: 600;
  &:hover {
    svg {
      fill: ${white};
      path {
        fill: ${white};
        stroke: ${white};
      }
    }
  }
  svg,
  i {
    fill: ${mainTextColor};
    height: 12px;
    margin-right: 10px;
    path {
      fill: ${mainTextColor};
    }
  }
  &:not(.ant-dropdown-menu-item-disabled):hover {
    color: ${white};
    background-color: ${themeColor};
  }
`;
export const CaretUp = styled.i`
  position: absolute;
  top: -20px;
  color: ${white};
  right: 60px;
  font-size: 30px;
`;

export const ImageContainer = styled.div`
  width: 25%;
  @media (min-width: ${extraDesktopWidthMax}) {
    width: 200px;
  }
`;

export const ClassInfoContainer = styled.div`
  width: 74%;
  padding: 0 1.2rem;
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 0 120px 0 30px;
    width: 100%;
  }
`;

export const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SwitchBox = styled.span`
  font-size: 10px;
  padding-bottom: 10px;
  .ant-switch {
    min-width: 32px;
    height: 16px;
    margin: 0px 0px 0px 5px;
    &:after {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: ${mobileWidthLarge}) {
    display: none;
  }
`;

export const GoogleClassSyncModal = styled(Modal)`
  top: 35%;
  border-radius: 7px;
  .ant-modal-header {
    border: none;
    padding: 20px 24px;
    .ant-modal-title {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .ant-modal-body {
    padding: 10px 24px;
  }

  .ant-modal-footer {
    border: none;
    padding: 20px 24px;
  }
`;
