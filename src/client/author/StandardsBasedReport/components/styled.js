import styled from "styled-components";
import { Table, Card, Progress } from "antd";

import {
  white,
  cardTitleColor,
  linkColor1,
  lightGrey3,
  lightBlue3,
  lightBlue4,
  lightGreen1,
  dashBorderColor,
  secondaryTextColor,
  lightGreySecondary,
  greenThird,
  smallDesktopWidth,
  mobileWidth,
  mobileWidthMax,
  extraDesktopWidth
} from "@edulastic/colors";
import { Link } from "react-router-dom";
import { FlexContainer } from "@edulastic/common";
import HeaderWrapper from "../../src/mainContent/headerWrapper";

export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 20px;
`;

export const MoblieFlexContainer = styled(FlexContainer)`
  width: 100%;
  display: flex;
  overflow: auto;
  flex-wrap: ${({ flexWrap }) => (flexWrap ? "wrap" : "nowrap")};
  justify-content: ${({ justify }) => justify || "flex-start"};
  margin-bottom: 10px;
  margin-right: 0px;
`;

export const MoblieSubFlexContainer = styled(MoblieFlexContainer)`
  justify-content: space-around;
  margin-bottom: 15px;
  label {
    text-transform: uppercase;
    color: ${cardTitleColor};
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  img {
    transform: rotate(-270deg);
  }
`;

export const StyledCard = styled(Card)`
  width: 100%;
  border: ${props => (props.noBorder ? "none" : "1px solid #E9E9E9")};
  border-radius: 10px;
  .ant-card-body {
    padding: 0px;
  }

  @media (max-width: ${mobileWidthMax}) {
    margin-right: 5px;
    .ant-card-body {
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

export const ReportTitle = styled.div`
  font-family: Open Sans, Bold;
  font-size: 18px;
  color: ${secondaryTextColor};
  font-weight: 800;
  margin-bottom: 5px;
  text-transform: capitalize;
`;

export const DetailCard = styled(StyledCard)`
  width: 48%;
  margin-left: 10px;
  margin-bottom: 10px;
  .ant-card-body {
    padding: 0px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: 38%;
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
    margin-top: 10px;
    margin-left: 0px;
  }
`;

export const DetailCardHeader = styled.div`
  background-color: ${lightGreySecondary};
  padding: 30px 24px;
  border-radius: 10px 10px 0px 0px;
  @media (max-width: ${mobileWidthMax}) {
    padding: 30px 15px 25px 15px;
    width: 100%;
  }
`;
export const DetailCardTitle = styled.div`
  color: ${secondaryTextColor};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .anticon-close {
    cursor: pointer;
  }
`;
export const DetailCardSubTitle = styled.div`
  color: ${secondaryTextColor};
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 10px;
`;
export const DetailCardDesc = styled.div`
  color: ${linkColor1};
  font-size: 13px;
`;

export const StudnetCell = styled.div`
  color: ${secondaryTextColor};
  font-size: 14px;
  font-weight: 600;
  @media (max-width: ${smallDesktopWidth}) {
    max-width: 60px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const MasteryCell = styled.div`
  text-align: center;
  i {
    margin-left: 15px;
  }
`;

export const PerformanceScore = styled.span`
  color: ${greenThird};
  font-size: 14px;
  font-weight: 600;
`;
export const PerformancePercent = styled.span`
  color: ${secondaryTextColor};
  font-size: 14px;
  font-weight: 600;
  padding-left: 10px;
`;

export const Container = styled(HeaderWrapper)`
  display: flex;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.header.headerBgColor};
  padding: 0px 15px;
  height: 62px;
  z-index: 1;
`;

export const StyledTitle = styled.h1`
  color: ${white};
  font-size: 22px;
  font-weight: bold;
  margin: 20px;
  padding: 0;
`;

export const StyledLink = styled(Link)`
  color: white;
  :hover {
    color: white;
  }
`;

export const StyledLinkActive = styled(Link)`
  color: black;
  :hover {
    color: black;
  }
`;

export const StyledParaFirst = styled.p`
  font-size: 0.9em;
`;

export const SpaceD = styled.div`
  display: inline-block;
  width: 10px;
`;

export const StyledParaSecond = styled.p`
  font-size: 0.5em;
`;

export const StyledDiv = styled.div`
  margin-right: 20px;
`;

export const StyledTabs = styled.div`
  width: 37%;
  height: 62px;
  display: flex;
`;

export const StyledAnchorA = styled.a`
  display: inline-block;
  font-size: 0.8em;
  font-weight: 600;
  color: white;
  padding: 3px 12px 15px 12px;
  width: 100%;
  text-align: center;
  background: ${lightGrey3};
  margin: 6px 0;
  border-radius: 25px;
  margin-right: 15px;
`;

export const StyledAnchor = styled.a`
  display: inline-block;
  font-size: 0.8em;
  font-weight: 600;
  color: white;
  padding: 19px 12px;
  width: 100%;
  text-align: center;
  background: ${lightBlue3};
  margin: 6px 0;
  border-radius: 25px;
  margin-right: 15px;
  white-space: nowrap;
  :hover {
    color: white;
  }
  @media (max-width: 1450px) {
    font-size: 0.6em;
  }
`;

export const MoreButton = styled.button`
  background: transparent;
  border: 1px solid ${lightBlue4};
  color: white;
  border-radius: 5px;
  height: 30px;
  padding: 0 10px;
  min-width: 100px;
`;

export const DetailTable = styled(Table)`
  padding: 24px 16px;
  .ant-table-thead > tr > th {
    background: white;
    border: none;
    padding: 10px 8px;
    &.ant-table-column-has-actions.ant-table-column-has-sorters:hover,
    & .ant-table-header-column .ant-table-column-sorters:hover::before {
      background: white;
    }
    .ant-table-column-sorters {
      text-transform: uppercase;
      color: ${cardTitleColor};
      font-size: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      .ant-table-column-sorter {
        position: relative;
        top: -2px;
        left: 5px;
        .ant-table-column-sorter-inner {
          .ant-table-column-sorter-up,
          .ant-table-column-sorter-down {
            font-size: 10px;
          }
        }
        @media (max-width: ${smallDesktopWidth}) {
          left: 0px;
        }
      }
    }
  }
  .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-sorters {
    @media (max-width: ${mobileWidth}) {
      padding-right: 15px !important;
      background-color: white;
    }
    @media (max-width: ${smallDesktopWidth}) {
      padding: 8px 5px;
    }
  }
  .ant-table-tbody {
    text-align: left;
    & > tr {
      & > td {
        background: ${white};
        padding: 10px 8px;
        border-color: #e9e9e9;
        & > div {
          width: 100%;
          text-align: center;
          margin: 0px auto;
        }
        &.summary-student-column {
          & > div {
            text-align: left;
          }
        }
      }
      &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
        background: #f2f3f2;
      }
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    padding: 0px;
    width: 100%;
  }
  i.anticon.anticon-caret-up,
  i.anticon.anticon-caret-down {
    display: none;
  }
  @media (max-width: ${smallDesktopWidth}) {
    padding: 12px;
  }
`;

export const TableData = styled(Table)`
  width: 100%;
  text-align: center;
  .ant-table-thead {
    & > tr {
      & > th {
        padding: 10px;
        border: none;
        background-color: ${white};
        &:first-child.ant-table-column-has-actions.ant-table-column-has-sorters {
          text-align: left;
        }
        &.ant-table-column-has-actions.ant-table-column-has-sorters,
        &.ant-table-column-has-actions.ant-table-column-has-filters {
          text-align: center;
          &:hover {
            background-color: ${white};
          }
        }
        &.performance-column,
        &.mastery-column {
          width: 200px;
        }
        &.standard-column {
          width: 110px;
        }
        &.arrowIcon-column {
          width: 50px;
        }
        .ant-table-header-column {
          .ant-table-column-sorters {
            text-transform: uppercase;
            color: ${cardTitleColor};
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover::before {
              background-color: ${white};
            }
            .ant-table-column-sorter {
              position: relative;
              top: -2px;
              left: 5px;
              .ant-table-column-sorter-inner {
                .ant-table-column-sorter-up,
                .ant-table-column-sorter-down {
                  font-size: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
  .ant-table-tbody {
    text-align: center;
    & > tr {
      & > td {
        background: ${white};
        padding: 10px 8px;
        border-color: #e9e9e9;
        & > div {
          width: 100%;
          text-align: center;
          margin: 0px auto;
        }
      }
      &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
        background: #f2f3f2;
      }
    }
  }

  @media (max-width: 920px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 10px 0px;
    }
    .ant-table-thead > tr > th .ant-table-column-sorters {
      padding-left: 2px;
      padding-right: 0px;
    }
  }
  @media (max-width: 1000px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding-left: 2px;
    }
    .ant-table-thead > tr > th .ant-table-column-sorters {
      padding-left: 2px;
    }
  }
  @media (max-width: 1300px) and (min-width: 980px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      max-width: 150px;
    }
    .ant-table-thead > tr > th .ant-table-column-sorters {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  @media (max-width: 1170px) {
    .ant-table-thead > tr > th {
      font-size: 10px;
    }
    .ant-table-tbody > tr > td {
      font-size: 9px;
    }
  }
  @media (max-width: 1170px) {
    .ant-table-thead > tr > th {
      font-size: 9px;
    }
    .ant-table-tbody > tr > td {
      font-size: 9px;
    }
  }
`;

export const DivWrapper = styled(StyledFlexContainer)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  @media (max-width: ${smallDesktopWidth}) {
    overflow: auto;
  }
`;

export const StandardCell = styled.div`
  border-radius: 5px;
  border: 1px rgba(74, 172, 139, 0.2) solid;
  background-color: rgba(74, 172, 139, 0.2);
  color: rgba(74, 172, 139, 1);
  padding: 3px 0px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const StandardsMobile = styled.div`
  width: 150px;
  height: 30px;
  background-color: ${lightGreen1};
  border-radius: 5px;
  color: white;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

export const QuestionCell = styled.div`
  color: ${greenThird};
  font-size: 14px;
  font-weight: 600;
`;

export const MasterySummary = styled(Progress)`
  .ant-progress-inner {
    background-color: ${dashBorderColor};
    border-radius: 4px;
    height: 16px;
    .ant-progress-bg {
      height: 16px !important;
      border-radius: 4px 0px 0px 4px !important;
      background-color: ${props => props.color};
    }
  }
  .ant-progress-outer {
    width: calc(100% - 30px);
    @media (max-width: ${mobileWidth}) {
      width: 100%;
    }
  }
  .ant-progress-text {
    color: ${secondaryTextColor};
    font-weight: 600;
    font-size: 14px;
    margin-left: 30px;
  }
`;

export const MasterySummaryInfo = styled.div`
  margin-top: 15px;
  color: ${secondaryTextColor};
`;

export const PerformanceSummary = styled.div`
  color: ${secondaryTextColor};
  font-weight: 600;
  font-size: 14px;
`;

export const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
