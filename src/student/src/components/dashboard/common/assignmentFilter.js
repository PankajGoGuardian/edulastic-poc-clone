import styled from 'styled-components';

const AssignmentsFilter = styled.div`
  width: 53%;
  display: flex;
  justify-content: flex-end;

  @media screen and (max-width: 1420px){
    width: 60%;
  }
  @media screen and (max-width: 1300px){
    justify-content: flex-start;
  }
  @media screen and (max-width: 767px){
    width: 100%;
  }
`;

export default AssignmentsFilter;
