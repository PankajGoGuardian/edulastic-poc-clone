import styled from 'styled-components';

const AssignmentSelectClass = styled.div`
  overflow: hidden;
  position: relative;
  width: 10rem;
  display: inline-flex;
  margin-right: 2rem;
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.07);
  border-radius: 1rem;
  height: 2.7rem;

  & div {
    position: relative;
    background-color: #fff;
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
  @media (max-width: 1060px) {
    float: left;
  }
  @media (max-width: 425px) {
    margin-right: 0rem;
  }
`;

export default AssignmentSelectClass;
