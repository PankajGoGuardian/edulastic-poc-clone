import {
  EduButton,
  EduIf,
  RadioBtn,
  SelectInputStyled,
} from '@edulastic/common'
import { roleuser, subscriptions } from '@edulastic/constants'
import { IconInfo, IconSaveNew } from '@edulastic/icons'
import { Select, Tooltip } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { lightGrey9 } from '@edulastic/colors'
import {
  HeaderSaveButton,
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'
import {
  ContentWrapper,
  StyledContent,
  StyledLayout,
  SettingsWrapper,
  StyledRow,
  StyledCol,
  StyledHeading1,
  InputLabel,
  StyledRadioGrp,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import { receivePerformanceBandAction } from '../../../PerformanceBand/ducks'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import SaSchoolSelect from '../../../src/components/common/SaSchoolSelect'
import { getUserOrgId, getUserRole } from '../../../src/selectors/user'
import { receiveStandardsProficiencyAction } from '../../../StandardsProficiency/ducks'
import { getSubscriptionSelector } from '../../../Subscription/ducks'
// actions
import {
  createTestSettingAction,
  receiveTestSettingAction,
  setTestSettingDefaultProfileAction,
  setTestSettingValueAction,
  updateTestSettingAction,
} from '../../ducks'
import { editTeachersAccommodationOptions } from '../../utils/constants'
import { OptionContainer } from './styled'

const title = 'Manage District'
const menuActive = { mainMenu: 'Settings', subMenu: 'Test Settings' }
// This permission is used in District test setting only.
const linkSharingPermissions = {
  VIEW: 'Limited access (duplicate, assign)',
  ASSIGN: 'View and assign',
  NOACTION: 'No Actions (View Only)',
  NO: 'Link sharing off',
}

const { PARTIAL_PREMIUM, ENTERPRISE } = subscriptions.SUBSCRIPTION_SUB_TYPES

const checkIsUndefinedOrNull = (value) => {
  return value === undefined || value === null
}

class TestSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      testSetting: {
        partialScore: true,
        timer: true,
        isLinkSharingEnabled: false,
        enableAudioResponseQuestion: false,
        canAccessPublicContent: true,
        canSchoolAdminUseDistrictCommon: true,
      },
    }
  }

  componentDidMount() {
    const {
      loadTestSetting,
      userOrgId,
      loadPerformanceBand,
      loadStandardsProficiency,
      schoolId,
      role,
    } = this.props
    if (role === roleuser.SCHOOL_ADMIN) {
      loadTestSetting({ orgType: 'institution', orgId: schoolId })
    } else {
      loadTestSetting({ orgId: userOrgId })
    }

    loadPerformanceBand({ orgId: userOrgId })
    loadStandardsProficiency({ orgId: userOrgId })
  }

  componentDidUpdate(prevProps) {
    /**
     * school selection is changed
     */
    const { schoolId, loadTestSetting } = this.props
    if (prevProps.schoolId != schoolId && schoolId) {
      loadTestSetting({ orgType: 'institution', orgId: schoolId })
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if (
      nextProps.testSetting == null ||
      Object.keys(nextProps.testSetting).length === 0
    ) {
      return {
        testSetting: {
          partialScore: true,
          timer: true,
          isLinkSharingEnabled: false,
          enableAudioResponseQuestion: false,
        },
      }
    }
    return { testSetting: nextProps.testSetting }
  }

  changeSetting = (e, fieldName, value) => {
    const { testSetting } = this.state
    const { setTestSettingValue, role } = this.props
    if (fieldName === 'linkSharingPermission') {
      if (value === 'NO') {
        setTestSettingValue(
          { ...testSetting, isLinkSharingEnabled: false },
          role === roleuser.SCHOOL_ADMIN
        )
      } else {
        setTestSettingValue(
          { ...testSetting, [fieldName]: value, isLinkSharingEnabled: true },
          role === roleuser.SCHOOL_ADMIN
        )
      }
      return
    }
    setTestSettingValue(
      { ...testSetting, [fieldName]: e?.target?.value },
      role === roleuser.SCHOOL_ADMIN
    )
  }

  updateValue = () => {
    const { testSetting } = this.state
    const {
      createTestSetting,
      updateTestSetting,
      schoolId,
      role,
      userOrgId,
    } = this.props
    const updateData = {
      orgId: role === roleuser.SCHOOL_ADMIN ? schoolId : userOrgId,
      orgType: role === roleuser.SCHOOL_ADMIN ? 'institution' : 'district',
      partialScore: testSetting.partialScore,
      timer: testSetting.timer,
      testTypesProfile: testSetting.testTypesProfile,
      isLinkSharingEnabled: !!testSetting.isLinkSharingEnabled,
      enableAudioResponseQuestion: testSetting.enableAudioResponseQuestion,
      editTeacherAccommodation: testSetting.editTeacherAccommodation,
      enableSpeechToText: testSetting.enableSpeechToText,
      canAccessPublicContent: checkIsUndefinedOrNull(
        testSetting.canAccessPublicContent
      )
        ? true
        : testSetting.canAccessPublicContent,
      canSchoolAdminUseDistrictCommon: checkIsUndefinedOrNull(
        testSetting.canSchoolAdminUseDistrictCommon
      )
        ? true
        : testSetting.canSchoolAdminUseDistrictCommon,
    }
    if (updateData.isLinkSharingEnabled) {
      Object.assign(updateData, {
        linkSharingPermission: testSetting.linkSharingPermission,
      })
    }

    // eslint-disable-next-line
    if (testSetting.hasOwnProperty('_id')) {
      updateTestSetting(updateData)
    } else {
      createTestSetting(updateData)
    }
  }

  render() {
    const {
      loading,
      updating,
      creating,
      history,
      standardsProficiencyProfiles,
      performanceBandProfiles,
      standardsProficiencyLoading,
      performanceBandLoading,
      setDefaultProfile,
      subscription: { subType } = {},
      role,
      t: i18translate,
    } = this.props

    const { testSetting } = this.state
    const performanceBandOptions = performanceBandProfiles.map((x) => (
      <Select.Option key={x._id} value={x._id}>
        {x.name}
      </Select.Option>
    ))

    const standardsProficiencyOptions = standardsProficiencyProfiles.map(
      (x) => (
        <Select.Option key={x._id} value={x._id}>
          {x.name}
        </Select.Option>
      )
    )

    const showSpin = updating || loading || creating
    const enableAudioResponseQuestions = !!testSetting.enableAudioResponseQuestion
    const canAccessPublicContent = checkIsUndefinedOrNull(
      testSetting.canAccessPublicContent
    )
      ? true
      : testSetting.canAccessPublicContent
    const canSchoolAdminUseDistrictCommon = checkIsUndefinedOrNull(
      testSetting.canSchoolAdminUseDistrictCommon
    )
      ? true
      : testSetting.canSchoolAdminUseDistrictCommon
    const isEnterprise = [PARTIAL_PREMIUM, ENTERPRISE].includes(subType)
    const isUserDa = role === roleuser.DISTRICT_ADMIN
    const showEnterpriseSettings = [isEnterprise, isUserDa].every((o) => !!o)

    return (
      <SettingsWrapper>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? 'true' : 'false'}>
            <AdminSubHeader active={menuActive} history={history} />
            {showSpin && (
              <SpinContainer loading={showSpin}>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <ContentWrapper>
              <SaSchoolSelect />
              <StyledHeading1 data-cy="defaultOptionsContent">
                Default Options
              </StyledHeading1>
              <StyledRow type="flex" gutter={40} data-cy="defaultOptions">
                <StyledCol span={8} data-cy="selectLinkSharing">
                  <InputLabel>SELECT LINK SHARING FOR NEW TEST</InputLabel>
                  <SelectInputStyled
                    data-cy="selectLink"
                    value={
                      testSetting.isLinkSharingEnabled
                        ? get(testSetting, 'linkSharingPermission') || 'VIEW'
                        : 'NO'
                    }
                    onChange={(value) => {
                      this.changeSetting(null, 'linkSharingPermission', value)
                    }}
                    size="large"
                  >
                    {Object.keys(linkSharingPermissions).map((item) => (
                      <Select.Option
                        value={item}
                        key={linkSharingPermissions[item]}
                      >
                        {linkSharingPermissions[item]}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </StyledCol>
                <StyledCol data-cy="allowPartialScore">
                  <InputLabel>Allow Partial Score </InputLabel>
                  <StyledRadioGrp
                    defaultValue={testSetting.partialScore}
                    onChange={(e) => this.changeSetting(e, 'partialScore')}
                    value={testSetting.partialScore}
                  >
                    <RadioBtn value>Yes</RadioBtn>
                    <RadioBtn value={false}>No</RadioBtn>
                  </StyledRadioGrp>
                </StyledCol>
                <StyledCol data-cy="showTimer">
                  <InputLabel>Show Timer </InputLabel>
                  <StyledRadioGrp
                    defaultValue={testSetting.timer}
                    onChange={(e) => this.changeSetting(e, 'timer')}
                    value={testSetting.timer}
                  >
                    <RadioBtn value>Yes</RadioBtn>
                    <RadioBtn value={false}>No</RadioBtn>
                  </StyledRadioGrp>
                </StyledCol>
                <EduIf condition={showEnterpriseSettings}>
                  <StyledCol data-cy="allowAudioResponseType">
                    <InputLabel>
                      ENABLE AUDIO RESPONSE QUESTION TYPE{' '}
                    </InputLabel>
                    <StyledRadioGrp
                      defaultValue={enableAudioResponseQuestions}
                      onChange={(e) =>
                        this.changeSetting(e, 'enableAudioResponseQuestion')
                      }
                      value={enableAudioResponseQuestions}
                    >
                      <RadioBtn value>Yes</RadioBtn>
                      <RadioBtn value={false}>No</RadioBtn>
                    </StyledRadioGrp>
                    <EduIf condition={enableAudioResponseQuestions}>
                      <InputLabel>
                        Student record their voice to respond{' '}
                      </InputLabel>
                    </EduIf>
                  </StyledCol>
                </EduIf>
                <StyledCol data-cy="enableSpeechToText">
                  <InputLabel>
                    ENABLE SPEECH TO TEXT (SCRIBE) ON CONSTRUCTIVE RESPONSE
                    QUESTIONS{' '}
                  </InputLabel>
                  <StyledRadioGrp
                    defaultValue={testSetting.enableSpeechToText}
                    onChange={(e) =>
                      this.changeSetting(e, 'enableSpeechToText')
                    }
                    value={testSetting.enableSpeechToText}
                  >
                    <RadioBtn value>Yes</RadioBtn>
                    <RadioBtn value={false}>No</RadioBtn>
                  </StyledRadioGrp>
                  <EduIf condition={testSetting.enableSpeechToText}>
                    <InputLabel>Student use their voice to respond </InputLabel>
                  </EduIf>
                </StyledCol>
                <EduIf condition={showEnterpriseSettings}>
                  <StyledCol data-cy="canAccessPublicContent">
                    <InputLabel>
                      Allow teachers to access Public Library{' '}
                    </InputLabel>
                    <StyledRadioGrp
                      defaultValue={canAccessPublicContent}
                      onChange={(e) =>
                        this.changeSetting(e, 'canAccessPublicContent')
                      }
                      value={canAccessPublicContent}
                    >
                      <RadioBtn value>Yes</RadioBtn>
                      <RadioBtn value={false}>No</RadioBtn>
                    </StyledRadioGrp>
                  </StyledCol>
                </EduIf>
                <EduIf condition={showEnterpriseSettings}>
                  <StyledCol data-cy="canSchoolAdminUseDistrictCommon">
                    <InputLabel>
                      Allow SA to use District Common Test Type{' '}
                      <Tooltip
                        title={i18translate(
                          'canSchoolAdminUseDistrictCommon.info'
                        )}
                      >
                        <IconInfo
                          color={lightGrey9}
                          style={{ marginLeft: '10px', cursor: 'pointer' }}
                        />
                      </Tooltip>
                    </InputLabel>
                    <StyledRadioGrp
                      defaultValue={canSchoolAdminUseDistrictCommon}
                      onChange={(e) =>
                        this.changeSetting(e, 'canSchoolAdminUseDistrictCommon')
                      }
                      value={canSchoolAdminUseDistrictCommon}
                    >
                      <RadioBtn value>Yes</RadioBtn>
                      <RadioBtn value={false}>No</RadioBtn>
                    </StyledRadioGrp>
                  </StyledCol>
                </EduIf>

                <StyledCol data-cy="editAccommodation">
                  <InputLabel>
                    ALLOW TEACHERS TO CONFIGURE ACCOMMODATIONS{' '}
                    {/* <Tooltip
                      title={i18translate(
                        'canSchoolAdminUseDistrictCommon.info'
                      )}
                    >
                      <IconInfo
                        color={lightGrey9}
                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                      />
                    </Tooltip> */}
                  </InputLabel>
                  <StyledRadioGrp
                    defaultValue={testSetting.editTeacherAccommodation}
                    onChange={(e) =>
                      this.changeSetting(e, 'editTeacherAccommodation')
                    }
                    value={testSetting.editTeacherAccommodation}
                  >
                    {editTeachersAccommodationOptions.map((option) => (
                      <OptionContainer>
                        <RadioBtn value={option.value}>{option.title}</RadioBtn>
                        <Tooltip title={i18translate(option.helperText)}>
                          <IconInfo
                            color={lightGrey9}
                            style={{
                              marginLeft: '-12px',
                              marginRight: '10px',
                              cursor: 'pointer',
                            }}
                          />
                        </Tooltip>
                      </OptionContainer>
                    ))}
                  </StyledRadioGrp>
                </StyledCol>
              </StyledRow>

              <StyledHeading1 data-cy="performanceBandProfiles">
                Default Performance Band Profiles
              </StyledHeading1>
              <StyledRow gutter={40} data-cy="defaultPerformanceBand">
                <StyledCol span={8} data-cy="commonTest">
                  <InputLabel>Common Test</InputLabel>
                  <SelectInputStyled
                    data-cy="commonTestBand"
                    value={get(
                      testSetting,
                      'testTypesProfile.performanceBand.common'
                    )}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'performanceBand',
                        testType: 'common',
                      })
                    }
                    loading={performanceBandLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {performanceBandOptions}
                  </SelectInputStyled>
                </StyledCol>
                <StyledCol span={8} data-cy="classTest">
                  <InputLabel>Class Test</InputLabel>
                  <SelectInputStyled
                    data-cy="classTestBand"
                    value={get(
                      testSetting,
                      'testTypesProfile.performanceBand.assessment'
                    )}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'performanceBand',
                        testType: 'assessment',
                      })
                    }
                    loading={performanceBandLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {performanceBandOptions}
                  </SelectInputStyled>
                </StyledCol>
                <StyledCol span={8} data-cy="practiceHomeworkQuizTest">
                  <InputLabel>Practice Test/ Homework/ Quiz</InputLabel>
                  <SelectInputStyled
                    data-cy="practiceHomeworkQuizTestBand"
                    value={get(
                      testSetting,
                      'testTypesProfile.performanceBand.practice'
                    )}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'performanceBand',
                        testType: 'practice',
                      })
                    }
                    loading={performanceBandLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {performanceBandOptions}
                  </SelectInputStyled>
                </StyledCol>
              </StyledRow>

              <StyledHeading1 data-cy="standardProficiencyProfiles">
                Default Standard Proficiency Profiles
              </StyledHeading1>
              <StyledRow gutter={40} data-cy="defaultStandardProficiency">
                <StyledCol span={8} data-cy="commonTest">
                  <InputLabel>Common Test</InputLabel>
                  <SelectInputStyled
                    data-cy="commonTestBand"
                    value={get(
                      testSetting,
                      'testTypesProfile.standardProficiency.common'
                    )}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'standardProficiency',
                        testType: 'assessment',
                      })
                    }
                    loading={standardsProficiencyLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {standardsProficiencyOptions}
                  </SelectInputStyled>
                </StyledCol>
                <StyledCol span={8} data-cy="classTest">
                  <InputLabel>Class Test</InputLabel>
                  <SelectInputStyled
                    data-cy="classTestBand"
                    value={get(
                      testSetting,
                      'testTypesProfile.standardProficiency.assessment'
                    )}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'standardProficiency',
                        testType: 'assessment',
                      })
                    }
                    loading={standardsProficiencyLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {standardsProficiencyOptions}
                  </SelectInputStyled>
                </StyledCol>
                <StyledCol span={8} data-cy="practiceHomeworkQuizTest">
                  <InputLabel>Practice Test/ Homework/ Quiz</InputLabel>
                  <SelectInputStyled
                    data-cy="practiceHomeworkQuizTestProficiency"
                    value={get(
                      testSetting,
                      'testTypesProfile.standardProficiency.practice'
                    )}
                    loading={standardsProficiencyLoading}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'standardProficiency',
                        testType: 'practice',
                      })
                    }
                    placeholder="select one option"
                    size="large"
                  >
                    {standardsProficiencyOptions}
                  </SelectInputStyled>
                </StyledCol>
              </StyledRow>

              <StyledRow
                type="flex"
                justify="center"
                style={{ marginTop: '15px' }}
              >
                <HeaderSaveButton>
                  <EduButton
                    data-cy="saveButton"
                    isBlue
                    onClick={this.updateValue}
                  >
                    <IconSaveNew /> Save
                  </EduButton>
                </HeaderSaveButton>
              </StyledRow>
            </ContentWrapper>
          </StyledLayout>
        </StyledContent>
      </SettingsWrapper>
    )
  }
}

