import styled, { css } from "styled-components";
import { Table, Slider, Select } from "antd";
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
  padding-bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
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
  height: calc(100vh - 190px);
  width: ${({ width }) => width};
  overflow: auto;

  .ant-progress-bg {
    border-radius: 0px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &:hover {
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
    }
  }
`;

const borderLoopEffect = css`
  background-image: linear-gradient(90deg, ${themeColor} 40%, transparent 60%),
    linear-gradient(90deg, ${themeColor} 40%, transparent 60%),
    linear-gradient(0deg, ${themeColor} 40%, transparent 60%), linear-gradient(0deg, ${themeColor} 40%, transparent 60%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
  background-position: left top, right bottom, left bottom, right top;
  @keyframes border-dance {
    0% {
      background-position: left top, right bottom, left bottom, right top;
    }
    100% {
      background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px;
    }
  }
`;

export const TableContainer = styled.div`
  padding: 20px 0px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: ${({ highlighted }) => !highlighted && `2px solid ${borderGrey}`};
  animation: ${({ highlighted }) => highlighted && `border-dance 1s infinite linear;`};
  ${({ highlighted }) => highlighted && borderLoopEffect};
`;

export const ActivityDropConainer = styled.div`
  display: inline-block;
  width: 100%;
  min-height: ${({ height }) => height || "50px"};
  margin: 10px 0;
  box-sizing: border-box;
  border-radius: 5px;
  padding-left: 15px;
  padding-right: 15px;
  line-height: ${({ height }) => height || "50px"};
  text-align: center;
  animation: ${({ active }) => active && `border-dance 1s infinite linear;`};
  ${borderLoopEffect};
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

export const StyledPerfectScrollbar = styled.div`
  width: ${({ width }) => width};
`;

export const StyledDescription = styled.div`
  width: 100%;
  cursor: ${({ clickable }) => clickable && "pointer"};
`;
