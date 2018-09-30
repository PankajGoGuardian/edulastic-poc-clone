import styled from 'styled-components';

const MultiChoiceContent = styled.div`
  font-size: ${props => (props.smallSize ? 13 : 16)}px;
  color: ${props => props.theme.mainContentTextColor};
  display: flex;
  flex: 1;
  align-items: center;
`;

export default MultiChoiceContent;
