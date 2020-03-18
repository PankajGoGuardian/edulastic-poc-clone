import styled from "styled-components";
import { Table, Slider, Select } from "antd";
import PerfectScrollbar from "react-perfect-scrollbar";
import { FlexContainer } from "@edulastic/common";
import {
  smallDesktopWidth,
  borderGrey,
  themeColor,
  white,
  greyDarken,
  themeColorTagsBg,
  themeColorLighter,
  greyThemeDark2
} from "@edulastic/colors";

export const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${smallDesktopWidth}) {
    flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  }
`;

export const SubHeader = styled.div`
  padding: 20px 10px 0px 20px;
  width: 100%;
  display: flex;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin: 0px 20px;
      text-transform: uppercase;
      font-weight: 600;
      &:first-child {
        margin-left: 0px;
      }
    }
  }
`;

export const SideButtonContainer = styled.div`
  padding: 20px 20px 0px 10px;
  display: flex;
  align-items: center;
`;

export const BodyContainer = styled.div`
  padding: 20px 10px 0px 20px;
  .ant-progress-bg {
    border-radius: 0px;
  }
`;

export const TableContainer = styled.div`
  padding: 20px 0px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: ${props => (props.highlighted ? `2px dashed ${themeColor}` : `2px solid ${borderGrey}`)};
`;

export const TableHeader = styled.div`
  padding: 0px 20px 15px 20px;
  display: flex;
  align-items: center;
  > span {
    font-weight: 600;
    display: inline-block;
    &:first-child {
      width: 15%;
      font-weight: 700;
    }
    &:nth-child(2) {
      width: 40%;
      display: inline-flex;
      align-items: center;
      > span:first-child {
        color: ${greyThemeDark2};
        text-transform: uppercase;
        font-size: 11px;
      }
    }
    &:nth-child(3) {
      width: 20%;
      display: flex;
      align-items: center;
      > svg {
        fill: ${greyDarken};
      }
    }
    &:nth-child(4) {
      width: 25%;
      display: flex;
      justify-content: flex-end;
    }
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-content {
    .ant-table-body {
      .ant-table-thead {
        tr {
          th {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 600;
            padding: 5px 15px;
            background: ${white};
            border-bottom: 0px;
            color: ${greyThemeDark2};
          }
          .ant-table-selection-column {
            .ant-table-header-column {
              display: none;
            }
          }
        }
      }
      .ant-table-tbody {
        tr {
          td {
            padding: 10px 15px;
            font-weight: 600;
          }
        }
      }
    }
  }
`;

export const Tag = styled.span`
  color: ${themeColor};
  background: ${themeColorTagsBg};
  text-transform: uppercase;
  display: inline-block;
  font-size: 11px;
  border-radius: 4px;
  padding: 4px 10px;
  margin-right: ${({ marginRight }) => marginRight || "0px"};
  font-weight: 600;
`;

export const StyledSlider = styled(Slider)`
  width: 35%;
  height: 16px;
  margin: 0px 10px;
  > div {
    height: 10px;
  }
  .ant-slider-rail {
    background: ${borderGrey};
  }
  .ant-slider-handle {
    height: 16px;
    width: 16px;
    margin-top: -3px;
    border: solid 2px ${themeColorLighter};
  }
  .ant-slider-track {
    background: ${themeColorLighter};
  }
  &:hover {
    & .ant-slider-track {
      background: ${themeColorLighter};
    }
    & .ant-slider-handle:not(.ant-tooltip-open) {
      border-color: ${themeColorLighter};
    }
  }
`;

export const TableSelect = styled.div`
  position: absolute;
  left: 20px;
  > span {
    color: ${themeColor};
    cursor: pointer;
    &:first-child {
      margin-right: 20px;
    }
  }
`;

export const StyledSelect = styled(Select)`
  height: 35px;
  .ant-select-selection {
    border: 1px solid ${themeColor};
    .ant-select-selection__rendered {
      line-height: 33px;
      .ant-select-selection__placeholder {
        font-size: 12px;
      }
      .ant-select-selection-selected-value {
        color: ${themeColor};
      }
    }
  }
`;

export const StyledPerfectScrollbar = styled(PerfectScrollbar)`
  width: ${({ width }) => width};
  height: calc(100vh - 62px);
`;
