import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  getRubricByIdRequestAction,
  getRubricDataLoadingSelector,
  getCurrentRubricDataSelector,
} from '../../../../GradingRubric/ducks'
import PreviewRubricModal from '../../../../GradingRubric/Components/common/PreviewRubricModal'

const RubricInfoModal = ({
  currentRubricId,
  handleUpdateRubricId,
  currentRubricData,
  rubricDataLoading,
  getRubricById,
}) => {
  useEffect(() => {
    if (currentRubricId !== currentRubricData?._id) {
      getRubricById(currentRubricId)
    }
  }, [currentRubricId, currentRubricData])

  const rubricInfo = useMemo(() => {
    if (
      currentRubricData?._id === currentRubricId &&
      currentRubricData?.criteria
    ) {
      return currentRubricData
    }
    return {}
  }, [currentRubricId, currentRubricData])

  return (
    <PreviewRubricModal
      visible={!!currentRubricId}
      toggleModal={() => handleUpdateRubricId(null)}
      currentRubricData={rubricInfo}
      shouldValidate={false}
      rubricDataLoading={rubricDataLoading}
      isDisabled
      hideTotalPoints
    />
  )
}

RubricInfoModal.propTypes = {
  getRubricById: PropTypes.func,
  rubricDataLoading: PropTypes.bool,
  currentRubricData: PropTypes.object,
  currentRubricId: PropTypes.string.isRequired,
  handleUpdateRubricId: PropTypes.func.isRequired,
}

RubricInfoModal.defaultProps = {
  getRubricById: () => {},
  rubricDataLoading: false,
  currentRubricData: {},
}

export default connect(
  (state) => ({
    rubricDataLoading: getRubricDataLoadingSelector(state),
    currentRubricData: getCurrentRubricDataSelector(state),
  }),
  {
    getRubricById: getRubricByIdRequestAction,
  }
)(RubricInfoModal)
