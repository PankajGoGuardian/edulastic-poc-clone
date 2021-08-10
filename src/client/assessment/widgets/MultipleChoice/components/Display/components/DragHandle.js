import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { SortableHandle } from 'react-sortable-hoc'

const DragHandle = SortableHandle(() => (
  <DragIcon>
    <DragLine />
    <DragLine />
    <DragLine />
  </DragIcon>
))

DragHandle.propTypes = {
  index: PropTypes.string,
}

export default DragHandle

export const DragIcon = styled.div`
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: grab;
`

export const DragLine = styled.div`
  width: 16px;
  height: 3px;
  background: #878a91;

  &:not(:last-child) {
    margin-bottom: 2.8px;
  }
`
