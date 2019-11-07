import styled from "styled-components";

const MainWrapper = styled.section`
  width: ${props => props.responsiveWidth}px;
  background-color: ${props =>
    props.hasCollapseButtons ? "transparent" : props.theme.widgets.assessmentPlayers.mainContentBgColor};
  color: ${props => props.theme.widgets.assessmentPlayers.mainContentTextColor};
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0px;
  text-align: left;
  border-radius: 4px;
  box-shadow: ${props => (props.hasCollapseButtons ? "none" : "0 3px 10px 0 rgba(0, 0, 0, 0.1)")};
  max-width: 100%;
  transform: ${({ zoomLevel }) => zoomLevel && `scale(${zoomLevel})`};
  transform-origin: top left;

  @media (max-width: 1100px) {
    width: 100%;
  }

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
`;

export default MainWrapper;
