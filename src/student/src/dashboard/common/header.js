import styled from 'styled-components';

const AssignmentsHeader = styled.div`
  @media (min-width: 1200px) {
    position: fixed;
    top: 0;
    left: 16.3rem;
    right: 0;
    align-items: center;
    padding: 1.2rem;
    background-color: #f3f3f3;
  }
  @media (max-width: 1200px) {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
  }
  @media (max-width: 1200px) {
    margin-top: 1.4rem;
    margin-bottom: 0.4rem;
  }
`;

export default AssignmentsHeader;
