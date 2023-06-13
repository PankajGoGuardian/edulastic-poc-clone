import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Select, Spin, Tooltip } from 'antd'
import moment from 'moment'
import {
  test as testConst,
  assignmentPolicyOptions,
  assignmentStatusOptions,
  roleuser,
} from '@edulastic/constants'
import {
  MainContentWrapper,
  notification,
  EduButton,
  SelectInputStyled,
  EduIf,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { compose } from 'redux'
import {
  getAdditionalDataSelector,
  getIsDocBasedTestSelector,
  getTestActivitySelector,
} from '../ClassBoard/ducks'
import { slice } from './ducks'
import ClassHeader from '../Shared/Components/ClassHeader/ClassHeader'
/**
 * Imports from SimpleOptions for re-use
 */
import {
  OptionConationer,
  InitOptions,
  StyledRow,
} from '../AssignTest/components/SimpleOptions/styled'
import DateSelector from '../AssignTest/components/SimpleOptions/DateSelector'
import Settings from '../AssignTest/components/SimpleOptions/Settings'
import selectsData from '../TestPage/components/common/selectsData'
import DetailsTooltip from '../AssignTest/components/Container/DetailsTooltip'
import SettingContainer from '../AssignTest/components/Container/SettingsContainer'
import AttemptWindowTypeSelector from '../AssignTest/components/SimpleOptions/AttemptWindowTypeSelector'

/**
 * Imports related to testSettings
 */
import {
  getDefaultTestSettingsAction,
  togglePenaltyOnUsingHintsAction,
} from '../TestPage/ducks'
import { getTestEntitySelector } from '../AssignTest/duck'
import { InputLabel, InputLabelContainer, ClassHeading } from './styled'
import { allowedSettingPageToDisplay } from '../Shared/Components/ClassHeader/utils/transformers'
import { getUserRole, isPremiumUserSelector } from '../src/selectors/user'

export const releaseGradeKeys = [
  'DONT_RELEASE',
  'SCORE_ONLY',
  'WITH_RESPONSE',
  'WITH_ANSWERS',
]
export const nonPremiumReleaseGradeKeys = ['DONT_RELEASE', 'WITH_ANSWERS']

function LCBAssignmentSettings({
  additionalData = {},
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
  isDocBased,
  loading,
  userRole,
  togglePenaltyOnUsingHints,
  isPremiumUser,
  t,
}) {
  const { openPolicy, closePolicy, openPolicyForAdmin } = selectsData
  const { assignmentId, classId } = match.params || {}
  useEffect(() => {
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

  const isAdmin = roleuser.DA_SA_ROLE_ARRAY.includes(userRole)

  const openPolicyOptions = useMemo(() => {
    if (isAdmin) {
      return openPolicyForAdmin.filter(
        (o) => o.value !== assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_ADMIN
      )
    }
    return openPolicy
  }, [isAdmin, openPolicy, openPolicyForAdmin])

  const { startDate, endDate, status, dueDate, allowedOpenDate } =
    assignment?.class?.[0] || {}

  const showAllowedOpenDate =
    status === assignmentStatusOptions.NOT_OPEN &&
    assignment?.openPolicy !==
      assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE &&
    allowedOpenDate

  const startDateToShow = showAllowedOpenDate ? allowedOpenDate : startDate

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
      key === 'openPolicy' &&
      value !== assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE
    ) {
      notification({
        type: 'info',
        messageKey: 'pleaseSelectYourPreferedOpenDate',
      })
    } else if (
      key === 'closePolicy' &&
      value === assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE
    ) {
      notification({
        type: 'info',
        messageKey: 'pleaseSelectYourPreferedDueDate',
      })
    } else if (key === 'startDate' && showAllowedOpenDate) {
      return changeAttrs({ key: 'allowedOpenDate', value })
    }
    changeAttrs({ key, value, isAdmin, status })
  }
  const gradeSubject = {
    grades: assignment?.grades,
    subjects: assignment?.subjects,
  }

  const resetToDefault = () => {
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
          {loading ? (
            <Spin />
          ) : (
            <InitOptions>
              <ClassHeading>
                Settings for <span>{className}</span>
              </ClassHeading>
              <DateSelector
                startDate={moment(startDateToShow)}
                endDate={moment(endDate)}
                dueDate={dueDate ? moment(dueDate) : undefined}
                changeField={changeField}
                forClassLevel
                status={status}
                passwordPolicy={assignment?.passwordPolicy}
                closePolicy={assignment?.closePolicy}
              />
              <SettingContainer id="open-policy-setting">
                <DetailsTooltip
                  title="OPEN POLICY"
                  content="Choose Automatically on Open Date to allow students immediate access to the test on the open date/time. This is good for practice or other low stakes assignments. Choose Manually in Class when it is required for the teacher to control the open times, (e.g. a final exam that is assigned to multiple classes throughout the day)."
                  premium
                  placement="rightTop"
                />
                <StyledRow gutter={16}>
                  <Col span={12}>
                    <InputLabelContainer>
                      <InputLabel>open policy</InputLabel>
                    </InputLabelContainer>
                  </Col>
                  <Col span={12}>
                    <Tooltip
                      placement="top"
                      title={
                        assignment?.passwordPolicy ===
                        testConst.passwordPolicy
                          .REQUIRED_PASSWORD_POLICY_DYNAMIC
                          ? 'To modify set Dynamic Password as OFF'
                          : null
                      }
                    >
                      <SelectInputStyled
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
                        height="30px"
                      >
                        {openPolicyOptions.map(({ value, text }, index) => (
                          <Select.Option
                            key={index}
                            value={value}
                            data-cy="open"
                          >
                            {text}
                          </Select.Option>
                        ))}
                      </SelectInputStyled>
                    </Tooltip>
                  </Col>
                </StyledRow>
              </SettingContainer>
              <SettingContainer id="close-policy-setting">
                <DetailsTooltip
                  title="CLOSE POLICY"
                  content="Choose the Automatic option to automatically lock down access on the close date. This eliminates the need for teachers to remember to close and also useful for sending data to Insight reports as soon as all students have submitted. Choose Manually in Class when it is required for the teacher to control the close times, (e.g. a final exam that is assigned to multiple classes throughout the day)."
                  premium
                  placement="rightTop"
                />
                <StyledRow gutter={16}>
                  <Col span={12}>
                    <InputLabelContainer>
                      <InputLabel>close policy</InputLabel>
                    </InputLabelContainer>
                  </Col>
                  <Col span={12}>
                    <SelectInputStyled
                      data-cy="selectClosePolicy"
                      placeholder="Please select"
                      cache="false"
                      value={assignment?.closePolicy}
                      onChange={changeField('closePolicy')}
                      disabled={status === assignmentStatusOptions.DONE}
                      height="30px"
                    >
                      {closePolicy.map(({ value, text }, index) => (
                        <Select.Option
                          data-cy="class"
                          key={index}
                          value={value}
                        >
                          {text}
                        </Select.Option>
                      ))}
                    </SelectInputStyled>
                  </Col>
                </StyledRow>
              </SettingContainer>
              <EduIf condition={isPremiumUser}>
                <SettingContainer id="student-attempt-window-setting">
                  <DetailsTooltip
                    title={t('studentAttemptTimeWindow.title')}
                    content={t('studentAttemptTimeWindow.toolTipMsg')}
                    premium
                    placement="rightTop"
                  />
                  <StyledRow gutter={16}>
                    <AttemptWindowTypeSelector
                      value={
                        assignment?.class[0]?.attemptWindow ||
                        assignment?.attemptWindow
                      }
                      changeField={(key, value) => {
                        changeField(key)(value)
                      }}
                    />
                  </StyledRow>
                </SettingContainer>
              </EduIf>
              <Settings
                assignmentSettings={assignment || {}}
                updateAssignmentSettings={() => {}}
                changeField={changeField}
                testSettings={testSettings}
                gradeSubject={gradeSubject}
                _releaseGradeKeys={releaseGradeKeys}
                isDocBased={isDocBased}
                togglePenaltyOnUsingHints={togglePenaltyOnUsingHints}
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
          )}
        </OptionConationer>
      </MainContentWrapper>
    </div>
  )
}

const enhance = compose(
  withNamespaces('author'),
  connect(
    (state) => ({
      additionalData: getAdditionalDataSelector(state),
      assignment: state?.LCBAssignmentSettings?.assignment,
      loading: state?.LCBAssignmentSettings?.loading,
      testSettings: getTestEntitySelector(state),
      testActivity: getTestActivitySelector(state),
      userId: state?.user?.user?._id,
      isDocBased: getIsDocBasedTestSelector(state),
      userRole: getUserRole(state),
      isPremiumUser: isPremiumUserSelector(state),
    }),
    {
      loadAssignment: slice.actions.loadAssignment,
      updateAssignmentSettings: slice.actions.updateAssignmentClassSettings,
      changeAttrs: slice.actions.changeAttribute,
      updateLocally: slice.actions.updateAssignment,
      loadTestSettings: getDefaultTestSettingsAction,
      togglePenaltyOnUsingHints: togglePenaltyOnUsingHintsAction,
    }
  )
)

export default enhance(LCBAssignmentSettings)
