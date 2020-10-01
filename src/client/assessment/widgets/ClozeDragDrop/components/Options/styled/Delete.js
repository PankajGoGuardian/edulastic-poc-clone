import styled from 'styled-components'

export const Delete = styled.div`
  padding: 3px 10px;
  border-radius: 3px;
  background: ${(props) => props.theme.widgets.clozeDragDrop.deleteBgColor};
  position: absolute;
  right: 10px;
  top: 0;
  z-index: 1;
  cursor: pointer;
`
