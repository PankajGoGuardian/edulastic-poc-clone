import { grey, greyLight1, white, darkGrey4 } from '@edulastic/colors'
import { Row } from 'antd'
import styled from 'styled-components'
import { StyledTable } from '../../../multipleAssessmentReport/PreVsPost/common/styledComponents'

export const LegendWrapper = styled.div`
  display: flex;
  white-space: nowrap;
  width: fit-content;
`
export const StyledLegendItem = styled.span`
  display: flex;
  margin: 0px 20px;
  max-width: 150px;
  & > span {
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
export const TestTypeTag = styled.span`
  background-color: ${grey};
  width: 40px;
  padding: 2px 5px;
  text-align: center;
  border-radius: 5px;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 10px;
`
export const PerformanceMatrixContainer = styled(Row)`
  padding-block: 5px;
  .section-test {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    font-size: 13px;
    .test-name {
      padding: 4px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    @media print {
      .test-name {
        overflow: hidden !important;
      }
    }
    .test-tag {
      display: block;
      width: fit-content;
      height: fit-content;
      padding: 2px 8px;
      font-weight: bold;
      border-radius: 6px;
    }
  }
  .post-test {
    width: 250px;
    margin-block: 10px;
    margin-left: 40px;
    .test-name {
      width: 100%;
    }
  }
  .pre-test {
    height: 250px;
    position: absolute;
    writing-mode: vertical-rl;
    transform: translate(calc(-100% - 10px), -50%) scale(-1, -1);
    top: 50%;
    .test-tag {
      padding: 8px 2px;
    }
    .test-name {
      height: 100%;
    }
  }
  .section-matrix-grid {
    display: grid;
    grid: ${({ matrixRowSize, matrixColumnSize }) =>
      `50px repeat(${matrixRowSize}, 80px) / 50px repeat(${matrixColumnSize}, 80px)`};
    width: fit-content;
    gaps: 1px;

    .section-matrix-row,
    .section-matrix-col {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 0px;
      .section-matrix-row-bar,
      .section-matrix-col-bar {
        min-width: 6px;
        min-height: 6px;
        border-radius: 5px;
        width: 6px;
        height: 54px;
      }
      .section-matrix-row-text,
      .section-matrix-col-text {
        white-space: nowrap;
        font-size: 13px;
        font-weight: bold;
      }
    }
    .section-matrix-col {
      transform: translateY(-10px);
      flex-direction: column;
      .section-matrix-col-bar {
        width: 54px;
        height: 6px;
      }
    }
    .section-matrix-row-text {
      position: absolute;
      right: calc(100% - 25px);
    }
    .section-matrix-row-bar {
      position: absolute;
      left: 35px;
    }

    .section-matrix-cell {
      place-items: center;
      place-content: center;
      aspect-ratio: 1/1;
      display: flex;
      outline: 1px solid ${greyLight1};
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 0.15px;
      color: #000000;
      cursor: pointer;
    }
    .section-matrix-cell.active {
      color: ${white};
      background-color: ${darkGrey4};
    }
    .section-matrix-cell.top.left {
      border-radius: 18px 0 0 0;
    }
    .section-matrix-cell.top.right {
      border-radius: 0 18px 0 0;
      border: 2px solid;
      border-color: ${({ isSamePerformanceBand }) =>
        isSamePerformanceBand
          ? 'transparent'
          : 'green green transparent transparent'};
    }
    .section-matrix-cell.bottom.right {
      border-radius: 0 0 18px 0;
    }
    .section-matrix-cell.bottom.left {
      border-radius: 0 0 0 18px;
      border: 2px solid;
      border-color: ${({ isSamePerformanceBand }) =>
        isSamePerformanceBand
          ? 'transparent'
          : 'transparent transparent red red'};
    }
  }
  .section-matrix-display-toggle {
    position: absolute;
    padding: 20px 30px;
    top: 50%;
    right: -50px;
    transform: translate(100%, -50%);
    border-radius: 15px;
    border: 2px solid ${grey};
    color: ${grey};
    .ant-radio-group-outline {
      width: 160px;
      .ant-radio-wrapper {
        padding: 5px 0;
      }
    }
  }
`

export const GridContainer = styled.div`
  display: grid;
  grid: auto-flow / 1fr auto;
  text-align: left;
  & > *:nth-child(even) {
    text-align: right;
  }
`
export const CustomStyledTable = styled(StyledTable)`
  .ant-table-thead .dimension .ant-table-column-sorters {
    margin-left: 10px;
  }
  .ant-table-tbody .dimension-name {
    margin-left: 10px;
  }
`
