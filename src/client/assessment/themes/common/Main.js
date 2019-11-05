import styled from "styled-components";

const Main = styled.main`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainBgColor};
  padding: ${({ zoomed, zoomLevel, skin }) => {
    if (!zoomed) {
      return skin ? "82px 20px 20px" : "110px 0 0 140px";
    }
    if (zoomed) {
      if (zoomLevel >= 1.5 && zoomLevel < 1.75) {
        return "100px 30px 20px";
      }
      if (zoomLevel >= 1.75 && zoomLevel < 2.5) {
        return "115px 35px 20px";
      }
      if (zoomLevel >= 2.5) {
        return "115px 35px 20px";
      }
      return "82px 20px 20px";
    }
  }};
  display: ${props => (props.skin ? "block" : "flex")};
  flex-direction: ${props => (props.skin ? "initial" : "row")};
  min-height: ${props => (props.skin ? "0" : "100vh")};
  box-sizing: border-box;
  position: relative;
  & p {
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 120px 26px 0;
  }
`;

export default Main;
