import {
  desktopWidth,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  mobileWidthLarge,
  greenDark7,
  themeColor,
  themeColorLighter,
  title,
  titleColor,
  textColor,
  secondaryTextColor,
  cardTitleColor,
  greyDarken,
  mainTextColor,
  white,
  greyThemeDark4,
  themeColorBlue,
  lightRed,
} from '@edulastic/colors'
import { Paper, EduTableStyled, SelectInputStyled } from '@edulastic/common'
import { IconManage } from '@edulastic/icons'
import IconArchive from '@edulastic/icons/src/IconArchive'
import { Button, Divider, Icon, Menu, Modal, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const OptionWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
export const SelectStyled = styled(SelectInputStyled)`
  .ant-select-selection__placeholder {
    color: ${secondaryTextColor};
  }
`

export const TableWrapper = styled.div`
  background: ${white};
  padding: 10px 0px;
  border-radius: 10px;
  margin-bottom: 30px;
`

export const StudentsTable = styled(EduTableStyled)`
  .ant-table {
    overflow: auto;
    .ant-table-thead {
      & > tr {
        .ant-table-selection-column {
          text-align: left;
          .ant-checkbox-wrapper {
            margin-left: 10px;
          }
        }
        & > th {
          font-size: 12px;
          padding: 16px 0px;
        }
      }
    }
    .ant-table-tbody {
      & > tr {
        .ant-table-selection-column {
          text-align: left;
        }
        .ant-checkbox-wrapper {
          margin-left: 10px;
        }
        & > td {
          padding: 10px 0px;
          font-size: 14px;
          letter-spacing: 0.26px;
          color: ${secondaryTextColor};
          &:last-child {
            padding: 0px;
            width: 10%;
            svg {
              display: none;
              width: auto;
              height: 28px;
              fill: ${greenDark7};
            }
          }
        }
        &:hover:not(.ant-table-expanded-row) > td:last-child {
          & > div {
            display: flex;
            gap: 16px;
          }
          svg {
            display: block;
          }
        }
      }
    }
  }
`

export const HeaderTitle = styled.div`
  max-width: calc(100vw - 350px);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.36;
  text-align: left;
  display: flex;
  color: ${white};
  span {
    font-weight: 300;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 22px;
  }
`

export const IconManageClass = styled(IconManage)`
  margin-top: 5px;
  margin-right: 10px;
`

export const IconArchiveClass = styled(IconArchive)`
  margin-top: 5px;
  margin-left: 10px;
  cursor: pointer;
`

const ShareButtonStyle = css`
  font-weight: 600;
  font-size: 14px;
  border-radius: 25px;
  height: 40px;
  display: flex;
`

export const EditButton = styled(Button)`
  width: 135px;
  padding: 0px 1px;
  color: ${themeColor};
  background: ${white};
  border-color: ${themeColor};
  font-weight: 600;
  font-size: 11px;
  height: 36px;
  text-transform: uppercase;
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColor};
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: 45px;
  }
`

export const CircleIconButton = styled(Button)`
  margin-right: 16px;
`

export const ActionButton = styled(Button)`
  font-weight: 600;
  font-size: 14px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-right: 16px;
  color: ${themeColor};
`

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
`
export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: right;
`

export const StyledDivider = styled(Divider)`
  margin: 10px 0px;
`

export const Container = styled(Paper)`
  border-radius: 0px;
  margin: 30px;
  width: 95%;
  background: none;
`

export const ContainerHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const LeftContent = styled.div`
  display: flex;
  align-items: center;
`

export const StyledIcon = styled(Icon)`
  margin-left: 8px;
  svg {
    fill: ${({ fill }) => fill || themeColor};
    font-size: ${({ size }) => size || 20}px;
  }
`

export const TitleWarapper = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-left: 10px;
  p {
    font-size: 14px;
    font-weight: 400;
    color: ${greyDarken};
  }
`

export const RightContent = styled.div`
  display: flex;
  align-items: center;
`

export const AnchorLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  color: ${themeColor};
  margin-right: 15px;
`

export const ClassLink = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${themeColor};
  margin-right: 15px;
  cursor: pointer;
`

export const CodeWrapper = styled(Row)`
  width: 100%;
  justify-content: end;
`

export const ClassCode = styled(Col)`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
  color: ${secondaryTextColor};
  text-transform: uppercase;
  display: flex;
  align-items: center;
  span {
    font-size: 18px;
    color: ${themeColorLighter};
    margin-left: 15px;
  }
  @media (max-width: ${desktopWidth}) {
    padding-right: 0px;
  }
`
export const Studentscount = styled(ClassCode)``

export const CoTeacher = styled(ClassCode)`
  span {
    font-size: 15px;
  }
`
export const PopCoTeachers = styled.div`
  display: flex;
  justify-content: center;
  width: 22px;
  height: 17px;
  background-color: ${themeColorLighter};
  color: ${white};
  margin-top: 1px;
  margin-left: 5px;
  border-radius: 2px;
  cursor: pointer;
`

export const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: auto;
  padding: 20px 0px;
  background: white;
  border-radius: 10px;
`

export const AddStudentDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0px;
  justify-content: flex-end;
`

export const CleverInfoBox = styled.div`
  font-size: 14px;
  background: ${(props) => (props.alert ? lightRed : '#dddddd')};
  padding: 5px 20px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  svg {
    margin-right: 10px;
    path {
      fill: ${themeColorBlue};
    }
  }
`

export const LeftWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const DividerDiv = styled.div`
  width: -webkit-fill-available;
  border-bottom: 1px #e8e8e8 solid;
  height: 1px;
  margin: 12px 8px;
`

export const Image = styled.img`
  width: 100%;
  min-width: 200px;
  min-height: 100px;
  border-radius: 5px;
  height: auto;
`

export const MidWrapper = styled(Row)`
  width: 100%;
  margin: 5px 0px;
`

export const RightWrapper = styled.div`
  text-align: start;
  min-width: 200px;
  @media (max-width: ${desktopWidth}) {
    padding-right: 0px;
  }
`

export const FieldValue = styled.div`
  display: flex;
  font-weight: 550;
  color: ${cardTitleColor};
  display: flex;
  font-size: 14px;
  div {
    min-width: 80px;
    text-transform: uppercase;
    font-size: 12px;
  }
  span {
    margin: 0px 5px;
    color: ${secondaryTextColor};
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 13px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 14px;
  }
`

export const FieldLabel = styled.section`
  min-width: 180px;
  text-align: right;
`

export const StudentContent = styled.div``

export const NoStudents = styled.div`
  padding: 3px 8px;
  background: #e4eef3;
  border-radius: 4px;
  display: flex;
`

export const NoConentDesc = styled.div`
  font-size: 18px;
  font-style: italic;
  margin-left: 16px;
  color: ${textColor};
  p {
    font-size: 14px;
  }
`

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
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledButton = styled(Button)`
  border-radius: 4px;
  width: 114px;
  height: 36px;
  font-size: 11px;
  font-family: Open Sans, Semibold;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => (props.type === 'primary' ? themeColor : white)};
  color: ${(props) => (props.type === 'primary' ? white : themeColor)};
  border-color: ${themeColor};
