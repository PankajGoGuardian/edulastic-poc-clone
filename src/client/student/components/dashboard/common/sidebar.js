import styled from 'styled-components';

const SidebarWrapper = styled.div`
  @media (min-width: 1200px) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 16.3rem;
    background-color: #fbfafc;
    box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.16);
  }
  @media (max-width: 1200px) {
    display: none;
  }
`;

export default SidebarWrapper;
