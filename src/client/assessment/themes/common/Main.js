import styled from "styled-components";

const Main = styled.main`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainBgColor};
  padding: ${({ zoomed, zoomLevel, skin }) => {
    if (!zoomed) {
      return skin ? "20px 40px" : "110px 0 0 140px";
    }
    if (zoomed) {
      if (zoomLevel >= 1.5 && zoomLevel < 1.75) {
        return "30px 50px 20px";
      }
      if (zoomLevel >= 1.75 && zoomLevel < 2.5) {
        return "35px 50px 20px";
      }
      if (zoomLevel >= 2.5) {
        return "35px 50px 20px";
      }
      return "20px 40px";
    }
  }};
  display: ${props => (props.skin ? "block" : "flex")};
  flex-direction: ${props => (props.skin ? "initial" : "row")};
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  margin-top: ${({ headerHeight }) => headerHeight}px;
  height: ${({ headerHeight }) => `calc(100vh - ${headerHeight}px)`};
  & p {
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 120px 26px 0;
  }
`;

export default Main;
