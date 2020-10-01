import styled from 'styled-components'

const ToolTipContainer = styled.div`
  zoom: ${({ theme }) => theme?.header?.navZoom};
  display: flex;
  align-items: center;
`

export default ToolTipContainer
