import { EduIf } from '@edulastic/common'
import { IconWarnCircle } from '@edulastic/icons'
import React, { useEffect, useState } from 'react'
import { SortableElement } from 'react-sortable-hoc'
import styled from 'styled-components'
import { Popover } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { validateQuestionsForGoogleForm } from '../../../../../../../common/utils/helpers'
import ReviewItem from '../../ReviewItem'
import { DragCrad, ReviewItemWrapper } from '../styled'
import DragHandle from './DragHandle'
import { getTestSelector } from '../../../../../ducks'

const SortableItem = SortableElement((props) => {
  const { item, isEditable, expand, groupMinimized, test } = props

  const isGoogleFormTest = test?.importData?.googleForm
  const isValid = isGoogleFormTest
    ? validateQuestionsForGoogleForm(item?.data?.questions || [], false)
    : true

  return (
    <DragCrad data-cy="drag-card" noPadding={groupMinimized}>
      <EduIf condition={!isValid}>
        <StyledInfoIconWrapper>
          <Popover
            placement="bottomLeft"
            content={
              <>
                Item is missing content or answer. <br />
                Please add them by editing this item.
              </>
            }
          >
            <IconWarnCircle />
          </Popover>
        </StyledInfoIconWrapper>
      </EduIf>
      {!expand && !groupMinimized && (
        <DragHandle isEditable={isEditable} indx={item.indx} />
      )}
      <ReviewItemWrapper data-cy={item._id} fullWidth={groupMinimized}>
        <ReviewItem {...props} />
      </ReviewItemWrapper>
    </DragCrad>
  )
})

const SingleItem = (props) => {
  const { item, isCollapse, removeItem, disabled, ...rest } = props

  const [expand, toggleExpand] = useState(false)

  const toggleExpandRow = () => toggleExpand(!expand)

  const handleDelete = () => {
    removeItem(item._id)
  }

  useEffect(() => {
    toggleExpand(!isCollapse)
  }, [isCollapse])

  return (
    <SortableItem
      {...rest}
      item={item}
      expand={expand}
      disabled={disabled || expand}
      onDelete={handleDelete}
      toggleExpandRow={toggleExpandRow}
    />
  )
}

const enhance = compose(
  connect(
    (state) => ({
      test: getTestSelector(state),
    }),
    {}
  )
)

export default enhance(SingleItem)

const StyledInfoIconWrapper = styled.div`
  cursor: pointer;
  position: absolute;
  left: 0px;
  top: 20px;
`
