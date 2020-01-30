import { Pagination, Card, Col } from "antd";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import {
  mobileWidth,
  largeDesktopWidth,
  mediumDesktopWidth,
  tabletWidth,
  red,
  themeColor,
  lightGreen4,
  extraDesktopWidth,
  extraDesktopWidthMax,
  yellow1
} from "@edulastic/colors";
import { IconExclamationMark } from "@edulastic/icons";

import { themes } from "../../../../theme";

const classBoardTheme = themes.default.classboard;

export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin: 0px auto;
`;

export const ExclamationMark = styled(IconExclamationMark)`
  margin-right: 5px;
  width: 13px;
  height: 13px;
`;

export const StyledCardContiner = styled(FlexContainer)`
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
  position: relative;
`;

export const DisneyCard = styled.div``;

export const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
`;

export const MainDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const MainDivLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  .ant-card {
    margin-right: 4%;
  }
`;

export const PerfomanceSection = styled.div`
  width: 100%;
`;

export const StyledCard = styled(Card)`
  margin-top: 15px;
  margin-right: 15px;
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  cursor: ${props => (props.isClickEnable ? "pointer" : "default")};
  transition: all 0.2s ease-in;
  .ant-card-body {
    padding: 19px 22px;
  }
  &:hover {
    box-shadow: ${props => (props.isClickEnable ? "8px 4px 10px rgba(0,0,0,0.1)" : "0px 3px 10px rgba(0,0,0,0.1)")};
  }

  @media (min-width: ${mobileWidth}) and (max-width: 767px) {
    width: calc((100% - 15px) / 2);
    &:nth-child(2n) {
      margin-right: 0px;
    }
  }
  @media (min-width: ${tabletWidth}) and (max-width: 1199px) {
    width: calc((100% - 30px) / 3);
    &:nth-child(3n) {
      margin-right: 0px;
    }
  }
  @media (min-width: ${largeDesktopWidth}) and (max-width: 1599px) {
    width: calc((100% - 45px) / 4);
    &:nth-child(4n) {
      margin-right: 0px;
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    width: calc((100% - 60px) / 5);
    &:nth-child(5n) {
      margin-right: 0px;
    }
  }
`;

export const Space = styled.div`
  display: inline-block;
  height: 30px;
`;

export const PagInfo = styled.span`
  font-weight: 600;
  font-size: 11px;
  color: ${themeColor};
  text-overflow: ellipsis;
  /* width: 50%; */
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  user-select: none;

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 10px;
  }
  @media (max-width: ${mobileWidth}) {
    width: 100%;
    text-align: center;
  }
`;

export const GSpan = styled.span`
  font-size: 10px;
`;

export const PaginationInfoF = styled(StyledFlexContainer)`
  flex: 100%;
  align-items: center;
  margin-bottom: 28px;
`;

export const PaginationInfoS = styled(StyledFlexContainer)`
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
`;

export const PaginationInfoT = styled(StyledFlexContainer)`
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const CircularDiv = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #00ad50;
  cursor: ${props => (props.isLink ? "pointer" : "default")};
  font-weight: 600;
  line-height: 38px;
  background-color: ${lightGreen4};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;

  @media (min-width: ${extraDesktopWidth}) {
    margin-right: 18px;
  }
`;

export const StyledFlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-right: 0px;
`;

export const StyledName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// export const StyledCheckbox = styled(Checkbox)`
//   font-size: 0.7em;
//   color: ${classBoardTheme.headerCheckboxColor};
//   align-self: center;
//   margin-left: auto;
// `;

const SquareColorDiv = styled.div`
  display: inline-block;
  width: ${props => ((props.weight || 1) > 1 ? 2 * 23 + 1 : 23)}px;
  height: 8px;
  margin: 1px 2px 0px 0px;
`;

export const SquareColorDivGreen = styled(SquareColorDiv)`
  background-color: #5eb500;
`;

export const SquareColorDivGray = styled(SquareColorDiv)`
  background-color: rgb(106, 115, 127);
`;

export const SquareColorBlue = styled(SquareColorDiv)`
  background-color: rgb(56, 150, 190);
`;

export const SquareColorDisabled = styled(SquareColorDiv)`
  background-color: ${classBoardTheme.CardColor};
`;

export const SquareColorDivPink = styled(SquareColorDiv)`
  background-color: #f35f5f;
`;

export const SquareColorDivYellow = styled(SquareColorDiv)`
  background-color: ${yellow1};
`;

export const StyledParaF = styled.p`
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
  margin-bottom: 5px;
  cursor: ${props => (props.isLink && !props.disabled ? "pointer" : "default")};
  color: #434b5d;

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 12px;
    line-height: 12px;
  }
`;

export const StyledParaS = styled.p`
  font-size: 10px;
  line-height: 10px;
  font-weight: bold;
  color: ${({ color }) => color || classBoardTheme.CardCircularColor};
  text-transform: capitalize;
  cursor: ${props => (props.isLink ? "pointer" : "default")};
  display: flex;
  align-items: center;

  @media (max-width: ${mediumDesktopWidth}) {
    font-size: 11px;
  }
`;

export const StyledColorParaS = styled.p`
  font-size: 0.6em;
  font-weight: bold;
  color: ${red};
  text-transform: capitalize;
  display: flex;
  align-items: center;
`;

export const StyledParaFF = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #7c848e;
`;
export const ColorSpan = styled.span`
  color: ${classBoardTheme.CardCircularColor};
`;

export const StyledParaSS = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #434b5d;
  text-overflow: ellipsis;
  font-size: 16px;
`;

export const StyledParaSSS = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin-left: 18px;
  color: #5eb500;
  text-overflow: ellipsis;
  @media (max-width: ${mobileWidth}) {
    margin-left: 0px;
  }
`;

export const SpaceDiv = styled.div`
  display: inline-block;
  width: 20px;
`;

export const StyledDivLine = styled.div`
  width: 101%;
  height: 0.03em;
  border: 1px solid #f4f3f3;
  margin-top: 20px;
`;

export const RightAlignedCol = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
`;
