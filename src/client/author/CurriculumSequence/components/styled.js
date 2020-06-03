import {
  borderGrey4,
  darkGrey2,
  desktopWidth,
  extraDesktopWidth,
  greenDark,
  greenDark6,
  lightGrey6,
  mainBgColor,
  mobileWidth,
  tabletWidth,
  themeColor,
  white,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  smallDesktopWidth,
  mobileWidthLarge
} from "@edulastic/colors";
import { ProgressBar, MathFormulaDisplay } from "@edulastic/common";
import { Col, Modal } from "antd";
import styled, { css } from "styled-components";

export const AssignmentRowContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: stretch;
  ${({ highlightMode }) => highlightMode && `div { animation: inHighlight 5s; }`};
  @keyframes inHighlight {
    0% {
      background-color: white;
    }
    50% {
      background-color: #c9edda;
    }
    100% {
      background-color: white;
    }
  }
`;

export const DragHandle = styled.div`
  color: ${themeColor};
  background: ${white};
  width: 35px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 14px;
  cursor: grab;
  padding: 14px 0px 0px;

  &:active {
    cursor: grabbing;
  }
`;

export const ModalWrapper = styled(Modal)`
  top: 0px;
  padding: 0;
  overflow: hidden;
  .ant-modal-content {
    background: ${mainBgColor};
    .ant-modal-close-icon {
      color: ${white};
    }
    .ant-modal-body {
      padding: 0px;
      min-height: 100px;
      text-align: center;
      main {
        padding: 20px 40px;
        height: calc(100vh - 62px);
        & > section {
          padding: 0px;
        }
      }
    }
  }
`;

export const StyledCol = styled(Col)`
  display: flex;
  align-items: ${props => props.align || "center"};
  justify-content: ${props => props.justify || "flex-start"};
  padding-right: ${({ paddingRight }) => (paddingRight ? `${paddingRight} !important` : "")};
  width: ${({ width }) => width};
  margin-left: ${({ marginLeft }) => marginLeft};
`;

export const FirstColumn = styled(Col)`
/* width: ${props => (props.urlHasUseThis ? "calc(100% - 550px)" : props.reviewWidth)};
@media (max-width: ${mediumDesktopExactWidth}) {
  width: ${props => (props.urlHasUseThis ? "calc(100% - 500px)" : props.reviewWidth)};
} */
`;

export const InfoColumnsMobile = styled(StyledCol)`
  width: 100%;
  position: relative;
  padding-right: 25px;

  @media (max-width: ${smallDesktopWidth}) {
    width: auto;
  }
`;

export const InfoColumnsDesktop = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export const StyledProgressBar = styled(ProgressBar)`
  & .ant-progress-text {
    @media (max-width: ${extraDesktopWidthMax}) {
      font-size: 10px;
    }
  }
`;

export const IconActionButton = styled.div`
  width: 22px;
  height: 22px;
  right: 4px;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  @media (min-width: ${smallDesktopWidth}) {
    position: relative;
    right: 0px;
  }
`;

export const LastColumn = styled(StyledCol)`
  width: ${({ width }) => width || "180px"};
  margin-left: 15px;
  flex-shrink: 0;
  justify-content: ${({ justifyContent }) => justifyContent || "space-between"};
  margin-left: ${({ ml }) => ml || ""};
`;

export const ProficiencyColumn = styled(Col)`
  width: 130px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 100px;
  }
`;

export const SubmittedColumn = styled(Col)`
  width: 100px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 80px;
  }
`;

export const TimeColumn = styled(SubmittedColumn)`
  width: 85px;
  @media (max-width: ${extraDesktopWidthMax}) {
    width: 70px;
  }
`;

export const ClassesColumn = styled(Col)`
  width: 90px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 65px;
  }
`;

export const ScoreColumn = styled(ClassesColumn)`
  width: 90px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 65px;
  }
`;

export const ModuleHeader = styled.div`
  display: flex;
  width: 100%;
  background: ${white};
  align-items: center;
  padding: 20px 0px;

  @media (max-width: ${desktopWidth}) {
    align-items: flex-start;
  }
`;

export const ModuleHeaderData = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 35px);
  position: relative;

  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: column;
  }
`;

export const ModuleID = styled.div`
  margin-right: ${props => props.marginRight || "10px"};
  max-width: 60px;
  color: ${white};
  background: ${greenDark6};
  font-size: 16px;
  border-radius: 2px;
  font-weight: 600;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  margin-top: 0.8em;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 25px;
    height: 25px;
  }
`;

export const ellipsisCss = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ModuleTitle = styled.div`
align-items: left;
color: ${darkGrey2};
font-size: 18px;
font-weight: 600;
${ellipsisCss}

@media (max-width: ${extraDesktopWidthMax}) {
  font-size: 14px;
}
`;

export const ModuleDescription = styled(MathFormulaDisplay)`
color: ${lightGrey6};
font-size: ${props => props.fontSize || "12px"};
line-height: ${props => props.lineHeight || "17px"};
font-weight: ${props => props.fontWeight || "normal"};
letter-spacing: 0.2px;
max-width: 100%;
padding-right: 8px;
${({ collapsed }) => (collapsed ? ellipsisCss : "white-space: normal;")}

@media (max-width: ${extraDesktopWidthMax}) {
  font-size: 12px;
}
`;

export const EllipsisContainer = styled.div`
color: ${lightGrey6};
font-size: ${props => props.fontSize || "12px"};
line-height: ${props => props.lineHeight || "17px"};
font-weight: ${props => props.fontWeight || "normal"};
letter-spacing: 0.2px;
max-width: 95%;
${ellipsisCss}

@media (max-width: ${extraDesktopWidthMax}) {
  font-size: 12px;
}
`;

