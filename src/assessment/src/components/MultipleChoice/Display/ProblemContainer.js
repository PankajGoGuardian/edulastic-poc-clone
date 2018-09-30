import styled from 'styled-components';

const ProblemContainer = styled.div`
  font-size: ${props => (props.smallSize ? 14 : 20)}px;
  padding: ${props => (props.smallSize ? '10px 0' : '20px 0')};
  font-weight: bold;

  & strong {
    font-size: 28px;
  }
`;

export default ProblemContainer;
