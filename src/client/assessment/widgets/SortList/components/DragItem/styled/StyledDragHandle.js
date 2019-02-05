import styled from 'styled-components';
import { grey } from '@edulastic/colors';

export const StyledDragHandle = styled.div`
  width: ${props => (props.smallSize ? 30 : 50)}px;
  flex: 1;
  border-right: 1px solid ${grey};
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;
