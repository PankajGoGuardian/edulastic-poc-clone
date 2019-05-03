import styled from "styled-components";
import { Card } from "antd";
import { white, mobileWidth } from "@edulastic/colors";

import { CustomTooltip } from "./CustomTooltip";

export const MainDiv = styled.div`
  width: 100%;
  position: relative;

  .navigator {
    z-index: 1000;
  }

  .navigator-left {
    left: -12px;
    top: 37%;
  }

  .navigator-right {
    right: -12px;
    top: 37%;
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
`;

export const StyledCustomTooltip = styled(CustomTooltip)`
  padding: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  font-size: 12px
  white-space: pre;
  background-color: ${white};
  border-radius: 10px;

  .classboard-tooltip-title {
    font-weight: 900;
    font-size: 14px;
  }

  .classboard-tooltip-key{

  }

  .classboard-tooltip-value{
    font-weight: 900;
  }
`;

export const TooltipContainer = styled(Card)``;
