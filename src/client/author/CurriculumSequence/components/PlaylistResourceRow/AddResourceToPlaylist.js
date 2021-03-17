import React, { Fragment } from 'react'
import { useDrop } from 'react-dnd'
import { connect } from 'react-redux'
import { Row, Col } from 'antd'
import { SupportResourceDropTarget, NewActivityTarget } from './styled'
import { addSubresourceToPlaylistAction } from '../../ducks'
import { addSubresourceToPlaylistAction as addSubresourceInPlaylistAction } from '../../../PlaylistPage/ducks'

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

function SubResourceDropContainer({ children, ...props }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'item',
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType,
    }),
    drop: (item) => {
      const { moduleIndex, itemIndex, addSubresource, contentSubType } = props
      if (addSubresource) {
        addSubresource({
          moduleIndex,
          itemIndex,
          item: { ...item, contentSubType },
        })
      }
    },
  })

  return (
    <SupportResourceDropTarget {...props} ref={dropRef} active={isOver}>
      {children}
    </SupportResourceDropTarget>
  )
}

const AddResourceToPlaylist = ({
  index,
  isTestType,
  moduleIndex,
  addSubresource,
  onDrop,
  showNewActivity,
  showSupportingResource,
}) => (
  <>
    {isTestType && showSupportingResource && (
      <Row gutter={16}>
        <Col md={5}>
          <SubResourceDropContainer
            data-cy="supporting-resource"
            moduleIndex={moduleIndex}
            addSubresource={addSubresource}
            itemIndex={index}
            contentSubType="STUDENT"
          >
            <span>Student Resource</span>
          </SubResourceDropContainer>
        </Col>

        <Col md={5}>
          <SubResourceDropContainer
            data-cy="supporting-resource"
            moduleIndex={moduleIndex}
            addSubresource={addSubresource}
            itemIndex={index}
            contentSubType="TEACHER"
          >
            <span>Teacher Resource</span>
          </SubResourceDropContainer>
        </Col>
      </Row>
    )}
    {showNewActivity && (
      <Row gutter={16}>
        <Col md={10}>
          <NewActivityTargetContainer
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

export default connect(null, (dispatch, { fromPlaylist }) => ({
  addSubresource: (payload) =>
    dispatch(
      fromPlaylist
        ? addSubresourceInPlaylistAction(payload)
        : addSubresourceToPlaylistAction(payload)
    ),
}))(AddResourceToPlaylist)
