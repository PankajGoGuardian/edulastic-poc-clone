import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { FaBars } from 'react-icons/fa';
import styled from 'styled-components';
import { green, greenDark } from '../../utilities/css';

const DragHandle = SortableHandle(() => (
  <Container>
    <FaBars />
  </Container>
));

export default DragHandle;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${green};
  font-size: 25px;

  :hover {
    cursor: pointer;
    color: ${greenDark};
  }
`;
