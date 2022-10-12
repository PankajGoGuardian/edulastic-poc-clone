import {
  CheckboxLabel,
  RadioBtn,
  notification,
  TextInputStyled,
  EduButton,
} from '@edulastic/common'
import { Form } from 'antd'
import { produce } from 'immer'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { IconSaveNew } from '@edulastic/icons'
import { getUserOrgId, getUserRole } from '../../../src/selectors/user'
// actions
import {
  changeDistrictPolicyAction,
  createDistrictPolicyAction,
  getPolicies,
  receiveDistrictPolicyAction,
  receiveSchoolPolicyAction,
  updateDistrictPolicyAction,
  saveCanvasKeysRequestAction,
  saveOnerosterApiConfigurationAction,
  generateOnerosterLtiKeysAction,
} from '../../ducks'
import ConfigureCanvasModal from './ConfigureCanvasModal'
import ConfigureOnerosterModal from './ConfigureOnerosterModal'
import {
  InputLabel,
  StyledCol,
  StyledHeading1,
  StyledRow,
  HelperText,
  StyledElementDiv,
  StyledFormItem,
  ConfigureButton,
  StyledRadioGrp,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import { HeaderSaveButton } from '../../../../admin/Common/StyledComponents'

const _3RDPARTYINTEGRATION = {
  googleClassroom: 1,
  canvas: 2,
  oneroster: 3,
  none: 4,
}

function validURL(value, allowLargeDomains = false) {
  if (value.length == 0)
    return {
      validateStatus: 'success',
      errorMsg: '',
    }

  let pattern = new RegExp(
    /^[a-zA-Z0-9][a-zA-Z0-9\-.]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+/
  )

  if (allowLargeDomains) {
    pattern = new RegExp(
      /^[a-zA-Z0-9][a-zA-Z0-9\-.]{1,507}[a-zA-Z0-9](?:\.[a-zA-Z0-9]{2,})+/
    )
  }

  const spiltArray = value.split(/[\s,]+/)
  for (let i = 0; i < spiltArray.length; i++) {
    if (!pattern.test(spiltArray[i]) && spiltArray[i].length != 0) {
      return {
        validateStatus: 'error',
        errorMsg: 'Enter allowed domain(s), example - gmail.com, edulastic.com',
      }
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}

class DistrictPolicyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allowDomainForTeacherValidate: {
        validateStatus: 'success',
        errorMsg: '',
      },
      allowDomainForStudentValidate: {
        validateStatus: 'success',
        errorMsg: '',
      },
      allowDomainForSchoolValidate: {
        validateStatus: 'success',
        errorMsg: '',
      },
      allowIpForAssignmentValidate: {
        validateStatus: 'success',
        errorMsg: '',
      },
      showCanvasConfigrationModal: false,
      showOnerosterConfigurationModal: false,
    }
  }

  componentDidMount() {
    const {
      loadDistrictPolicy,
      userOrgId,
      role,
      schoolId,
      loadSchoolPolicy,
    } = this.props
    if (role === 'school-admin') {
      loadSchoolPolicy(schoolId)
    } else {
      loadDistrictPolicy({ orgId: userOrgId, orgType: 'district' })
    }
  }

  componentDidUpdate(prevProps) {
    /**
     * school selection is changed
     */
    const { schoolId, loadSchoolPolicy } = this.props
    if (prevProps.schoolId != schoolId && schoolId) {
      loadSchoolPolicy(schoolId)
    }
  }

  change = (e, keyName) => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props
    const districtPolicyData = { ...districtPolicy }
    districtPolicyData[keyName] = e.target.checked
    changeDistrictPolicyData({
      ...districtPolicyData,
      schoolLevel: role === 'school-admin',
    })
  }

  handleTagTeacherChange = (e) => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props
    const districtPolicyData = { ...districtPolicy }
    this.setState({
      allowDomainForTeacherValidate: {
        ...validURL(e.target.value, true),
      },
    })

    districtPolicyData.allowedDomainForTeachers = e.target.value
    changeDistrictPolicyData({
      ...districtPolicyData,
      schoolLevel: role === 'school-admin',
    })
  }

  handleTagStudentChange = (e) => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props
    const districtPolicyData = { ...districtPolicy }
    this.setState({
      allowDomainForStudentValidate: {
        ...validURL(e.target.value, true),
      },
    })

    districtPolicyData.allowedDomainForStudents = e.target.value
    changeDistrictPolicyData({
      ...districtPolicyData,
      schoolLevel: role === 'school-admin',
    })
  }

  handleTagSchoolChange = (e) => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props
    const districtPolicyData = { ...districtPolicy }
    this.setState({
      allowDomainForSchoolValidate: {
        ...validURL(e.target.value),
      },
    })

    districtPolicyData.allowedDomainsForDistrict = e.target.value
    changeDistrictPolicyData({
      ...districtPolicyData,
      schoolLevel: role === 'school-admin',
    })
  }

  thirdpartyIntegration = (e) => {
    const { districtPolicy, changeDistrictPolicyData, role } = this.props
    const districtPolicyData = { ...districtPolicy }
    // initially make all false and according to target make flag true
    districtPolicyData.googleClassroom = false
    districtPolicyData.canvas = false
    districtPolicyData.oneroster = false
    switch (e.target.value) {
      case 1:
        districtPolicyData.googleClassroom = true
        break
      case 2:
        districtPolicyData.canvas = true
        break
      case 3:
        districtPolicyData.oneroster = true
        break
      default:
        break
    }
    changeDistrictPolicyData({
      ...districtPolicyData,
      schoolLevel: role === 'school-admin',
    })
  }

  disableStudentLogin = (event) => {
    const { districtPolicy = {}, changeDistrictPolicyData, role } = this.props

    const isStudentLoginDisabled = event.target.value

    const nextState = produce(districtPolicy, (draftState) => {
      draftState.disableStudentLogin = isStudentLoginDisabled === 'yes'
    })

    changeDistrictPolicyData({
      ...nextState,
      schoolLevel: role === 'school-admin',
    })
  }

  enableGoogleMeet = (event) => {
    const { districtPolicy = {}, changeDistrictPolicyData, role } = this.props

    const isGoogleMeetEnabled = event.target.value

    const nextState = produce(districtPolicy, (draftState) => {
      draftState.enableGoogleMeet = isGoogleMeetEnabled === 'yes'
    })

    changeDistrictPolicyData({
      ...nextState,
      schoolLevel: role === 'school-admin',
    })
  }

  enforceDistrictSignonPolicy = (e) => {
    const { districtPolicy = {}, changeDistrictPolicyData, role } = this.props

    const { value } = e.target

    const nextState = produce(districtPolicy, (draftState) => {
      draftState.enforceDistrictSignonPolicy = value === 'yes'
    })

    changeDistrictPolicyData({
      ...nextState,
      schoolLevel: role === 'school-admin',
    })
  }

  isValidIp = (ipAddress = '') => {
    const validIpAddressPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))|25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[*0-9])\.(((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])-(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))|25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[*0-9])$/
    return validIpAddressPattern.test(ipAddress) // will return true if valid
  }

  mapIpAddresses = (ipAddressesString = '', checkerror = false) => {
    if (ipAddressesString === '') return []
    return ipAddressesString.split(',').map((ipAddress = '') => {
      const trimmedIpAddress = ipAddress.trim()
      if (checkerror && !this.isValidIp(trimmedIpAddress)) {
        throw new Error('Enter allowed IP(s), example - 128.0.*.1, 187.0.*.*') // will return map with error
      }
      return trimmedIpAddress
    })
  }

  changeAllowIpField = (ipAddresses = []) => {
    const { districtPolicy = {}, changeDistrictPolicyData, role } = this.props

    const nextState = produce(districtPolicy, (draftState) => {
      draftState.allowedIpForAssignments = ipAddresses
    })

    changeDistrictPolicyData({
      ...nextState,
      schoolLevel: role === 'school-admin',
    })
  }

  handleInputIpAddresses = (event) => {
    // ipAddressesString = "127.0.0.1, 192.168.0.1"
    const ipAddressesString = event.target.value
    try {
      // ipAddresses = ["127.0.0.1", "192.168.0.1"]
      const ipAddresses = this.mapIpAddresses(ipAddressesString, true)
      this.setState({
        allowIpForAssignmentValidate: {
          validateStatus: 'success',
          errorMsg: '',
        },
      })
      this.changeAllowIpField(ipAddresses)
    } catch (error) {
      // ipAddresses = ["127.0.0.1", "192.168.0.1"]
      const ipAddresses = this.mapIpAddresses(ipAddressesString, false)
      this.setState({
        allowIpForAssignmentValidate: {
          validateStatus: 'error',
          errorMsg: error.message,
        },
      })
      this.changeAllowIpField(ipAddresses)
    }
  }

  onSave = () => {
    const {
      role,
      schoolId,
      districtPolicy,
      userOrgId,
      updateDistrictPolicy,
      createDistrictPolicy,
    } = this.props
    const isSchoolLevel = role === 'school-admin'
    const districtPolicyData = { ...districtPolicy }
    const {
      allowDomainForTeacherValidate,
      allowDomainForStudentValidate,
      allowDomainForSchoolValidate,
      allowIpForAssignmentValidate,
    } = this.state

    if (
      !districtPolicyData.userNameAndPassword &&
      !districtPolicyData.office365SignOn &&
      !districtPolicyData.cleverSignOn &&
      !districtPolicyData.googleSignOn &&
      !districtPolicyData.atlasSignOn &&
      !districtPolicyData.schoologySignOn
    ) {
      notification({ messageKey: 'pleaseSelectOneOrMoreSignOnParticles' })
      return
    }

    if (
      allowDomainForTeacherValidate.validateStatus === 'error' ||
      allowDomainForStudentValidate.validateStatus === 'error' ||
      allowDomainForSchoolValidate.validateStatus === 'error' ||
      allowIpForAssignmentValidate.validateStatus === 'error'
    ) {
      return
    }

    const updateData = {
      orgId: isSchoolLevel ? schoolId : userOrgId,
      orgType: isSchoolLevel ? 'institution' : 'district',
      userNameAndPassword: districtPolicyData.userNameAndPassword,
      googleSignOn: districtPolicyData.googleSignOn,
      office365SignOn: districtPolicyData.office365SignOn,
      cleverSignOn: districtPolicyData.cleverSignOn,
      atlasSignOn: districtPolicyData.atlasSignOn,
      schoologySignOn: districtPolicyData.schoologySignOn,
      teacherSignUp: districtPolicyData.teacherSignUp,
      studentSignUp: districtPolicyData.studentSignUp,
      searchAndAddStudents: districtPolicyData.searchAndAddStudents || false,
      googleUsernames: districtPolicyData.googleUsernames,
      schoolAdminSettingsAccess: districtPolicyData.schoolAdminSettingsAccess,
      office365Usernames: districtPolicyData.office365Usernames,
      firstNameAndLastName: districtPolicyData.firstNameAndLastName,
      allowedDomainForTeachers: districtPolicyData.allowedDomainForTeachers
        .length
        ? districtPolicyData.allowedDomainForTeachers.split(/[\s,]+/)
        : [],
      allowedDomainForStudents: districtPolicyData.allowedDomainForStudents
        .length
        ? districtPolicyData.allowedDomainForStudents.split(/[\s,]+/)
        : [],
      allowedDomainsForDistrict: districtPolicyData.allowedDomainsForDistrict
        .length
        ? districtPolicyData.allowedDomainsForDistrict.split(/[\s,]+/)
        : [],
      googleClassroom: districtPolicyData.googleClassroom || false,
      canvas: districtPolicyData.canvas || false,
      oneroster: districtPolicyData.oneroster || false,
      allowedIpForAssignments: districtPolicyData.allowedIpForAssignments || [],
      disableStudentLogin: districtPolicyData.disableStudentLogin || false,
      enableGoogleMeet: districtPolicyData.enableGoogleMeet || false,
      enforceDistrictSignonPolicy:
        districtPolicyData.enforceDistrictSignonPolicy || false,
    }
    if (Object.prototype.hasOwnProperty.call(districtPolicyData, '_id')) {
      updateDistrictPolicy(updateData)
    } else {
      createDistrictPolicy(updateData)
    }
  }

  render() {
    const {
      allowDomainForTeacherValidate,
      allowDomainForStudentValidate,
      allowDomainForSchoolValidate,
      allowIpForAssignmentValidate,
      showCanvasConfigrationModal,
      showOnerosterConfigurationModal,
    } = this.state

    const { districtPolicy } = this.props
    const thirdPartyValue = districtPolicy.googleClassroom
      ? _3RDPARTYINTEGRATION.googleClassroom
      : districtPolicy.canvas
      ? _3RDPARTYINTEGRATION.canvas
      : districtPolicy.oneroster
      ? _3RDPARTYINTEGRATION.oneroster
      : _3RDPARTYINTEGRATION.none

    const {
      role,
      saveCanvasKeysRequest,
      saveOnerosterApiConfiguration,
      generateOnerosterLtiKeys,
      user,
    } = this.props
    const isSchoolLevel = role === 'school-admin'

    return (
      <>
        <Form>
          <StyledRow mb="10px" type="flex" justify="space-between">
            <StyledCol mb="10px" sm={24} md={12} xl={6}>
              <StyledHeading1>
                {isSchoolLevel ? 'School' : 'District'} Signon Policy
              </StyledHeading1>
              <StyledElementDiv>
                <CheckboxLabel
                  checked={districtPolicy.userNameAndPassword}
                  onChange={(e) => this.change(e, 'userNameAndPassword')}
                  data-cy="userNameAndPassword"
                >
                  Username and password
                </CheckboxLabel>
                <CheckboxLabel
                  checked={districtPolicy.googleSignOn}
                  onChange={(e) => this.change(e, 'googleSignOn')}
                  data-cy="googleSignOn"
                >
                  Google Single signon
                </CheckboxLabel>
                <CheckboxLabel
                  checked={districtPolicy.office365SignOn}
                  onChange={(e) => this.change(e, 'office365SignOn')}
                  data-cy="office365SignOn"
                >
                  Office365 Single signon
                </CheckboxLabel>
                <CheckboxLabel
                  checked={districtPolicy.atlasSignOn}
                  onChange={(e) => this.change(e, 'atlasSignOn')}
                  data-cy="classlinkSignOn"
                >
                  Classlink Single signon
                </CheckboxLabel>
                <CheckboxLabel
                  checked={districtPolicy.schoologySignOn}
                  onChange={(e) => this.change(e, 'schoologySignOn')}
                  data-cy="schoologySignOn"
                >
                  Schoology Single signon
                </CheckboxLabel>
                <CheckboxLabel
                  checked={districtPolicy.cleverSignOn}
                  onChange={(e) => this.change(e, 'cleverSignOn')}
                  data-cy="cleverSignOn"
                >
                  Clever instance signon
                </CheckboxLabel>
              </StyledElementDiv>
            </StyledCol>
            <StyledCol mb="10px" sm={24} md={12} xl={6}>
              <StyledHeading1>
                {isSchoolLevel ? 'School' : 'District'} Sign-up Policy
              </StyledHeading1>
              <StyledElementDiv>
                <CheckboxLabel
                  checked={districtPolicy.teacherSignUp}
                  onChange={(e) => this.change(e, 'teacherSignUp')}
                  data-cy="teacherSignUp"
                >
                  Allow Teachers to sign-up
                </CheckboxLabel>
                <CheckboxLabel
                  checked={districtPolicy.studentSignUp}
                  onChange={(e) => this.change(e, 'studentSignUp')}
                  data-cy="studentSignUp"
                >
                  Allow Students to sign-up
                </CheckboxLabel>
              </StyledElementDiv>
            </StyledCol>
            <StyledCol mb="10px" sm={24} md={12} xl={6}>
              <StyledHeading1>Student Enrollment Policy</StyledHeading1>
              <StyledElementDiv>
                <CheckboxLabel
                  data-cy="student-enrollment-policy"
                  checked={districtPolicy.searchAndAddStudents}
                  onChange={(e) => this.change(e, 'searchAndAddStudents')}
                >
                  Allow Teachers to search and enroll
                </CheckboxLabel>
              </StyledElementDiv>
            </StyledCol>
            <StyledCol mb="10px" sm={24} md={12} xl={6}>
              <StyledHeading1>Allow student addition with</StyledHeading1>
              <StyledElementDiv>
                <CheckboxLabel
                  checked={districtPolicy.googleUsernames}
                  onChange={(e) => this.change(e, 'googleUsernames')}
                  data-cy="student-googleUsernames"
                >
                  Google Usernames
                </CheckboxLabel>
                <CheckboxLabel
                  checked={districtPolicy.office365Usernames}
                  onChange={(e) => this.change(e, 'office365Usernames')}
                  data-cy="student-office365Usernames"
                >
                  Office 365 Usernames
                </CheckboxLabel>
                <CheckboxLabel
                  checked={districtPolicy.firstNameAndLastName}
                  onChange={(e) => this.change(e, 'firstNameAndLastName')}
                  data-cy="student-firstNameAndLastName"
                >
                  Firstname and Lastname
                </CheckboxLabel>
              </StyledElementDiv>
            </StyledCol>
          </StyledRow>

          {isSchoolLevel ? null : (
            <StyledRow gutter={40} type="flex">
              <StyledCol mt="0px" sm={24} xl={12}>
                <CheckboxLabel
                  data-cy="allow-school-level-admin"
                  checked={districtPolicy.schoolAdminSettingsAccess}
                  onChange={(e) => this.change(e, 'schoolAdminSettingsAccess')}
                >
                  Allow School Level Admin
                </CheckboxLabel>
              </StyledCol>
            </StyledRow>
          )}

          <StyledHeading1>Domains</StyledHeading1>
          <StyledRow gutter={40} type="flex" justify="space-between">
            <StyledCol sm={24} md={12}>
              <InputLabel>Allowed Domain for Teachers</InputLabel>
              <StyledFormItem
                validateStatus={allowDomainForTeacherValidate.validateStatus}
                help={allowDomainForTeacherValidate.errorMsg}
              >
                <TextInputStyled
                  value={districtPolicy.allowedDomainForTeachers}
                  onChange={this.handleTagTeacherChange}
                  limit={512}
                  data-cy="allowed-teachers-domain"
                  placeholder="Enter allowed domain(s), example - gmail.com, edulastic.com"
                />
              </StyledFormItem>
            </StyledCol>
            <StyledCol sm={24} md={12}>
              <InputLabel>Domain for recommending Schools</InputLabel>
              <StyledFormItem
                validateStatus={allowDomainForSchoolValidate.validateStatus}
                help={allowDomainForSchoolValidate.errorMsg}
              >
                <TextInputStyled
                  data-cy="domain-for-recommending-schools"
                  value={districtPolicy.allowedDomainsForDistrict}
                  onChange={this.handleTagSchoolChange}
                  placeholder="Enter allowed domain(s), example - gmail.com, edulastic.com"
                />
              </StyledFormItem>
            </StyledCol>
          </StyledRow>

          <StyledRow gutter={40} type="flex" justify="space-between">
            <StyledCol md={24} xl={12}>
              <InputLabel>Allowed Domain for Students</InputLabel>
              <StyledFormItem
                validateStatus={allowDomainForStudentValidate.validateStatus}
                help={allowDomainForStudentValidate.errorMsg}
              >
                <TextInputStyled
                  value={districtPolicy.allowedDomainForStudents}
                  onChange={this.handleTagStudentChange}
                  limit={512}
                  data-cy="allowed-students-domain"
                  placeholder="Enter allowed domain(s), example - gmail.com, edulastic.com"
                />
              </StyledFormItem>
            </StyledCol>
            <StyledCol md={24} xl={12}>
              <InputLabel>3rd-party integrations</InputLabel>
              <StyledRadioGrp
                onChange={this.thirdpartyIntegration}
                value={thirdPartyValue}
              >
                <RadioBtn mb="10px" value={1} data-cy="googleClassroom">
                  Google Classroom
                </RadioBtn>
                <RadioBtn mb="10px" value={2} data-cy="canvas">
                  <span>Canvas</span>{' '}
                  {isSchoolLevel ? null : (
                    <ConfigureButton
                      onClick={(e) => {
                        e.preventDefault()
                        if (thirdPartyValue === _3RDPARTYINTEGRATION.canvas)
                          this.setState({ showCanvasConfigrationModal: true })
                      }}
                    >
                      (Configure)
                    </ConfigureButton>
                  )}
                </RadioBtn>
                <RadioBtn mb="10px" value={3} data-cy="oneroster">
                  <span>OneRoster</span>{' '}
                  {isSchoolLevel ? null : (
                    <ConfigureButton
                      onClick={(e) => {
                        e.preventDefault()
                        if (thirdPartyValue === _3RDPARTYINTEGRATION.oneroster)
                          this.setState({
                            showOnerosterConfigurationModal: true,
                          })
                      }}
                    >
                      (Configure)
                    </ConfigureButton>
                  )}
                </RadioBtn>
                <RadioBtn mb="10px" value={4} data-cy="none">
                  None
                </RadioBtn>
                {/* None signifies that no 3rd party integration is enabled */}
              </StyledRadioGrp>
            </StyledCol>
          </StyledRow>

          <StyledRow gutter={40} type="flex" justify="space-between">
            <StyledCol sm={24} md={12}>
              <InputLabel>
                Allowed IP for password controlled assessments
              </InputLabel>
              <StyledFormItem
                validateStatus={allowIpForAssignmentValidate.validateStatus}
                help={allowIpForAssignmentValidate.errorMsg}
              >
                <TextInputStyled
                  data-cy="allowedIpForAssignments"
                  value={districtPolicy.allowedIpForAssignments}
                  onChange={this.handleInputIpAddresses}
                  placeholder="Enter allowed ip(s), example - 127.0.*.1, 187.0.*.*"
                />
                <HelperText>
                  Enter allowed IP(s) for controlled assignments. Range allowed
                  eg: 22.32.0-255.0-255. Wild chars allowed eg: 127.0.*.1,
                  187.0.*.* etc.
                </HelperText>
              </StyledFormItem>
            </StyledCol>
            <StyledCol sm={24} md={12}>
              <StyledRow mb="0" gutter={40} type="flex">
                <StyledCol mt="0px">
                  <InputLabel>Disable Student Login</InputLabel>
                  <StyledRadioGrp
                    onChange={this.disableStudentLogin}
                    value={districtPolicy?.disableStudentLogin ? 'yes' : 'no'}
                  >
                    <RadioBtn data-cy="disableStudentLogin-yes" value="yes">
                      Yes
                    </RadioBtn>
                    <RadioBtn data-cy="disableStudentLogin-no" value="no">
                      No
                    </RadioBtn>
                  </StyledRadioGrp>
                </StyledCol>
                <StyledCol mt="0px">
                  <InputLabel>Enable Google Meet</InputLabel>
                  <StyledRadioGrp
                    onChange={this.enableGoogleMeet}
                    value={
                      districtPolicy?.enableGoogleMeet === true ? 'yes' : 'no'
                    }
                  >
                    <RadioBtn data-cy="enableGoogleMeet-yes" value="yes">
                      Yes
                    </RadioBtn>
                    <RadioBtn data-cy="enableGoogleMeet-no" value="no">
                      No
                    </RadioBtn>
                  </StyledRadioGrp>
                </StyledCol>
              </StyledRow>
            </StyledCol>
          </StyledRow>

          <StyledRow gutter={40} type="flex">
            <StyledCol sm={24} md={12}>
              <InputLabel>Enforced District Sign-On policy</InputLabel>
              <StyledRadioGrp
                onChange={this.enforceDistrictSignonPolicy}
                value={
                  districtPolicy?.enforceDistrictSignonPolicy ? 'yes' : 'no'
                }
              >
                <RadioBtn data-cy="enforceDistrictSignonPolicy-yes" value="yes">
                  Yes
                </RadioBtn>
                <RadioBtn data-cy="enforceDistrictSignonPolicy-no" value="no">
                  No
                </RadioBtn>
              </StyledRadioGrp>
            </StyledCol>
          </StyledRow>

          <HeaderSaveButton>
            <EduButton data-cy="save-settings" isBlue onClick={this.onSave}>
              <IconSaveNew /> Save
            </EduButton>
          </HeaderSaveButton>
        </Form>

        {showCanvasConfigrationModal && (
          <ConfigureCanvasModal
            visible={showCanvasConfigrationModal}
            handleCancel={() => {
              this.setState({ showCanvasConfigrationModal: false })
            }}
            districtPolicyId={districtPolicy._id}
            orgType={districtPolicy.orgType}
            orgId={districtPolicy.orgId}
            saveCanvasKeysRequest={saveCanvasKeysRequest}
            canvasConsumerKey={districtPolicy.canvasConsumerKey}
            canvasInstanceUrl={districtPolicy.canvasInstanceUrl}
            canvasSharedSecret={districtPolicy.canvasSharedSecret}
            lti={districtPolicy.lti}
            user={user}
          />
        )}
        {showOnerosterConfigurationModal && (
          <ConfigureOnerosterModal
            visible={showOnerosterConfigurationModal}
            handleCancel={() => {
              this.setState({ showOnerosterConfigurationModal: false })
            }}
            districtPolicyId={districtPolicy._id}
            orgType={districtPolicy.orgType}
            orgId={districtPolicy.orgId}
            saveOnerosterApiConfiguration={saveOnerosterApiConfiguration}
            generateOnerosterLtiKeys={generateOnerosterLtiKeys}
            oneRosterBaseUrl={districtPolicy.oneRosterBaseUrl}
            oneRosterClientId={districtPolicy.oneRosterClientId}
            oneRosterSecretKey={districtPolicy.oneRosterSecretKey}
            oneRosterTokenUrl={districtPolicy.oneRosterTokenUrl}
            rosterOAuthConsumerKey={districtPolicy.rosterOAuthConsumerKey}
            rosterOAuthConsumerSecret={districtPolicy.rosterOAuthConsumerSecret}
          />
        )}
      </>
    )
  }
}

const enhance = compose(
  connect(
    (state) => ({
      districtPolicy: getPolicies(state),
      userOrgId: getUserOrgId(state),
      role: getUserRole(state),
      schoolId: get(state, 'user.saSettingsSchool'),
      user: get(state, 'user.user'),
    }),
    {
      loadDistrictPolicy: receiveDistrictPolicyAction,
      updateDistrictPolicy: updateDistrictPolicyAction,
      createDistrictPolicy: createDistrictPolicyAction,
      changeDistrictPolicyData: changeDistrictPolicyAction,
      loadSchoolPolicy: receiveSchoolPolicyAction,
      saveCanvasKeysRequest: saveCanvasKeysRequestAction,
      saveOnerosterApiConfiguration: saveOnerosterApiConfigurationAction,
      generateOnerosterLtiKeys: generateOnerosterLtiKeysAction,
    }
  )
)

export default enhance(DistrictPolicyForm)

DistrictPolicyForm.propTypes = {
  loadDistrictPolicy: PropTypes.func.isRequired,
  updateDistrictPolicy: PropTypes.func.isRequired,
  createDistrictPolicy: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
}
