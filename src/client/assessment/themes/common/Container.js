import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: ${(props) => (props.scratchPadMode ? 'relative' : '')};
`

export default Container
