import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'
import { FaBars } from 'react-icons/fa'

import { Container } from './styled/Container'

const DragHandle = SortableHandle(({ smallSize, styleType }) => (
  <Container smallSize={smallSize} styleType={styleType}>
    <FaBars />
  </Container>
))

export default DragHandle
