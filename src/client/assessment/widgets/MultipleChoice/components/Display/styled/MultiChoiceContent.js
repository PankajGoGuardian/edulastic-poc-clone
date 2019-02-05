import styled from 'styled-components';

export const MultiChoiceContent = styled.div`
  font-size: ${props => props.fontSize || '13px'};
  color: ${props => props.theme.mainContentTextColor};
  display: flex;
  flex: 1;
  align-items: center;
  font-weight: 600;
`;
