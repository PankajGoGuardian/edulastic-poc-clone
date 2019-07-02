import styled from "styled-components";

const MainWrapper = styled.section`
  width: ${props => (props.skin ? "100%" : "1080px")};
  background-color: ${props => props.theme.mainContentBgColor};
  color: ${props => props.theme.mainContentTextColor};
  min-height: 100vh;
  margin: auto;
  box-sizing: border-box;
  padding: ${props => (props.skin ? "40px 40px" : "100px 112px")};
  text-align: left;
  font-size: 18px;
  border-radius: ${props => (props.skin ? "4px" : "")};
  box-shadow: ${props => (props.skin ? "0 3px 10px 0 rgba(0,0,0,0.1)" : "")};

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

  @media (max-width: 1600px) {
    padding: ${props => (props.skin ? "40px 40px" : "60px 112px")};
  }

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 468px) {
    padding: 0px;
    border-radius: 10px;
  }
`;

export default MainWrapper;
