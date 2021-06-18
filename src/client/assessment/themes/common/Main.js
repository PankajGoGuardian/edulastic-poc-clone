import styled from 'styled-components'

const Main = styled.main`
  background-color: ${(props) =>
    props.theme.widgets.assessmentPlayers.mainBgColor};
  padding: ${({ skin, padding }) => {
    return skin ? `${padding || '20px 40px'}` : '110px 0 0 140px'
  }};
  display: ${(props) => (props.skin ? 'block' : 'flex')};
  flex-direction: ${(props) => (props.skin ? 'initial' : 'row')};
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  margin-top: ${({ headerHeight }) => headerHeight}px;
  height: ${({ headerHeight }) => `calc(100vh - ${headerHeight}px)`};
  & p {
    margin: 0;
  }
`

export default Main
