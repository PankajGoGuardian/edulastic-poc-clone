import styled from 'styled-components';

export const ColorBox = styled.div`
  width: 40px;
  height: 40px;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 10px;
  background: white;
  border: '1px solid #e6e6e6';
  background-color: ${props => props.background}
`;
