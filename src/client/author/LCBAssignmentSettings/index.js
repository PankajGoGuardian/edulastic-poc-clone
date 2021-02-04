import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Select } from 'antd'
import moment from 'moment'
import {
  test as testConst,
  assignmentPolicyOptions,
  assignmentStatusOptions,
} from '@edulastic/constants'
import { MainContentWrapper, notification, EduButton } from '@edulastic/common'
import {
  getAdditionalDataSelector,
  getTestActivitySelector,
} from '../ClassBoard/ducks'
import { receiveTestActivitydAction } from '../src/actions/classBoard'
import { slice } from './ducks'
import ClassHeader from '../Shared/Components/ClassHeader/ClassHeader'
/**
 * Imports from SimpleOptions for re-use
 */
import {
  OptionConationer,
  InitOptions,
  StyledSelect,
  StyledRow,
} from '../AssignTest/components/SimpleOptions/styled'
import DateSelector from '../AssignTest/components/SimpleOptions/DateSelector'
import Settings from '../AssignTest/components/SimpleOptions/Settings'
import selectsData from '../TestPage/components/common/selectsData'

/**
 * Imports related to testSettings
 */
import { getDefaultTestSettingsAction } from '../TestPage/ducks'
import { getTestEntitySelector } from '../AssignTest/duck'
import { InputLabel, InputLabelContainer, ClassHeading } from './styled'
import { allowedSettingPageToDisplay } from '../Shared/Components/ClassHeader/utils/transformers'

export const releaseGradeKeys = [
  'DONT_RELEASE',
  'SCORE_ONLY',
  'WITH_RESPONSE',
  'WITH_ANSWERS',
]
export const nonPremiumReleaseGradeKeys = ['DONT_RELEASE', 'WITH_ANSWERS']

