import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { test as testConst } from '@edulastic/constants'
import { Col } from 'antd'
import produce from 'immer'
import moment from 'moment'
import { connect } from 'react-redux'
import { getUserRole } from '../../../src/selectors/user'
import { getReleaseScorePremiumSelector } from '../../../TestPage/ducks'
import { getRecommendationsToAssignSelector } from '../../../CurriculumSequence/ducks'
import DateSelector from './DateSelector'
import { InitOptions, StyledRow } from './styled'
import TestTypeSelector from './TestTypeSelector'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const { releaseGradeLabels } = testConst
const SimpleOptionsModal = ({
  assignment,
  testSettings,
  updateOptions,
  isReleaseScorePremium,
  userRole,
  handleAssign,
  isModalVisible,
  toggleModal,
  onClickFullSettings,
  recommendationsToAssign,
}) => {
  const onChange = (field) => (value) => {
    if (field === 'endDate') {
      const { startDate } = assignment
      if (value === null) {
        value = moment(startDate).add('days', 7)
      }
    }

    const nextAssignment = produce(assignment, (draft) => {
      switch (field) {
        case 'testType': {
          if (
            value === testConst.type.ASSESSMENT ||
            value === testConst.type.COMMON
          ) {
            draft.releaseScore =
              value === testConst.type.ASSESSMENT && isReleaseScorePremium
                ? releaseGradeLabels.WITH_RESPONSE
                : releaseGradeLabels.DONT_RELEASE
            draft.maxAttempts = 1
            draft.maxAnswerChecks = 0
          } else {
            draft.releaseScore = releaseGradeLabels.WITH_ANSWERS
            draft.maxAttempts = 1
            draft.maxAnswerChecks = 3
          }
          break
        }
        // no default
      }
      draft[field] = value
    })
    updateOptions(nextAssignment)
  }

  useEffect(() => {
    const { isAssigning, recommendations } = recommendationsToAssign
    if (!isAssigning && recommendations.length === 0) {
      toggleModal(false)
    }
  }, [
    recommendationsToAssign.isAssigning,
    recommendationsToAssign.recommendations,
  ])

  return (
    <ConfirmationModal
      title="Assign Recommendations"
      visible
      onOk={handleAssign}
      onCancel={() => toggleModal(false)}
      okText="ASSIGN"
      cancelText="CANCEL"
      centered
    >
      <InitOptions>
        <DateSelector
          startDate={assignment.startDate}
          endDate={assignment.endDate}
          changeField={onChange}
          passwordPolicy={assignment.passwordPolicy}
          hasStartDate={false}
          showOpenDueAndCloseDate={false}
        />
        <StyledRow gutter={32} mb="15px">
          <Col span={12}>
            <TestTypeSelector
              userRole={userRole}
              testType={assignment.testType || testSettings.testType}
              onAssignmentTypeChange={onChange('testType')}
            />
          </Col>
        </StyledRow>
        <span onClick={onClickFullSettings}>Full settings</span>
      </InitOptions>
    </ConfirmationModal>
  )
}

SimpleOptionsModal.propTypes = {
  assignment: PropTypes.object.isRequired,
  testSettings: PropTypes.object.isRequired,
  updateOptions: PropTypes.func.isRequired,
  isReleaseScorePremium: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
  onClickFullSettings: PropTypes.func.isRequired,
  recommendationsToAssign: PropTypes.object.isRequired,
}

export default connect((state) => ({
  userRole: getUserRole(state),
  isReleaseScorePremium: getReleaseScorePremiumSelector(state),
  recommendationsToAssign: getRecommendationsToAssignSelector(state),
}))(SimpleOptionsModal)
