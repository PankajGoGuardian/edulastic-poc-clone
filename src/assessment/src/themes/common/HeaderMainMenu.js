import styled from 'styled-components';

const HeaderMainMenu = styled.div`
  width: ${props => (props.skin ? '1008px' : '1167px')};

  @media (max-width: 1600px) {
    width: ${props => (props.skin ? '1008px' : '100%')};
  }
  @media (max-width: 760px) {
    width: 100%;
  }
`;

export default HeaderMainMenu;
