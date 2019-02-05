import styled from 'styled-components';

export const Container = styled.div`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;

  @media (max-width: 468px) {
    padding-left: 10px;
    margin-right: ${props => !props.value && '20px !important'};
    margin-left: ${props => props.value && '20px !important'};
  }
`;
