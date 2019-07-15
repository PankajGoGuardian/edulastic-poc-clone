import styled from "styled-components";

import { IconEdit } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";
import { mobileWidth, white, themeColor, tabGrey } from "@edulastic/colors";

export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 0px;
  @media (max-width: ${mobileWidth}) {
    flex: none;
    overflow: auto;
  }
`;

export const StudentButtonDiv = styled.div`
  margin-right: 20px !important;
  .ant-btn-primary {
    background-color: #0e93dc;
  }
  @media (max-width: ${mobileWidth}) {
    display: flex;
    flex: none;
  }
`;

const StyledStudentTabButton = styled.a`
  height: 28px;
  padding: 6px 20px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 0px;
  margin-right: 2px;
  background-color: ${({ active }) => (active ? "rgba(255, 255, 255, .30)" : white)};
  color: ${({ active }) => (active ? themeColor : tabGrey)};
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    color: ${themeColor};
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
  text-transform: uppercase;
  @media (max-width: ${mobileWidth}) {
    padding: 20px 20px;
    min-width: 175px;
    justify-content: center;
  }
`;

export const EditIconStyled = styled(IconEdit)`
  fill: ${white};
  margin-left: 15px;
  &:hover {
    fill: ${white};
  }
`;
