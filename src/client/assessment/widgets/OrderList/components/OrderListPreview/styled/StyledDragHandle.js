import styled from 'styled-components';
import { grey } from '@edulastic/colors';

export const StyledDragHandle = styled.div`
  width: ${props => (props.smallSize ? 30 : 50)}px;
  flex: 1;
  border-top: 1px solid ${grey};
  border-bottom: 1px solid ${grey};
  border-left: 1px solid ${grey};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;
