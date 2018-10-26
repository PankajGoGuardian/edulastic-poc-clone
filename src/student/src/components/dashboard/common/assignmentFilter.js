import styled from 'styled-components';

const AssignmentsFilter = styled.div`
  float: right;
  @media (max-width: 1060px) {
    width: 100%;
  }
  @media (max-width: 1200px) {
    width: 100%;
    padding: 1rem 0.5rem;
  }
  @media (max-width: 435px) {
    padding: 1rem 0rem;
  }
  @media (max-width: 380px) {
    display: flex;
  }
`;

export default AssignmentsFilter;
