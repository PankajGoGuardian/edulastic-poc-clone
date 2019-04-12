import styled from "styled-components";
import { Card } from "antd";
import { mobileWidth } from "@edulastic/colors";

export const MainDiv = styled.div`
  width: 100%;
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
`;

export const TooltipContainer = styled(Card)`
  .ant-card-head {
    min-height: 40px;
    padding: 0px 16px;
    .ant-card-head-wrapper {
      padding-top: 5px;
    }
    .ant-card-head-title {
      padding: 8px 0px;
      font-weight: 600;
    }
  }
  .ant-card-body {
    padding: 15px 16px !important;
  }
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
`;
