import {
  EduButton,
  FieldLabel,
  RadioBtn,
  RadioGrp,
  SelectInputStyled,
} from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { Col, Row, Select } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { receivePerformanceBandAction } from '../../../PerformanceBand/ducks'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import SaSchoolSelect from '../../../src/components/common/SaSchoolSelect'
import { getUserOrgId, getUserRole } from '../../../src/selectors/user'
import { receiveStandardsProficiencyAction } from '../../../StandardsProficiency/ducks'
// actions
import {
  createTestSettingAction,
  receiveTestSettingAction,
  setTestSettingDefaultProfileAction,
  setTestSettingValueAction,
  updateTestSettingAction,
} from '../../ducks'
import {
  SpinContainer,
  StyledContent,
  StyledLabel,
  StyledLayout,
  StyledRow,
  StyledSpin,
  TestSettingDiv,
} from './styled'

const title = 'Manage District'
const menuActive = { mainMenu: 'Settings', subMenu: 'Test Settings' }

class TestSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      testSetting: {
        partialScore: true,
        timer: true,
        isLinkSharingEnabled: false,
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
        },
      }
    }
    return { testSetting: nextProps.testSetting }
  }

  changeSetting = (e, fieldName) => {
    const { testSetting } = this.state
    const { setTestSettingValue, role } = this.props
    setTestSettingValue(
      { ...testSetting, [fieldName]: e.target.value },
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
    } = this.props

    const { testSetting } = this.state
    const btnSaveStr = 'Save'

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

    return (
      <TestSettingDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout
            loading={updating || loading || creating ? 'true' : 'false'}
          >
            <AdminSubHeader active={menuActive} history={history} />
            {(updating || loading || creating) && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <SaSchoolSelect />
            <StyledRow>
              <>
                <StyledLabel>Allow Partial Score </StyledLabel>
                <RadioGrp
                  defaultValue={testSetting.partialScore}
                  onChange={(e) => this.changeSetting(e, 'partialScore')}
                  value={testSetting.partialScore}
                >
                  <RadioBtn value>Yes</RadioBtn>
                  <RadioBtn value={false}>No</RadioBtn>
                </RadioGrp>
              </>
            </StyledRow>
            <StyledRow>
              <>
                <StyledLabel>Show Timer </StyledLabel>
                <RadioGrp
                  defaultValue={testSetting.timer}
                  onChange={(e) => this.changeSetting(e, 'timer')}
                  value={testSetting.timer}
                >
                  <RadioBtn value>Yes</RadioBtn>
                  <RadioBtn value={false}>No</RadioBtn>
                </RadioGrp>
              </>
            </StyledRow>
            <StyledRow>
              <>
                <StyledLabel>Set Link Sharing ON for new test </StyledLabel>
                <RadioGrp
                  onChange={(e) =>
                    this.changeSetting(e, 'isLinkSharingEnabled')
                  }
                  value={!!testSetting.isLinkSharingEnabled}
                >
                  <RadioBtn value>Yes</RadioBtn>
                  <RadioBtn value={false}>No</RadioBtn>
                </RadioGrp>
              </>
            </StyledRow>
            <StyledRow>
              <>
                <StyledLabel>
                  Default Performance Band <br /> Profiles{' '}
                </StyledLabel>
              </>
              <FlexingRow gutter={20}>
                <Col span={8}>
                  <FieldLabel>Common Test</FieldLabel>
                  <SelectInputStyled
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
                </Col>
                <Col span={8}>
                  <FieldLabel>Class Test</FieldLabel>
                  <SelectInputStyled
                    value={get(
                      testSetting,
                      'testTypesProfile.performanceBand.class'
                    )}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'performanceBand',
                        testType: 'class',
                      })
                    }
                    loading={performanceBandLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {performanceBandOptions}
                  </SelectInputStyled>
                </Col>
                <Col span={8}>
                  <FieldLabel>Practice Test</FieldLabel>
                  <SelectInputStyled
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
                </Col>
              </FlexingRow>
            </StyledRow>
            <StyledRow>
              <>
                <StyledLabel>
                  Default Standard Proficiency <br /> Profiles{' '}
                </StyledLabel>
              </>
              <FlexingRow gutter={20}>
                <Col span={8}>
                  <FieldLabel>Common Test</FieldLabel>
                  <SelectInputStyled
                    value={get(
                      testSetting,
                      'testTypesProfile.standardProficiency.common'
                    )}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'standardProficiency',
                        testType: 'common',
                      })
                    }
                    loading={standardsProficiencyLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {standardsProficiencyOptions}
                  </SelectInputStyled>
                </Col>
                <Col span={8}>
                  <FieldLabel>Class Test</FieldLabel>
                  <SelectInputStyled
                    value={get(
                      testSetting,
                      'testTypesProfile.standardProficiency.class'
                    )}
                    onChange={(value) =>
                      setDefaultProfile({
                        value,
                        profileType: 'standardProficiency',
                        testType: 'class',
                      })
                    }
                    loading={standardsProficiencyLoading}
                    placeholder="select one option"
                    size="large"
                  >
                    {standardsProficiencyOptions}
                  </SelectInputStyled>
                </Col>
                <Col span={8}>
                  <FieldLabel>Practice Test</FieldLabel>
                  <SelectInputStyled
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
                </Col>
              </FlexingRow>
            </StyledRow>

            <StyledRow
              type="flex"
              justify="center"
              style={{ marginTop: '15px' }}
            >
              <EduButton type="primary" onClick={this.updateValue}>
                {btnSaveStr}
              </EduButton>
            </StyledRow>
          </StyledLayout>
        </StyledContent>
      </TestSettingDiv>
    )
  }
}

const enhance = compose(
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

const FlexingRow = styled(Row)`
  flex: 1 1;
`

export default enhance(TestSetting)

TestSetting.propTypes = {
  loadTestSetting: PropTypes.func.isRequired,
  updateTestSetting: PropTypes.func.isRequired,
  createTestSetting: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
}
