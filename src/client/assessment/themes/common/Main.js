import styled from "styled-components";

const Main = styled.main`
  background-color: ${props => props.theme.widgets.assessmentPlayers.mainBgColor};
  padding: ${props => (props.skin ? "82px 20px 20px" : "110px 0 0 140px")};
  display: ${props => (props.skin ? "block" : "flex")};
  flex-direction: ${props => (props.skin ? "initial" : "row")};
  min-height: ${props => (props.skin ? "0" : "100vh")};
  box-sizing: border-box;

  & p {
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 174px 26px 0;
  }
`;

export default Main;
