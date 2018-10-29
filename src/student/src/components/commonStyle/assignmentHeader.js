import styled from 'styled-components';

const AssignmentsHeader = styled.div`
  @media (min-width: 1200px) {
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: ${props => (props.flag ? '7rem' : '16.3rem')};
    right: 0;
    align-items: center;
    padding: 1.15rem 1.5rem;
    background-color: blue;
  }
  @media (max-width: 1060px) {
    display: flex;
    justify-content: space-between;
    background: blue;
    padding: 1rem 2rem;
    align-items: center;
  }
  @media (max-width: 480px) {
    margin: 0rem;
    padding: 1rem 1rem;
  }
`;

export default AssignmentsHeader;
