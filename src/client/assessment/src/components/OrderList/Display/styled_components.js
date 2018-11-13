import styled from 'styled-components';
import { grey } from '@edulastic/colors';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  margin-bottom: 10px;
  cursor: pointer;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export const StyledDragHandle = styled.div`
  width: ${props => (props.smallSize ? 30 : 50)}px;
  flex: 1;
  border-top: 1px solid ${grey};
  border-bottom: 1px solid ${grey};
  border-left: 1px solid ${grey};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export const Text = styled.div`
  resize: none;
  width: ${({ showDragHandle, smallSize }) => (showDragHandle ? smallSize ? 'calc(100% - 30px)' : 'calc(100% - 50px)' : '100%')};
  border: none;
  height: 100%;
  border: 1px solid ${grey};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  min-height: 30px;
  padding: ${({ smallSize }) => (smallSize ? '5px' : '15px')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ smallSize }) => (smallSize ? '13px' : '16px')};
`;
