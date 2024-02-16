import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'

export const StyledSignedStackedBarChartContainer = styled.div`
  padding: 10px;
  position: relative;
  z-index: 2;

  .navigator-left {
    left: 5px;
    top: 50%;
  }

  .navigator-right {
    right: 5px;
    top: 50%;
  }

  .recharts-wrapper .recharts-cartesian-grid-horizontal line:first-child,
  .recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child {
    stroke-opacity: 0;
  }

  .recharts-yAxis {
    .recharts-text {
      tspan {
        white-space: pre;
      }
    }
  }
  & .recharts-wrapper > .recharts-tooltip-wrapper {
    transform: var(--first-tooltip-transform) !important;
    top: var(--first-tooltip-top) !important;
    left: var(--first-tooltip-left) !important;
    visibility: visible !important;
    transition: all 400ms ease 0s;
    z-index: 1;
  }
  & > .recharts-tooltip-wrapper {
    transform: var(--second-tooltip-transform) !important;
    top: var(--second-tooltip-top) !important;
    left: var(--second-tooltip-left) !important;
    visibility: visible !important;
    transition: all 400ms ease 0s;
    z-index: 1;
  }
`

export const CustomXAxisTickTooltipContainer = styled.div`
  pointer-events: none;
  visibility: ${(props) => props.visibility};
  position: absolute;
  top: 0px;
  transform: translate(${(props) => props.x}, ${(props) => props.y});
  padding: 5px;
  min-width: ${(props) => props.width}px;
  max-width: 250px;
  overflow-wrap: anywhere;
  text-align: ${(p) => p.$textAlign || 'center'};
  background: white;
  z-index: 999;
  background-color: #f0f0f0;
  color: black;
  border: solid 0.5px #bebebe;
  box-shadow: 0 0 8px #c0c0c0;
`

export const ChartPreLabelWrapper = styled.div`
  translate: ${(p) => p.$translate || '0 100%'};
  position: relative;
  z-index: 1;
`

export const ChartLegendPill = styled.div`
  width: 20px;
  height: 8px;
  border-radius: 10px;
  background: ${({ color }) => color};
  margin-right: 10px;
`

export const ChartLegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  margin-top: 20px;
  font-weight: bold;
`
export const InterventionTooltipContainer = styled(FlexContainer)`
  text-align: start;
`
