import styled from 'styled-components';

const AssignmentSelectClass = styled.div`
  overflow: hidden;
  position: relative;
  width: 13rem;
  display: inline-flex;
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.07);
  border-radius: 0.5rem;
  height: 2.7rem;

  & div {
    position: relative;
    background-color: #fff;
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
  @media (max-width: 1060px) {
  }
  @media (max-width: 425px) {
    width: 10rem;
  }
  @media (max-width: 320px) {
    margin-right: 0.5rem;
    width: 9rem;
  }
`;
export default AssignmentSelectClass;
