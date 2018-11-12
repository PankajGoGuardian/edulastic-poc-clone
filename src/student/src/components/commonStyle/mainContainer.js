import styled from 'styled-components';

const MainContainer = styled.div`
   {
    width: 100%;
    @media (min-width: 1200px) {
      display: flex;
      flex-direction: column;
      padding-left: 4.6rem;
      padding-right: 4.6rem;
    }
    @media (min-width: 1200px) {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
`;

export default MainContainer;
