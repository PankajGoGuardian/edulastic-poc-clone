import styled from 'styled-components'

const Circle = styled.div`
  width: ${(props) => props.r * 2}px;
  height: ${(props) => props.r * 2}px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.active
      ? props.theme.widgets.assessmentPlayers.sidebarActiveCircleColor
      : 'transparent'};
  border: solid 1px
    ${(props) => props.theme.widgets.assessmentPlayers.sidebarActiveCircleColor};
  border-color: ${(props) =>
    props.hide
      ? 'transparent'
      : props.theme.widgets.assessmentPlayers.sidebarActiveCircleColor};
  box-sizing: border-box;
`

export default Circle
