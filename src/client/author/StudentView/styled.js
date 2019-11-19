import styled, { css } from "styled-components";

import { IconEdit } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";
import { mobileWidthMax, mediumDesktopWidth, white, themeColor, tabGrey, desktopWidth } from "@edulastic/colors";

const FixedHeaderStyle = css`
  width: auto;
  position: fixed;
  top: 0;
  right: 30px;
  background: #fff;
  z-index: 999;
  left: 130px;
  box-shadow: 1px 8px 11px rgba(0, 0, 0, 0.2);
  padding: 5px;
`;

export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 0px;
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
  ${props => props.hasStickyHeader && FixedHeaderStyle}
`;

export const StudentButtonWrapper = styled(FlexContainer)`
  width: calc(75% - 15px);
  justify-content: space-between;
  margin-bottom: 0px;

  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`;

export const StudentButtonDiv = styled.div`
  display: flex;
  .ant-btn-primary {
    background-color: #0e93dc;
  }

  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
    padding-bottom: 10px;
    margin-right: 0px;
    overflow: auto;
  }
`;

export const StyledStudentTabButton = styled.a`
  height: 28px;
  padding: 6px 20px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 0px;
  margin-right: 2px;
  user-select: none;
  background-color: ${({ active }) => (active ? "rgba(255, 255, 255, .30)" : white)};
  color: ${({ active }) => (active ? themeColor : tabGrey)};
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    color: ${themeColor};
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 30px;
    padding: 8px 12px;
    font-size: 10px;
  }
  @media (max-width: ${desktopWidth}) {
    padding: 8px 5px;
    height: auto;
  }
  @media (max-width: ${mobileWidthMax}) {
    flex-basis: 100%;
    white-space: nowrap;
    text-align: center;
    padding: 6px 15px;
  }
`;

export const AllButton = styled(StyledStudentTabButton)`
  border-radius: 4px 0px 0px 4px;
`;

export const CorrectButton = styled(StyledStudentTabButton)``;

export const WrongButton = styled(StyledStudentTabButton)``;

export const PartiallyCorrectButton = styled(StyledStudentTabButton)`
  border-radius: 0px 4px 4px 0px;
  margin-right: 0px;
`;

const StyledTabButton = styled.a`
  height: 28px;
  padding: 6px 25px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? themeColor : white)};
  color: ${({ active }) => (active ? white : themeColor)};
  &:hover {
    background-color: ${themeColor};
    color: ${white};
  }
`;

export const GiveOverallFeedBackButton = styled(StyledTabButton)`
  border-radius: 4px;
  display: flex;
  padding: 20px 10px;
  align-items: center;
  min-width: 300px;
  justify-content: center;
  font-size: 11px;
  position: relative;
  svg {
    position: absolute;
    left: 10px;
    width: 40px;
    height: 20px;
  }

  @media (max-width: ${mediumDesktopWidth}) {
    min-width: 250px;
    padding: 15px 10px;
  }
  @media (max-width: ${desktopWidth}) {
    min-width: auto;
    justify-content: center;
    svg {
      display: none;
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    min-width: 100%;
    svg {
      display: block;
    }
  }
`;

export const EditIconStyled = styled(IconEdit)`
  fill: ${white};
  margin-left: 15px;
  &:hover {
    fill: ${white};
  }
`;
