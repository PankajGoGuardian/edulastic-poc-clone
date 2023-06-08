import styled from 'styled-components'

const MainWrapper = styled.section`
  box-sizing: border-box;
  padding: 0px;
  text-align: left;
  border-radius: 4px;
  max-width: 100%;
  overflow: ${({ hasCollapseButtons }) =>
    hasCollapseButtons ? 'hidden' : 'auto'};
  display: flex;
  flex-direction: ${({ isStudentAttempt }) =>
    isStudentAttempt ? 'row' : 'column'};
  height: 100%;
  width: 100%;
  & * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  & input {
    user-select: text;
  }

  @media (max-width: 468px) {
    border-radius: 10px;
  }

  ${({ theme }) => {
    return `
      background-color: ${theme.widgets.assessmentPlayers.mainContentBgColor};
      color: ${theme.widgets.assessmentPlayers.mainContentTextColor};
    `
  }}
`

export default MainWrapper
