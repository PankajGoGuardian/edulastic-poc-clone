import styled from "styled-components";

const MainContainer = styled.div`
   {
    width: 100%;
    background-color: ${props => props.theme.sectionBackgroundColor};
    @media (min-width: 1200px) {
      display: flex;
      flex-direction: column;
    }
  }
`;

export default MainContainer;
