import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  test as testConst,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { Col, Spin } from 'antd'
import produce from 'immer'
import moment from 'moment'
import { connect } from 'react-redux'
import { EduButton } from '@edulastic/common'
import { IconExpandBox } from '@edulastic/icons'
import { getUserRole } from '../../../src/selectors/user'
import { getReleaseScorePremiumSelector } from '../../../TestPage/ducks'
import { getRecommendationsToAssignSelector } from '../../../CurriculumSequence/ducks'
import DateSelector from './DateSelector'
import { OptionConationer, StyledRow, StyledLink } from './styled'
import TestTypeSelector from './TestTypeSelector'
import QuestionPerStandardSelector from './QuestionPerStandardSelector'
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
            testTypesConstants.TEST_TYPES.ASSESSMENT.includes(value) ||
            testTypesConstants.TEST_TYPES.COMMON.includes(value)
          ) {
            draft.releaseScore =
              testTypesConstants.TEST_TYPES.ASSESSMENT.includes(value) &&
              isReleaseScorePremium
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

  const questionPerStandardOptions = [...Array(8)].map((_, i) => ({
    val: i + 1,
    label: i + 1,
  }))

  useEffect(() => {
    const { isAssigning, recommendations } = recommendationsToAssign
    if (!isAssigning && recommendations.length === 0) {
      toggleModal(false)
    }
  }, [
    recommendationsToAssign.isAssigning,
    recommendationsToAssign.recommendations,
  ])

  const isRecommendingStandards = recommendationsToAssign.recommendations.some(
    (recommendation) => recommendation.standardIdentifiers
  )

  return (
    <ConfirmationModal
      title="Assign Recommendations"
      visible={isModalVisible}
      textAlign="left"
      destroyOnClose
      onCancel={() => toggleModal(false)}
      centered
      padding="25px 40px"
      footer={[
        <EduButton
          height="40px"
          isGhost
          key="cancelButton"
          onClick={() => toggleModal(false)}
        >
          NO, CANCEL
        </EduButton>,
        <EduButton height="40px" key="okButton" onClick={handleAssign}>
          YES, ASSIGN
        </EduButton>,
      ]}
    >
      <OptionConationer display="block" hasMinHeight={false}>
        <DateSelector
          dateCol={24}
          startDate={assignment.startDate}
          endDate={assignment.endDate}
          changeField={onChange}
          passwordPolicy={assignment.passwordPolicy}
          hasStartDate={false}
          showOpenDueAndCloseDate={false}
          paddingTop="8"
        />
        <StyledRow mb="15px" gutter={16}>
          <TestTypeSelector
            userRole={userRole}
            testType={assignment.testType || testSettings.testType}
            onAssignmentTypeChange={onChange('testType')}
            paddingTop="8"
          />
        </StyledRow>
        {isRecommendingStandards && (
          <StyledRow mb="15px" gutter={16}>
            <QuestionPerStandardSelector
              onChange={onChange('questionPerStandard')}
              questionPerStandard={
                assignment.questionPerStandard ||
                testSettings.questionPerStandard
              }
              options={questionPerStandardOptions}
              paddingTop="8"
            />
          </StyledRow>
        )}

        <StyledRow mb="15px" gutter={16}>
          <Col span={24}>
            <StyledLink onClick={onClickFullSettings}>
              SHOW ALL ASSIGN OPTIONS <IconExpandBox />
            </StyledLink>
          </Col>
        </StyledRow>
        {recommendationsToAssign.isAssigning && <Spin />}
      </OptionConationer>
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
