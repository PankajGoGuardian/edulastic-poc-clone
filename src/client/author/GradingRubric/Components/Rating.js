import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import produce from 'immer'

import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { updateRubricDataAction, getCurrentRubricDataSelector } from '../ducks'
import { Title } from '../../src/components/common'
import RatingBox from './RatingBoxContainer'

const Rating = ({
  data,
  id,
  parentId,
  currentRubricData,
  updateRubricData,
  isEditable,
  className,
  handleOnClickExpand = () => {},
  selectedRatingToExpand = '',
  criteriaName = '',
}) => {
  const allRatings = currentRubricData.criteria.find((c) => c.id === parentId)
    .ratings
  const handleDelete = () => {
    const updatedRubricData = produce(currentRubricData, (draft) => {
      draft.criteria.map((criteria) => {
        if (criteria.id === parentId) {
          const ratings = criteria.ratings.filter((r) => r.id !== id)
          criteria.ratings = ratings
        }
        return criteria
      })
    })
    updateRubricData(updatedRubricData)
  }

  const isFullScreenVisible = selectedRatingToExpand === id
  const [lastUpdatedRubricData, setLastUpdatedRubricData] = useState(null)

  useEffect(() => {
    if (isFullScreenVisible) {
      setLastUpdatedRubricData(currentRubricData)
    } else {
      setLastUpdatedRubricData(null)
    }
    return () => {
      setLastUpdatedRubricData(null)
    }
  }, [isFullScreenVisible])

  const handleOnCancel = () => {
    updateRubricData(lastUpdatedRubricData)
    handleOnClickExpand(id)
  }

  const ratingProps = {
    className,
    id,
    parentId,
    isEditable,
    data,
    allRatings,
    handleDelete,
    selectedRatingToExpand,
    handleOnClickExpand,
    handleOnCancel,
  }

  return (
    <>
      <RatingBox {...ratingProps} />
      <StyledModal
        visible={isFullScreenVisible}
        wrapClassName="test-preview-modal"
        footer={null}
        header={null}
        onCancel={() => handleOnClickExpand(id)}
        width="100%"
        closable={false}
        maskClosable={false}
      >
        <FlexContainer
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          padding="16px 32px"
        >
          <Title>{criteriaName}</Title>
        </FlexContainer>
        <StyledRatingCardWrapper
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          height="100%"
          padding="16px 0 0 0"
        >
          <StyledFullScreenRatingWrapper data-cy="ratingContainer">
            <RatingBox {...ratingProps} isFullScreen />
          </StyledFullScreenRatingWrapper>
        </StyledRatingCardWrapper>
      </StyledModal>
    </>
  )
}

export default connect(
  (state) => ({
    currentRubricData: getCurrentRubricDataSelector(state),
  }),
  {
    updateRubricData: updateRubricDataAction,
  }
)(Rating)

const StyledModal = styled(Modal)`
  width: 100% !important;
  top: 0 !important;
  left: 0 !important;

  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-header {
    display: none;
  }
  .ant-modal-content {
    height: 100vh;
    padding-top: 20px;
    bottom: auto;
    border-radius: 0;
    display: flex;
    width: 100%;
    padding: 0;
  }
  .ant-modal-body {
    padding: 0px;
    position: relative;
    width: 100%;
  }

  .exit-btn-row {
    margin-top: -10px;
    margin-bottom: 10px;
  }
`
const StyledFullScreenRatingWrapper = styled.div`
  max-width: 700px;
  width: 100%;
  position: relative;
  top: -60px;
`

const StyledRatingCardWrapper = styled.div`
  background: #f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`
