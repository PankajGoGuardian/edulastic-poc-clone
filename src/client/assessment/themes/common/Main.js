import styled from "styled-components";
// import { ifZoomed } from "../../../common/utils/helpers";

const Main = styled.main`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainBgColor};
  padding: ${({ theme, skin }) => {
    // if (ifZoomed(theme?.zoomLevel)) {
    //   return skin ? `130px 20px 20px` : "158px 0 0 140px";
    // }

    return skin ? "82px 20px 20px" : "110px 0 0 140px";
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
    padding: 174px 26px 0;
  }
`;

export default Main;
