import styled from "styled-components";
import { Progress as AntProgress } from "antd";
import { FlexContainer, LegendContainer, EduButton } from "@edulastic/common";
import { white, mobileWidth, mobileWidthLarge, mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";
import { CustomTooltip } from "./CustomTooltip";

export const GraphContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 20px;
  border-bottom: 1px solid #dadae4;

  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: column;
  }
`;

export const ProgressBarContainer = styled.div`
  /* width: 200px; */

  @media (max-width: ${mobileWidthLarge}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

export const BarGraphContainer = styled.div`
  width: 100%;
  @media (max-width: ${mobileWidthLarge}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

export const GraphTitle = styled.div`
  text-align: center;
  width: 100%;
  overflow: hidden;
  margin-bottom: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.textColor};
  font-weight: ${({ theme }) => theme.bold};
`;

export const Progress = styled(AntProgress)`
  /* margin: ${props => props.margin || "0 30px 15px 30px"}; */
  .ant-progress-text {
    color: ${props => props.textColor || "#434b5d"};
    font-size: ${props => props.textSize || "#35px"};
    margin-top: -7px !important;
    font-weight: bold;
  }
`;

export const BarGraphWrapper = styled.div`
  width: 100%;
  position: relative;
  padding-left: 25px;
  padding-right: 35px;

  .navigator {
    z-index: 10;
  }

  .navigator-left {
    left: 0px;
    top: 35%;
  }

  .navigator-right {
    right: 0px;
    top: 35%;
  }

  .highcharts-credits {
    display: none;
  }
  .highcharts-title {
    display: none;
  }

  .xAxis {
    font-weight: 600;
  }
  @media (max-width: ${mobileWidth}) {
    margin-top: 25px;
  }

  .recharts-rectangle {
    cursor: pointer;
  }

  font-size: 12px;
`;

export const BarLegendContainer = styled(LegendContainer)`
  margin-bottom: -18px;
  padding-left: 80px;
`;

export const StyledCustomTooltip = styled(CustomTooltip)`
  padding: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  font-size: ${props => props.theme.commentFontSize};
  white-space: pre;
  background-color: ${white};
  border-radius: 10px;

  .classboard-tooltip-title {
    font-weight: 900;
    font-size: ${props => props.theme.smallFontSize};
  }
  .classboard-tooltip-value {
    font-weight: 900;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
    .classboard-tooltip-title {
      font-size: ${props => props.theme.standardFont};
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${props => props.theme.standardFont};
    .classboard-tooltip-title {
      font-size: ${props => props.theme.titleSectionFontSize};
    }
  }
`;

export const ChartNavButton = styled(EduButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  width: 32px;
  border-radius: 50%;
  z-index: 1;
  display: ${({ show }) => (show ? "block" : "none")};
  .ant-btn > .anticon {
    line-height: 0.8;
  }

  @media print {
    display: none;
  }
`;