export const CustomIcon = styled.span`
  cursor: pointer;
  margin-right: ${props => props.marginRight || 0}px;
  margin-left: ${props => props.marginLeft || 0}px;
  font-size: 16px;
  align-self: ${props => props.align || "flex-start"};
`;

export const AssignmentIconsHolder = styled.div`
  display: flex;
  justify-items: flex-end;
  @media only screen and (max-width: ${desktopWidth}) {
    margin-left: 0;
    justify-items: flex-start;
  }
`;

export const ModuleFocused = styled.div`
  border-left: 3px solid ${greenDark};
  width: 3px;
  position: absolute;
  height: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  top: 0;
  opacity: 0;
`;

export const ModuleAssignedUnit = styled.div`
  margin-right: auto;
  @media only screen and (max-width: ${tabletWidth}) {
    margin-right: 0;
    position: absolute;
    top: 0px;
  }
  @media only screen and (max-width: ${tabletWidth}) and (min-width: ${mobileWidth}) {
    right: -25px;
  }
`;

export const ModuleTitleWrapper = styled.div`
  display: flex;
  @media only screen and (max-width: ${tabletWidth}) {
    width: 80%;
  }
`;

export const AssignmentButton = styled.div`
  min-width: 118px;
  .ant-btn {
    color: ${({ assigned }) => (assigned ? white : themeColor)};
    border: 1px solid ${themeColor};
    background-color: ${({ assigned }) => (assigned ? themeColor : white)};
    min-width: 128px;
    max-height: 22px;
    display: flex;
    align-items: center;
    margin: ${({ margin }) => margin};

    svg {
      fill: ${({ assigned }) => (assigned ? white : themeColor)};
    }
    &:hover {
      background-color: ${({ assigned }) => (assigned ? white : themeColor)};
      color: ${({ assigned }) => (assigned ? themeColor : white)};
      border-color: ${({ assigned }) => (assigned ? white : themeColor)};
      svg {
        fill: ${({ assigned }) => (assigned ? themeColor : white)};
      }
    }
    i {
      position: absolute;
      position: absolute;
      left: 6px;
      display: flex;
      align-items: center;
    }
    span {
      margin-left: auto;
      margin-right: auto;
      font: 9px/13px Open Sans;
      letter-spacing: 0.17px;
      font-weight: 600;
    }
  }
`;

export const AssignmentContent = styled.div`
  flex-direction: row;
  display: flex;
  min-width: ${props => (!props.expanded ? "30%" : "65%")};
  @media only screen and (max-width: ${mobileWidth}) {
    width: 80%;
  }
`;

export const ModuleTitlePrefix = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-left: 10px;
`;

export const ModuleDataWrapper = styled.div`
  display: ${({ display }) => `inline-${display}`};
`;

export const ModuleDataName = styled.div`
  display: inline-flex;
  width: ${({ isReview }) => (isReview ? "auto" : "100%")};
  letter-spacing: 0;
  color: ${darkGrey2};
  font: 14px/19px Open Sans;
  cursor: ${({ isReview }) => isReview && "pointer"};
  margin-right: ${({ isResource }) => (isResource ? "8px" : "")};
  span {
    font-weight: 600;
  }
  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
  }
`;

export const EllipticSpan = styled.span`
  width: ${props => props.width || "100%"};
  padding: ${props => props.padding};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  @media only screen and (max-width: ${tabletWidth}) {
    min-width: ${props => props.md || props.width};
    max-width: ${props => props.md || props.width};
  }
  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
  }
  @media only screen and (max-width: ${extraDesktopWidth}) {
    min-width: ${props => props.lg || props.width};
    max-width: ${props => props.lg || props.width};
  }
  @media only screen and (min-width: ${extraDesktopWidth}) {
    min-width: ${props => props.xl || props.width};
    max-width: ${props => props.xl || props.width};
  }
`;

export const AssignmentIcon = styled.span`
  cursor: pointer;
  margin-left: 12px;
  margin-right: ${props => props.marginRight || "0px"};
  width: 15px;
`;

export const Assignment = styled.div`
  padding: 10px 0px;
  display: flex;
  align-items: flex-start;
  position: relative;
  background: white !important;
  &:active ${ModuleFocused}, &:focus ${ModuleFocused}, &:hover ${ModuleFocused} {
    opacity: 1;
  }

  @media only screen and (max-width: ${desktopWidth}) {
    flex-direction: column;
    padding-left: 8px;
  }
`;
Assignment.displayName = "Assignment";

export const AssignmentInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  .module-checkbox {
    align-self: center;
  }
  & div,
  & span {
    align-items: center;
  }
  @media only screen and (max-width: ${tabletWidth}) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-items: center;
    margin-left: auto;
    align-items: flex-start;
  }
`;
AssignmentInnerWrapper.displayName = "AssignmentInnerWrapper";

export const ModuleWrapper = styled.div`
  cursor: pointer;
  & {
    padding-top: 0px;
    padding-bottom: ${props => (props.collapsed ? "0px" : "20px")};
    padding-left: 0px;
    padding-right: ${props => (props.padding ? "20px" : "0px")};
    border-bottom: 1px solid ${borderGrey4};
  }

  .module-checkbox {
    span {
      margin-right: 23px;
    }
  }
  .module-btn-assigned {
    background-color: ${themeColor};
    margin-left: auto;
    justify-self: flex-end;
  }
  .module-btn-expand-collapse {
    border: none;
    box-shadow: none;
  }
`;
