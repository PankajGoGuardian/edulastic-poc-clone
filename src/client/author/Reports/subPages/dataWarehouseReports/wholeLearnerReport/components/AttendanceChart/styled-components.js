import styled from 'styled-components'

export const StyledAttendanceChartContainer = styled.div`
  padding: 10px;
  position: relative;
  height: ${(props) => props.height};
  .navigator-left {
    left: -15px;
    top: 50%;
  }

  .navigator-right {
    right: 5px;
    top: 50%;
  }

  .recharts-wrapper .recharts-cartesian-grid-horizontal line:first-child,
  .recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child {
    stroke-opacity: ${(props) => props.strokeOpacity || 0};
  }

  .recharts-yAxis {
    .recharts-text {
      tspan {
        white-space: pre;
      }
    }
  }
  & .recharts-tooltip-wrapper {
    transform: var(--tooltip-transform) !important;
    top: var(--tooltip-top) !important;
    left: var(--tooltip-left) !important;
    visibility: visible !important;
    transition: all 400ms ease 0s;
  }
`
