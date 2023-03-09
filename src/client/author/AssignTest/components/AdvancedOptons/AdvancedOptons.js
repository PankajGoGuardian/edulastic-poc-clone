import {
  assignmentPolicyOptions,
  roleuser,
  test as testConst,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { Col } from 'antd'
import produce from 'immer'
import { curry } from 'lodash'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { STUDENT_ATTEMPT_TIME_WINDOW } from '@edulastic/constants/const/common'
import { getDefaultSettings } from '../../../../common/utils/helpers'
import { isFeatureAccessible } from '../../../../features/components/FeaturesSwitch'
import { getUserFeatures } from '../../../../student/Login/ducks'
import TagFilter from '../../../src/components/common/TagFilter'
import {
  defaultTestTypeProfilesSelector,
  getIsOverrideFreezeSelector,
  getReleaseScorePremiumSelector,
} from '../../../TestPage/ducks'
import { getAssignedClassesByIdSelector } from '../../duck'
import AddResources from '../Container/AddResources'
import {
  nonPremiumReleaseGradeKeys,
  releaseGradeKeys,
} from '../SimpleOptions/SimpleOptions'
import ClassList from './ClassList'
import DatePolicySelector from './DatePolicySelector'
import AttemptWindowTypeSelector from '../SimpleOptions/AttemptWindowTypeSelector'
import {
  ClassSelectorLabel,
  InitOptions,
  Label,
  OptionConationer,
  StyledRow,
} from './styled-components'

const { releaseGradeLabels } = testConst
class AdvancedOptons extends React.Component {
  static propTypes = {
    assignment: PropTypes.object.isRequired,
    testSettings: PropTypes.object.isRequired,
    updateOptions: PropTypes.func.isRequired,
    isAssignRecommendations: PropTypes.bool.isRequired,
  }

  static getDerivedStateFromProps(nextProps) {
    const { features, testSettings } = nextProps
    const { grades, subjects } = testSettings || {}
    if (
      features?.assessmentSuperPowersReleaseScorePremium ||
      (grades &&
        subjects &&
        isFeatureAccessible({
          features,
          inputFeatures: 'assessmentSuperPowersReleaseScorePremium',
          gradeSubject: { grades, subjects },
        }))
    ) {
      return {
        _releaseGradeKeys: releaseGradeKeys,
      }
    }
    return {
      _releaseGradeKeys: nonPremiumReleaseGradeKeys,
    }
  }

  onChange = (field, value, groups) => {
    const {
      onClassFieldChange,
      assignment,
      updateOptions,
      isReleaseScorePremium,
      userRole,
      defaultTestProfiles,
      assignedClassesById,
    } = this.props
    if (field === 'class') {
      const { classData, termId } = onClassFieldChange(value, groups)
      const nextAssignment = produce(assignment, (state) => {
        state.class = classData
        state.termId = termId
      })
      updateOptions(nextAssignment)
      return
    }
    if (field === 'endDate') {
      const { startDate } = assignment
      if (value === null) {
        value = moment(startDate).add('days', 7)
      }
    }

    const nextAssignment = produce(assignment, (state) => {
      if (field === 'startDate') {
        const { endDate } = assignment
        if (value === null) {
          value = moment()
        }
        const diff = value.diff(endDate)
        if (diff > 0) {
          state.endDate = moment(value).add('days', 7)
        }
      }
      if (field === 'testType') {
        const performanceBand = getDefaultSettings({
          testType: value,
          defaultTestProfiles,
        })?.performanceBand
        const standardGradingScale = getDefaultSettings({
          testType: value,
          defaultTestProfiles,
        })?.standardProficiency
        state.performanceBand = performanceBand
        state.standardGradingScale = standardGradingScale

        if (
          testTypesConstants.TEST_TYPES.ASSESSMENT.includes(value) ||
          testTypesConstants.TEST_TYPES.COMMON.includes(value)
        ) {
          state.releaseScore =
            testTypesConstants.TEST_TYPES.ASSESSMENT.includes(value) &&
            isReleaseScorePremium
              ? releaseGradeLabels.WITH_RESPONSE
              : releaseGradeLabels.DONT_RELEASE
        } else {
          state.releaseScore = releaseGradeLabels.WITH_ANSWERS
        }
        if (testTypesConstants.TEST_TYPES.COMMON.includes(value)) {
          state.class = state.class.filter(
            (item) => !assignedClassesById[value][item._id]
          )
        }
      }
      if (field === 'passwordPolicy') {
        if (
          value === testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
        ) {
          state.openPolicy =
            userRole === roleuser.DISTRICT_ADMIN ||
            userRole === roleuser.SCHOOL_ADMIN
              ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
              : assignmentPolicyOptions.POLICY_OPEN_MANUALLY_IN_CLASS
          state.passwordExpireIn = 15 * 60
        } else {
          state.openPolicy =
            userRole === roleuser.DISTRICT_ADMIN ||
            userRole === roleuser.SCHOOL_ADMIN
              ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
              : assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE
        }
      }
      if (field === STUDENT_ATTEMPT_TIME_WINDOW) {
        state.attemptWindow = value
      }

      state[field] = value
    })
    updateOptions(nextAssignment)
  }

  updateStudents = (studentList) => this.onChange('students', studentList)

  render() {
    const {
      testSettings = {},
      assignment,
      isAssignRecommendations,
      recommendedResources = [],
      setEmbeddedVideoPreviewModal,
      resourceIds = [],
      isVideoResourcePreviewModal,
      showRecommendedResources,
      selectedResourcesAction,
      isPlaylist,
      setShowAdvanceSearchModal,
    } = this.props
    const classIds = assignment?.class?.map((item) => item._id) || []
    const changeField = curry(this.onChange)
    const { tags = testSettings.tags } = assignment

    return (
      <OptionConationer>
        <InitOptions>
          <DatePolicySelector
            startDate={assignment.startDate}
            endDate={assignment.endDate}
            openPolicy={assignment.openPolicy}
            closePolicy={assignment.closePolicy}
            changeField={changeField}
            testType={assignment.testType || testSettings.testType}
            passwordPolicy={assignment.passwordPolicy}
            playerSkinType={
              assignment.playerSkinType || testSettings.playerSkinType
            }
            showMagnifier={
              assignment.showMagnifier || testSettings.showMagnifier
            }
          />

          <StyledRow gutter={24}>
            <Col xs={24} md={12} lg={6}>
              <Label>Tags</Label>
              <TagFilter
                selectedTags={tags}
                canCreate
                onChangeField={(type, value) => this.onChange(type, value)}
              />
            </Col>
            <AttemptWindowTypeSelector
              changeField={this.onChange}
              isAdvancedView
            />
          </StyledRow>
          {showRecommendedResources && (
            <StyledRow gutter={24}>
              <Col xs={24} md={12}>
                <Label>Resources</Label>
                <AddResources
                  recommendedResources={recommendedResources}
                  setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                  resourceIds={resourceIds}
                  isVideoResourcePreviewModal={isVideoResourcePreviewModal}
                  selectedResourcesAction={selectedResourcesAction}
                  isDA
                />
              </Col>
            </StyledRow>
          )}

          {!isAssignRecommendations && (
            <>
              <ClassSelectorLabel>
                <h3>Assign this to</h3>
                <p>
                  Please select classes to assign this assessment. Options on
                  the left can be used to filter the list of classes.
                </p>
              </ClassSelectorLabel>
              <ClassList
                selectedClasses={classIds}
                selectClass={this.onChange}
                testType={assignment.testType || testSettings.testType}
                isPlaylist={isPlaylist}
                setShowAdvanceSearchModal={setShowAdvanceSearchModal}
              />
            </>
          )}
        </InitOptions>
      </OptionConationer>
    )
  }
}

export default connect((state) => ({
  features: getUserFeatures(state),
  isReleaseScorePremium: getReleaseScorePremiumSelector(state),
  defaultTestProfiles: defaultTestTypeProfilesSelector(state),
  freezeSettings: getIsOverrideFreezeSelector(state),
  assignedClassesById: getAssignedClassesByIdSelector(state),
}))(AdvancedOptons)
