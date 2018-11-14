import styled from 'styled-components';

const ProblemContainer = styled.div`
  font-size: ${props => (props.smallSize ? 14 : 20)}px;
  padding: ${props => (props.smallSize ? '15px 0 10px' : '20px 0')};
  font-weight: bold;

  & strong {
    font-size: 28px;
  }
`;

export default ProblemContainer;