const enhance = compose(
  withNamespaces('author'),
  connect(
    (state) => ({
      testSetting: get(state, ['testSettingReducer', 'data'], {}),
      loading: get(state, ['testSettingReducer', 'loading'], false),
      updating: get(state, ['testSettingReducer', 'updating'], false),
      creating: get(state, ['testSettingReducer', 'creating'], false),
      standardsProficiencyLoading: get(
        state,
        ['standardsProficiencyReducer', 'loading'],
        false
      ),
      performanceBandLoading: get(
        state,
        ['performanceBandReducer', 'loading'],
        false
      ),
      performanceBandProfiles: get(
        state,
        ['performanceBandReducer', 'profiles'],
        []
      ),
      standardsProficiencyProfiles: get(
        state,
        ['standardsProficiencyReducer', 'data'],
        []
      ),
      userOrgId: getUserOrgId(state),
      role: getUserRole(state),
      schoolId: get(state, 'user.saSettingsSchool'),
      subscription: getSubscriptionSelector(state),
    }),
    {
      loadTestSetting: receiveTestSettingAction,
      createTestSetting: createTestSettingAction,
      updateTestSetting: updateTestSettingAction,
      setTestSettingValue: setTestSettingValueAction,
      loadPerformanceBand: receivePerformanceBandAction,
      loadStandardsProficiency: receiveStandardsProficiencyAction,
      setDefaultProfile: setTestSettingDefaultProfileAction,
    }
  )
)

export default enhance(TestSetting)

TestSetting.propTypes = {
  loadTestSetting: PropTypes.func.isRequired,
  updateTestSetting: PropTypes.func.isRequired,
  createTestSetting: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
}
