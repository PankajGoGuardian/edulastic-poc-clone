import styled from "styled-components";

const MainWrapper = styled.section`
  box-sizing: border-box;
  padding: 0px;
  text-align: left;
  border-radius: 4px;
  max-width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;

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

  ${({ zoomLevel, responsiveWidth, hasCollapseButtons, theme }) => {
    const zoomed = zoomLevel > "1" && zoomLevel !== undefined;

    return `
      width: ${zoomed ? `${responsiveWidth}px` : "100%"};
      transform: ${zoomed ? `scale(${zoomLevel})` : ""};
      transform-origin: ${zoomed ? `top left` : ""};
      margin: ${!zoomed ? "auto" : ""};
      background-color: ${hasCollapseButtons ? "transparent" : theme.widgets.assessmentPlayers.mainContentBgColor};
      color: ${theme.widgets.assessmentPlayers.mainContentTextColor};
      box-shadow: ${hasCollapseButtons ? "none" : "0 3px 10px 0 rgba(0, 0, 0, 0.1)"};

      @media (max-width: 1100px) {
        width: ${zoomed ? "95%" : ""};
      }
    `;
  }}
`;

export default MainWrapper;
