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
  flex-direction: column;
  margin: auto;
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

  ${({ hasCollapseButtons, theme }) => {
    return `
      background-color: ${
        hasCollapseButtons
          ? 'transparent'
          : theme.widgets.assessmentPlayers.mainContentBgColor
      };
      color: ${theme.widgets.assessmentPlayers.mainContentTextColor};
      box-shadow: ${
        hasCollapseButtons ? 'none' : '0 3px 10px 0 rgba(0, 0, 0, 0.1)'
      };
    `
  }}
`

export default MainWrapper
