import React, { Fragment } from 'react'
import { useDrop } from 'react-dnd'
import { Row, Col } from 'antd'
import { NewActivityTarget } from './styled'

function NewActivityTargetContainer({ children, ...props }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'item',
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType,
    }),
    drop: (item) => {
      const { moduleIndex, afterIndex, onDrop } = props
      if (onDrop) {
        onDrop(moduleIndex, item, afterIndex)
      }
    },
  })

  return (
    <NewActivityTarget {...props} ref={dropRef} active={isOver}>
      {children}
    </NewActivityTarget>
  )
}

const AddNewActivityToPlaylist = ({
  index,
  moduleIndex,
  onDrop,
  showNewActivity,
}) => (
  <>
    {showNewActivity && (
      <Row gutter={16}>
        <Col md={16}>
          <NewActivityTargetContainer
            data-cy="newActivityDropContainer"
            moduleIndex={moduleIndex}
            afterIndex={index}
            onDrop={onDrop}
          >
            <span> New activity</span>
          </NewActivityTargetContainer>
        </Col>
      </Row>
    )}
  </>
)

export default AddNewActivityToPlaylist