`

const StyledTabButton = styled.a`
  height: 30px;
  padding: 6px 35px;
  font-size: 10px;
  font-weight: 600;
  background-color: ${white};
  color: ${themeColor};
  border: 1px solid ${themeColor};
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${themeColor};
    color: ${white};
  }

  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    text-align: center;
    margin: 0 !important;
  }
`

export const RedirectButton = styled(StyledTabButton)`
  border-radius: 4px;
  width: 150px;
  color: ${themeColor};
  margin-right: 10px;
  position: relative;

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
`

export const CustomRedirectButton = styled(RedirectButton)`
  white-space: nowrap;
  width: auto;
  background: ${themeColor};
  color: ${white};
`

export const ButtonIconWrap = styled.span`
  display: block;
  left: 10px;
  position: absolute;
`

export const DropMenu = styled(Menu)`
  margin-top: 10px;
  width: 190px;
`

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
      circle {
        stroke: ${mainTextColor};
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
`
export const CaretUp = styled.i`
  position: absolute;
  top: -20px;
  color: ${white};
  right: 60px;
  font-size: 30px;
`

export const ImageContainer = styled.div`
  width: 250px;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 300px;
  }
`

export const ClassInfoContainer = styled.div`
  width: calc(100% - 250px);
  height: auto;
  padding: 0 1.2rem;

  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 0 30px;
    width: calc(100% - 300px);
  }
`

export const FlexDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
`

export const SwitchBox = styled.span`
  font-size: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  position: relative;
  top: -50px;
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
`

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
`
export const Institution = styled.div`
  font-size: 14px;
  color: ${greyThemeDark4};
  font-weight: normal;
`

export const NotEnrolledMessage = styled.div`
  display: flex;
  svg {
    margin-top: 4px;
    margin-right: 5px;
  }
`

export const ViewAssignmentsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto 0px;
  align-items: center;
  width: 250px;

  font-size: 10px;
  font-weight: 400;
  align: center;

  button {
    color: ${themeColor};
    font-size: 10px;
    font-weight: 700;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 350px;
  }
`