function LCBAssignmentSettings({
  additionalData = {},
  loadTestActivity,
  match,
  history,
  loadAssignment,
  assignment = {},
  testSettings = {},
  loadTestSettings,
  changeAttrs,
  updateAssignmentSettings,
  testActivity,
  userId,
}) {
  const { openPolicy, closePolicy } = selectsData
  const { assignmentId, classId } = match.params || {}
  useEffect(() => {
    loadTestActivity(assignmentId, classId)
    loadAssignment({ assignmentId, classId })
    loadTestSettings()
  }, [])

  useEffect(() => {
    const { assignedBy } = additionalData
    const showSettingTab = allowedSettingPageToDisplay(assignedBy, userId)
    if (!showSettingTab) {
      notification({ messageKey: 'persmissionDenied' })
      history.push(`/author/classboard/${assignmentId}/${classId}`)
    }
  }, [additionalData])

  const { startDate, endDate, status, dueDate } =
    assignment?.['class']?.[0] || {}
  const changeField = (key) => (value) => {
    if (key === 'scoringType') {
      return
    }
    if (
      key === 'openPolicy' &&
      value === assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE
    ) {
      notification({
        type: 'info',
        messageKey: 'pleaseSelectYourPreferedStartDate',
      })
    } else if (
      key === 'closePolicy' &&
      value === assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE
    ) {
      notification({
        type: 'info',
        messageKey: 'pleaseSelectYourPreferedDueDate  ',
      })
    }
    changeAttrs({ key, value })
  }
  const gradeSubject = {
    grades: assignment?.grades,
    subjects: assignment?.subjects,
  }

  const resetToDefault = () => {
    loadTestActivity(assignmentId, classId)
    loadAssignment({ assignmentId, classId })
    loadTestSettings()
  }

  const className = additionalData?.className

  return (
    <div>
      <ClassHeader
        classId={match.params?.classId}
        active="settings"
        assignmentId={match.params?.assignmentId}
        additionalData={additionalData || {}}
        onCreate={() => history.push(`${match.url}/create`)}
        testActivity={testActivity}
      />
      <MainContentWrapper>
        <OptionConationer width="60%">
          <InitOptions>
            <ClassHeading>
              {className ? (
                <>
                  Settings for <span>{className}</span>
                </>
              ) : (
                'loading...'
              )}
            </ClassHeading>
            <DateSelector
              startDate={moment(startDate)}
              endDate={moment(endDate)}
              dueDate={dueDate ? moment(dueDate) : undefined}
              changeField={changeField}
              forClassLevel
              status={status}
              passwordPolicy={assignment?.passwordPolicy}
            />
            <StyledRow gutter={16}>
              <Col span={12}>
                <InputLabelContainer>
                  <InputLabel>open policy</InputLabel>
                </InputLabelContainer>
              </Col>
              <Col span={12}>
                <StyledSelect
                  data-cy="selectOpenPolicy"
                  placeholder="Please select"
                  cache="false"
                  value={assignment?.openPolicy}
                  onChange={changeField('openPolicy')}
                  disabled={
                    assignment?.passwordPolicy ===
                      testConst.passwordPolicy
                        .REQUIRED_PASSWORD_POLICY_DYNAMIC ||
                    status !== assignmentStatusOptions.NOT_OPEN
                  }
                >
                  {openPolicy.map(({ value, text }, index) => (
                    <Select.Option key={index} value={value} data-cy="open">
                      {text}
                    </Select.Option>
                  ))}
                </StyledSelect>
              </Col>
            </StyledRow>
            <StyledRow gutter={16}>
              <Col span={12}>
                <InputLabelContainer>
                  <InputLabel>close policy</InputLabel>
                </InputLabelContainer>
              </Col>
              <Col span={12}>
                <StyledSelect
                  data-cy="selectClosePolicy"
                  placeholder="Please select"
                  cache="false"
                  value={assignment?.closePolicy}
                  onChange={changeField('closePolicy')}
                  disabled={status === assignmentStatusOptions.DONE}
                >
                  {closePolicy.map(({ value, text }, index) => (
                    <Select.Option data-cy="class" key={index} value={value}>
                      {text}
                    </Select.Option>
                  ))}
                </StyledSelect>
              </Col>
            </StyledRow>

            <Settings
              assignmentSettings={assignment || {}}
              updateAssignmentSettings={() => {}}
              changeField={changeField}
              testSettings={testSettings}
              gradeSubject={gradeSubject}
              _releaseGradeKeys={releaseGradeKeys}
              isDocBased={assignment?.isDocBased}
            />

            <Row gutter={0} style={{ marginTop: '15px' }}>
              <Col offset={12}>
                <Col span={12} style={{ paddingLeft: '16px' }}>
                  <EduButton
                    data-cy="lcb-setting-cancel"
                    height="40px"
                    width="100%"
                    isGhost
                    onClick={() => resetToDefault()}
                  >
                    CANCEL
                  </EduButton>
                </Col>
                <Col span={12} style={{ paddingLeft: '16px' }}>
                  <EduButton
                    data-cy="lcb-setting-update"
                    height="40px"
                    onClick={() =>
                      updateAssignmentSettings({ classId, assignmentId })
                    }
                  >
                    UPDATE
                  </EduButton>
                </Col>
              </Col>
            </Row>
          </InitOptions>
        </OptionConationer>
      </MainContentWrapper>
    </div>
  )
}

export default connect(
  (state) => ({
    additionalData: getAdditionalDataSelector(state),
    assignment: state?.LCBAssignmentSettings?.assignment,
    loading: state?.LCBAssignmentSettings?.loading,
    testSettings: getTestEntitySelector(state),
    testActivity: getTestActivitySelector(state),
    userId: state?.user?.user?._id,
  }),
  {
    loadTestActivity: receiveTestActivitydAction,
    loadAssignment: slice.actions.loadAssignment,
    updateAssignmentSettings: slice.actions.updateAssignmentClassSettings,
    changeAttrs: slice.actions.changeAttribute,
    updateLocally: slice.actions.updateAssignment,
    loadTestSettings: getDefaultTestSettingsAction,
  }
)(LCBAssignmentSettings)
