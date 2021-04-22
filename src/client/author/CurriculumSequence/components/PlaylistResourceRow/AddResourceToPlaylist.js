import React, { Fragment } from 'react'
import { useDrop } from 'react-dnd'
import { connect } from 'react-redux'
import { Row, Col } from 'antd'
import { SupportResourceDropTarget } from './styled'
import { addSubresourceToPlaylistAction } from '../../ducks'
import { addSubresourceToPlaylistAction as addSubresourceInPlaylistAction } from '../../../PlaylistPage/ducks'

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
  showSupportingResource,
}) => (
  <>
    {isTestType && showSupportingResource && (
      <Row gutter={16}>
        <Col md={8}>
          <SubResourceDropContainer
            data-cy="studentResourceDropContainer"
            moduleIndex={moduleIndex}
            addSubresource={addSubresource}
            itemIndex={index}
            contentSubType="STUDENT"
          >
            <span>Student Resource</span>
          </SubResourceDropContainer>
        </Col>

        <Col md={8}>
          <SubResourceDropContainer
            data-cy="teacherResourceDropContainer"
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
