import styled from 'styled-components'
import { Card } from 'antd'
import {
  white,
  mobileWidth,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
} from '@edulastic/colors'

import { CustomTooltip } from './CustomTooltip'

export const MainDiv = styled.div`
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
`

export const StyledCustomTooltip = styled(CustomTooltip)`
  padding: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  font-size: ${(props) => props.theme.commentFontSize};
  white-space: pre;
  background-color: ${white};
  border-radius: 10px;

  .classboard-tooltip-title {
    font-weight: 900;
    font-size: ${(props) => props.theme.smallFontSize};
  }
  .classboard-tooltip-value {
    font-weight: 900;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${(props) => props.theme.smallFontSize};
    .classboard-tooltip-title {
      font-size: ${(props) => props.theme.standardFont};
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${(props) => props.theme.standardFont};
    .classboard-tooltip-title {
      font-size: ${(props) => props.theme.titleSectionFontSize};
    }
  }
`

export const TooltipContainer = styled(Card)``

export const OnScreenNotification = styled.h3`
  display: flex;
  height: 100%;
  padding: 0 10%;
  text-align: center;
  align-items: center;
  justify-content: center;
`
