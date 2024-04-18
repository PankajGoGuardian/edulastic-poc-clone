import { userApi } from '@edulastic/api'
import {
  backgrounds,
  borders,
  desktopWidth,
  largeDesktopWidth,
  mobileWidthLarge,
  mobileWidthMax,
  red,
  themeColor,
  title,
  white,
  extraDesktopWidthMax,
  themeColorBlue,
  themeColorHoverBlue,
  fieldRequiredColor2,
} from '@edulastic/colors'
import {
  FieldLabel,
  MainContentWrapper,
  SelectInputStyled,
  EduButton,
  EduSwitchStyled,
} from '@edulastic/common'
import { signupStateBykey } from '@edulastic/constants/const/signUpState'
import { withNamespaces } from '@edulastic/localization'
import { Form, Icon, Input, Select, Tag, Modal } from 'antd'
import produce from 'immer'
import { isEqual, map, omit, get, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { roleuser } from '@edulastic/constants'
import {
  deleteAccountAction,
  removeInterestedCurriculumsAction,
  removeSchoolAction,
  resetMyPasswordAction,
  updateDefaultSettingsAction,
  updateInterestedCurriculumsAction,
  updateUserDetailsAction,
  showJoinSchoolAction,
  hideJoinSchoolAction,
  updatePowerTeacherAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
  isSignupUsingUNAndPassSelector,
  setIsUserOnProfilePageAction,
} from '../../../../student/Login/ducks'
import { Wrapper } from '../../../../student/styled/index'
import StandardSetModal from '../../../InterestedStandards/components/StandardSetsModal/StandardSetsModal'
import { getDictCurriculumsAction } from '../../../src/actions/dictionaries'
import { getCurriculumsListSelector } from '../../../src/selectors/dictionaries'
import DeleteAccountModal from '../DeleteAccountModal/DeleteAccountModal'
import DeleteSchoolModal from '../DeleteSchoolModal/DeleteSchoolModal'
import EmailConfirmModal from '../EmailConfirmModal/EmailConfirmModal'
import Photo from './Photo'
import { selectsData } from '../../../TestPage/components/common'
import JoinSchool from '../../../../student/Signup/components/TeacherContainer/JoinSchool'
import {
  getInterestedCurriculumsByOrgType,
  getUserOrg,
  getOrgSchools,
  getOrgGroupList,
  getCleverLibraryUserSelector,
} from '../../../src/selectors/user'
import { validateEmail } from '../../../../common/utils/helpers'
import { setShowJoinSchoolModalAction } from '../../../Dashboard/ducks'
import { StyledRequired } from '../../../AssessmentCreate/components/CreateAITest/styled'

const { ORG_TYPE } = roleuser

const FormItem = Form.Item
class ProfileBody extends React.Component {
  state = {
    confirmDirty: false,
    showChangePassword: false,
    isEditProfile: false,
    showModal: false,
    selectedSchool: null,
    showDeleteSchoolModal: false,
    showStandardSetsModal: false,
    showEmailConfirmModal: false,
    showSaveStandSetsBtn: false,
    interestedCurriculums: [],
    defaultGrades: [],
    defaultSubjects: [],
    autoShareGCAssignment: undefined,
  }

  static getDerivedStateFromProps(props, state) {
    const { autoShareGCAssignment } = props.user.orgData
    const { interestedCurriculums } = props
    const derivedStateProps = {}
    if (state.autoShareGCAssignment === undefined) {
      Object.assign(derivedStateProps, { autoShareGCAssignment })
    }
    if (
      !state.showSaveStandSetsBtn &&
      !isEqual(interestedCurriculums, state.interestedCurriculums)
    ) {
      Object.assign(derivedStateProps, { interestedCurriculums })
    }
    return Object.keys(derivedStateProps).length ? derivedStateProps : null
  }

  componentDidMount() {
    const { user } = this.props
    const { defaultGrades: userGrades, defaultSubjects: userSubjects } = get(
      user,
      'orgData'
    )
    this.setState({ defaultGrades: userGrades, defaultSubjects: userSubjects })
  }

  handleSubmit = (e) => {
    const { form, user } = this.props
    const { showChangePassword, isEditProfile } = this.state
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const isnotNormalLogin =
          !!user.googleId ||
          !!user.canvasId ||
          !!user.cliId ||
          !!user.cleverId ||
          !!user.msoId

        if (
          isnotNormalLogin ||
          (isEditProfile && values.email === user.email) ||
          (!isEditProfile && showChangePassword)
        ) {
          this.handleUpdateDetails(false)
        } else {
          this.setState({ showEmailConfirmModal: true })
        }
      }
    })
  }

  handleChangeEmail = () => {
    this.handleUpdateDetails(true)
  }

  handleUpdateDetails(isLogout) {
    const {
      form: { getFieldValue },
      user,
      updateUserDetails,
      userInfo: { currentSignUpState },
      userOrg: { districtId } = {},
    } = this.props
    const { showChangePassword, isEditProfile } = this.state
    const isnotNormalLogin =
      !!user.googleId ||
      !!user.canvasId ||
      !!user.cliId ||
      !!user.cleverId ||
      !!user.msoId
    // in case of author only one districtId will exist
    const data = {
      districtId,
      email:
        isEditProfile && !isnotNormalLogin
          ? getFieldValue('email')
          : user.email,
      firstName: isEditProfile ? getFieldValue('firstName') : user.firstName,
      lastName: isEditProfile ? getFieldValue('lastName') : user.lastName,
      title: isEditProfile ? getFieldValue('title') : user.title,
      currentSignUpState: signupStateBykey[currentSignUpState],
    }
    if (showChangePassword) data.password = getFieldValue('password')

    updateUserDetails({
      data,
      userId: user._id,
      isLogout,
    })
    this.setState({
      showEmailConfirmModal: false,
      isEditProfile: false,
      showChangePassword: false,
    })
  }

  handleCancel = (e) => {
    e.preventDefault()
    this.setState({ isEditProfile: false, showChangePassword: false })
  }

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state
    confirmDirty = confirmDirty || !!value
    this.setState({ confirmDirty })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form, t } = this.props
    if (value && value.length < 4)
      callback(t('common.title.confirmPasswordLengthErrorMessage'))
    else if (value && value !== form.getFieldValue('password'))
      callback(t('common.title.confirmPasswordMess'))
    else callback()
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form, t } = this.props
    const { confirmDirty } = this.state
    if (value && confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true })
    }
    if (value && value.length < 4)
      callback(t('common.title.passwordLengthErrorMessage'))
    callback()
  }

  toggleModal = (modalType, value) => {
    if (modalType === 'DELETE_ACCOUNT') this.setState({ showModal: value })
    else if (modalType === 'REMOVE_SCHOOL')
      this.setState({ showDeleteSchoolModal: value, selectedSchool: null })
    else if (modalType === 'EMAIL_CONFIRM')
      this.setState({ showEmailConfirmModal: false, isEditProfile: false })
  }

  hideMyStandardSetsModal = () => {
    this.setState({ showStandardSetsModal: false })
  }

  updateMyStandardSets = (updatedStandards) => {
    const { curriculums, updateInterestedCurriculums, user } = this.props
    const { role } = user

    const curriculumsData = []
    for (let i = 0; i < updatedStandards.length; i++) {
      const selStandards = curriculums.filter(
        (item) => item.curriculum === updatedStandards[i]
      )
      curriculumsData.push({
        _id: selStandards[0]._id,
        name: selStandards[0].curriculum,
        subject: selStandards[0].subject,
        grades: selStandards[0].grades,
      })
    }
    const orgType =
      role === roleuser.DISTRICT_ADMIN
        ? ORG_TYPE.DISTRICT_ADMIN
        : role === roleuser.SCHOOL_ADMIN
        ? ORG_TYPE.SCHOOL_ADMIN
        : ORG_TYPE.TEACHER
    const standardsData = {
      orgId: user._id,
      orgType,
      curriculums: curriculumsData,
    }

    updateInterestedCurriculums(standardsData)
    this.hideMyStandardSetsModal()
  }

  saveSettings = () => {
    const { updateDefaultSettings, user } = this.props
    const {
      defaultGrades,
      defaultSubjects,
      autoShareGCAssignment,
      isPowerTeacher,
    } = this.state
    const { role } = user

    const orgType =
      role === roleuser.DISTRICT_ADMIN
        ? ORG_TYPE.DISTRICT_ADMIN
        : role === roleuser.SCHOOL_ADMIN
        ? ORG_TYPE.SCHOOL_ADMIN
        : ORG_TYPE.TEACHER
    let settingsToUpdate = {
      orgId: user._id,
      orgType,
      autoShareGCAssignment,
      isPowerTeacher,
    }

    if (!isEmpty(defaultSubjects)) {
      settingsToUpdate = { ...settingsToUpdate, defaultSubjects }
    }

    if (!isEmpty(defaultGrades)) {
      settingsToUpdate = { ...settingsToUpdate, defaultGrades }
    }

    updateDefaultSettings(settingsToUpdate)
  }

  onSettingChange = (value, field) => {
    switch (field) {
      case 'grade': {
        this.setState({ defaultGrades: value })
        break
      }
      case 'subject': {
        this.setState({ defaultSubjects: value })
        break
      }
      case 'autoSync': {
        this.setState({ autoShareGCAssignment: value })
        break
      }
      default:
        break
    }
  }

  handleSaveStandardSets = () => {
    const { updateInterestedCurriculums, user } = this.props
    const { interestedCurriculums } = this.state
    const { role } = user

    const updatedInterestedCurriculums = map(interestedCurriculums, (obj) =>
      omit(obj, ['orgType'])
    )
    const orgType =
      role === roleuser.DISTRICT_ADMIN
        ? ORG_TYPE.DISTRICT_ADMIN
        : role === roleuser.SCHOOL_ADMIN
        ? ORG_TYPE.SCHOOL_ADMIN
        : ORG_TYPE.TEACHER
    const standardsData = {
      orgId: user._id,
      orgType,
      curriculums: updatedInterestedCurriculums,
    }

    updateInterestedCurriculums(standardsData)
    this.setState({ showSaveStandSetsBtn: false })
  }

  removeStandardSet = (id) => {
    this.setState({ showSaveStandSetsBtn: true })

    const updatedState = produce(this.state, (draft) => {
      draft.interestedCurriculums = draft.interestedCurriculums.filter(
        (e) => e._id != id
      )
    })

    const updatedInterestedCurriculums = updatedState.interestedCurriculums
    this.setState({ interestedCurriculums: updatedInterestedCurriculums })
  }

  deleteProfile = () => {
    const { deleteAccount, user } = this.props
    this.toggleModal('DELETE_ACCOUNT', false)
    deleteAccount(user._id)
  }

  getSchoolList = () => {
    const { orgSchools } = this.props
    const schools = orgSchools.map((school) => (
      <StyledTag id={school._id}>
        {school.name}
        <Icon
          type="close"
          onClick={() => {
            if (orgSchools.length > 1)
              this.setState({
                selectedSchool: school,
                showDeleteSchoolModal: true,
              })
          }}
        />
      </StyledTag>
    ))
    return schools
  }

  getStandardSets = () => {
    const { interestedCurriculums } = this.state
    // remove duplicate objects with same name
    const targetInterestedCurriculums = interestedCurriculums.filter(
      (v, i, a) => a.findIndex((t) => t.name === v.name) === i
    )

    const curriculums = targetInterestedCurriculums.map((curriculum) => (
      <StyledTag id={curriculum._id}>
        {curriculum.name}
        <Icon
          type="close"
          onClick={() => this.removeStandardSet(curriculum._id)}
        />
      </StyledTag>
    ))
    return curriculums
  }

  handleRemoveSchool = () => {
    const { selectedSchool } = this.state
    const { removeSchool, user } = this.props
    removeSchool({
      userId: user._id,
      schoolId: selectedSchool._id,
    })
    this.toggleModal('REMOVE_SCHOOL', false)
  }

  handleShowVerifyModal = () => {
    const { toggleVerifyEmailModal, setIsUserOnProfilePage } = this.props
    // set the flag variable
    setIsUserOnProfilePage(true)
    toggleVerifyEmailModal(true)
  }

  handleSelectStandardButton = () => {
    const { getDictCurriculums } = this.props
    getDictCurriculums()
    this.setState({ showStandardSetsModal: true })
  }

  handleAddSchool = () => {
    const { userInfo, showJoinSchool, setShowJoinSchoolModal } = this.props
    if (
      !isEmpty(userInfo.orgData?.districtIds) &&
      !isEmpty(userInfo.orgData?.schools)
    ) {
      showJoinSchool()
    } else {
      setShowJoinSchoolModal(true)
    }
  }

  handlePowerTeacherUpdate = (checked) => {
    const { updatePowerTeacher, user } = this.props
    const { role, email, username } = user
    const params = {}
    if ([roleuser.SCHOOL_ADMIN, roleuser.DISTRICT_ADMIN].includes(role)) {
      params.usernames = [email || username]
      params.enable = checked
    }
    updatePowerTeacher(params)
  }

  checkUser = async (rule, value, callback) => {
    const { user, t, userOrg: { districtId } = {} } = this.props
    if (value !== user.email) {
      const containsWhiteSpace = !new RegExp(/^\S*$/).test(value)
      if (
        (value.length && !validateEmail(value.toLowerCase())) ||
        containsWhiteSpace
      ) {
        callback(t('common.title.invalidEmailMessage'))
      } else {
        const result = await userApi.checkUser({
          username: value,
          districtId,
          role: user.role,
        })

        if (result.length > 0) {
          callback(t('common.title.emailAlreadyExistsMessage'))
        } else {
          callback()
        }
      }
    }
    callback()
  }

  getEditProfileContent = () => {
    const {
      t,
      user,
      form: { getFieldDecorator },
    } = this.props
    return (
      <Details>
        <DetailRow padding="15px 0px">
          <DetailTitle>{t('common.title.userTitleLabel')}</DetailTitle>
          <DetailData>
            <InputItemWrapper>
              {getFieldDecorator('title', {
                initialValue: user.title,
              })(
                <TitleSelect>
                  <Select.Option value="Mr.">Mr.</Select.Option>
                  <Select.Option value="Mrs.">Mrs.</Select.Option>
                  <Select.Option value="Ms.">Ms.</Select.Option>
                  <Select.Option value="Dr.">Dr.</Select.Option>
                </TitleSelect>
              )}
            </InputItemWrapper>{' '}
          </DetailData>
        </DetailRow>
        <DetailRow padding="15px 0px">
          <DetailTitle>{t('common.title.firstNameInputLabel')}</DetailTitle>
          <DetailData>
            <InputItemWrapper>
              {getFieldDecorator('firstName', {
                initialValue: user.firstName,
                rules: [
                  {
                    required: true,
                    message: t('common.title.firstName'),
                  },
                ],
              })(<Input type="text" />)}
            </InputItemWrapper>{' '}
          </DetailData>
        </DetailRow>
        <DetailRow padding="15px 0px">
          <DetailTitle>{t('common.title.lastNameInputLabel')}</DetailTitle>
          <DetailData>
            <InputItemWrapper>
              {getFieldDecorator('lastName', {
                initialValue: user.lastName,
              })(<Input type="text" />)}
            </InputItemWrapper>{' '}
          </DetailData>
        </DetailRow>
        <DetailRow>
          <DetailTitle>{t('common.title.emailUsernameLabel')}</DetailTitle>
          {user.googleId ||
          user.canvasId ||
          user.cliId ||
          user.cleverId ||
          !!user.msoId ? (
            <DetailData>{user.email}</DetailData>
          ) : (
            <DetailData>
              <InputItemWrapper>
                {getFieldDecorator('email', {
                  initialValue: user.email,
                  rules: [
                    { validator: this.checkUser },
                    {
                      required: true,
                      message: t('common.title.invalidEmailMessage'),
                    },
                    { max: 256, message: t('common.title.emailLengthMessage') },
                  ],
                })(<Input type="text" />)}
              </InputItemWrapper>{' '}
            </DetailData>
          )}
        </DetailRow>
      </Details>
    )
  }

  AdminProfileContent = () => {
    const { t, user } = this.props
    return (
      <ProfileContentWrapper>
        <UserDetail>
          <SubHeader>
            <Title>Edulastic Admin Information</Title>
          </SubHeader>
          <Details>
            <DetailRow>
              <DetailTitle>{t('common.title.userTitleLabel')}</DetailTitle>
              <DetailData>{user.title || 'Title'}</DetailData>
            </DetailRow>
            <DetailRow>
              <DetailTitle>{t('common.title.firstNameInputLabel')}</DetailTitle>
              <DetailData>{user.firstName}</DetailData>
            </DetailRow>
            <DetailRow>
              <DetailTitle>{t('common.title.lastNameInputLabel')}</DetailTitle>
              <DetailData>{user.lastName || ''}</DetailData>
            </DetailRow>
            <DetailRow>
              <DetailTitle>{t('common.title.emailUsernameLabel')}</DetailTitle>
              <DetailData>{user.email}</DetailData>
            </DetailRow>
          </Details>
        </UserDetail>
      </ProfileContentWrapper>
    )
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props

    const {
      flag,
      t,
      user,
      curriculums,
      userInfo,
      joinSchoolVisible,
      hideJoinSchool,
      userOrg,
      orgGroupList,
      isCleverLibraryUser,
      emailVerified,
      verificationTS,
      isDefaultDA,
      isSignupUsingUNAndPass,
      isDataOpsOnlyUser,
    } = this.props
    const {
      showChangePassword,
      isEditProfile,
      showModal,
      selectedSchool,
      showDeleteSchoolModal,
      showStandardSetsModal,
      showEmailConfirmModal,
      showSaveStandSetsBtn,
      defaultGrades = [],
      defaultSubjects = [],
      autoShareGCAssignment = false,
      interestedCurriculums,
    } = this.state
    // checking if institution policy/ district policy is enabled
    // OR teacher with home school and having any google sync classroom
    const institutionPolicies = get(user, 'orgData.policies.institutions', [])
    const googleClassRoomAllowed =
      (institutionPolicies.length
        ? !!institutionPolicies.filter((p) => p.allowGoogleClassroom).length
        : get(user, 'orgData.policies.district.allowGoogleClassroom', false)) ||
      (userOrg?.districtStatus === 2 &&
        !!orgGroupList.filter((c) => !!c.googleId).length)
    const interestedStaData = {
      curriculums: interestedCurriculums,
    }
    const { features, role } = user
    const {
      defaultGrades: userGrades,
      defaultSubjects: userSubjects,
      autoShareGCAssignment: userAutoShareGCAssignment,
    } = get(user, 'orgData')
    let showPowerTools = false
    const showDefaultSettingSave =
      !!defaultGrades?.length &&
      !!defaultSubjects?.length &&
      (!isEqual(userGrades, defaultGrades) ||
        !isEqual(userSubjects, defaultSubjects) ||
        !isEqual(userAutoShareGCAssignment, autoShareGCAssignment))

    if (
      [
        roleuser.TEACHER,
        roleuser.DISTRICT_ADMIN,
        roleuser.SCHOOL_ADMIN,
      ].includes(role) &&
      !features.isPublisherAuthor &&
      !features.isCurator &&
      features.premium
    ) {
      showPowerTools = true
    }
    const showDefaultSettings =
      [
        roleuser.TEACHER,
        roleuser.DISTRICT_ADMIN,
        roleuser.SCHOOL_ADMIN,
      ].includes(role) && !isDataOpsOnlyUser
    return (
      <MainContentWrapper padding="30px" flag={flag}>
        <ProfileWrapper display="flex" boxShadow="none" minHeight="max-content">
          <ProfileImgWrapper>
            <Photo user={user} isProfile />
          </ProfileImgWrapper>
          <RightContainer>
            {user.role.toUpperCase() === 'EDULASTIC-ADMIN' ? (
              this.AdminProfileContent()
            ) : (
              <ProfileContentWrapper>
                <UserDetail>
                  <SubHeader>
                    <Title>Instructor Information</Title>
                    {!isEditProfile &&
                    !isDefaultDA &&
                    [
                      roleuser.TEACHER,
                      roleuser.DISTRICT_ADMIN,
                      roleuser.SCHOOL_ADMIN,
                      roleuser.DISTRICT_GROUP_ADMIN,
                    ].includes(user.role) ? (
                      <>
                        <EditProfileButton
                          data-cy="editMyProfile"
                          isGhost
                          type="primary"
                          onClick={() => {
                            this.setState({ isEditProfile: true })
                          }}
                        >
                          <Icon type="edit" theme="filled" />
                          {t('common.title.editProfile')}
                        </EditProfileButton>
                        {!(
                          user.atlasId ||
                          (user.cleverId && !isCleverLibraryUser)
                        ) && (
                          <DeleteAccountButton
                            isGhost
                            noHover
                            onClick={() => {
                              this.setState({ showModal: true })
                            }}
                          >
                            <Icon type="close" />
                            {t('common.title.deleteAccount')}
                          </DeleteAccountButton>
                        )}
                      </>
                    ) : null}
                  </SubHeader>
                  {!isEditProfile ? (
                    <Details>
                      <DetailRow>
                        <DetailTitle>
                          {t('common.title.userTitleLabel')}
                        </DetailTitle>
                        <DetailData>{user.title || 'Title'}</DetailData>
                      </DetailRow>
                      <DetailRow>
                        <DetailTitle>
                          {t('common.title.firstNameInputLabel')}
                        </DetailTitle>
                        <DetailData>{user.firstName}</DetailData>
                      </DetailRow>
                      <DetailRow>
                        <DetailTitle>
                          {t('common.title.middleNameInputLabel')}
                        </DetailTitle>
                        <DetailData>{user.middleName || ''}</DetailData>
                      </DetailRow>
                      <DetailRow>
                        <DetailTitle>
                          {t('common.title.lastNameInputLabel')}
                        </DetailTitle>
                        <DetailData>{user.lastName || ''}</DetailData>
                      </DetailRow>
                      <DetailRow>
                        <DetailTitle>
                          {t('common.title.emailUsernameLabel')}
                        </DetailTitle>
                        <DetailData>
                          {user.email}{' '}
                          {!emailVerified &&
                          (verificationTS || isSignupUsingUNAndPass) &&
                          !isDefaultDA ? (
                            <VerifyEmailSpan>
                              (Email Not Verified.{' '}
                              <span onClick={this.handleShowVerifyModal}>
                                Verify Now!
                              </span>
                              )
                            </VerifyEmailSpan>
                          ) : (
                            ''
                          )}
                        </DetailData>
                      </DetailRow>
                    </Details>
                  ) : (
                    this.getEditProfileContent()
                  )}
                </UserDetail>
                {user.role === 'edulastic-curator' || isDefaultDA ? null : (
                  <ChangePasswordToggleButton
                    onClick={() => {
                      this.setState({ showChangePassword: !showChangePassword })
                    }}
                    data-cy="changePassword"
                  >
                    <span>Change Password</span>
                    <Icon
                      type={showChangePassword ? 'caret-up' : 'caret-down'}
                    />
                  </ChangePasswordToggleButton>
                )}

                {showChangePassword && (
                  <FormWrapper>
                    <FormItemWrapper>
                      <Label>{t('common.title.newPasswordLabel')}</Label>
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true,
                            message: t('common.title.password'),
                          },
                          {
                            validator: this.validateToNextPassword,
                          },
                        ],
                      })(<Input type="password" autoComplete="off" />)}
                    </FormItemWrapper>{' '}
                    <FormItemWrapper>
                      <Label>{t('common.title.confirmPaswswordLabel')}</Label>
                      {getFieldDecorator('confirmPassword', {
                        rules: [
                          {
                            required: true,
                            message: t('common.title.password'),
                          },
                          {
                            validator: this.compareToFirstPassword,
                          },
                        ],
                      })(
                        <Input
                          type="password"
                          autoComplete="off"
                          onBlur={this.handleConfirmBlur}
                        />
                      )}
                    </FormItemWrapper>{' '}
                  </FormWrapper>
                )}
                {(isEditProfile || showChangePassword) && (
                  <FormButtonWrapper>
                    <FormItem>
                      <EduButton
                        data-cy="saveUserInformation"
                        width="100px"
                        type="primary"
                        onClick={this.handleSubmit}
                      >
                        {t('common.title.save')}
                      </EduButton>
                      <EduButton
                        width="100px"
                        isGhost
                        type="primary"
                        onClick={this.handleCancel}
                      >
                        {t('common.title.cancel')}
                      </EduButton>
                    </FormItem>
                  </FormButtonWrapper>
                )}
              </ProfileContentWrapper>
            )}

            {user.role === roleuser.TEACHER && (
              <SchoolWrapper>
                <SchoolLabel>My Schools</SchoolLabel>
                <SchoolListWrapper data-cy="mySchools">
                  {this.getSchoolList()}
                </SchoolListWrapper>
                <AddSchoolSection>
                  <AddSchoolBtn
                    data-cy="addSchool"
                    width="190px"
                    isBlue
                    onClick={this.handleAddSchool}
                    type="primary"
                  >
                    Add School
                  </AddSchoolBtn>
                </AddSchoolSection>
              </SchoolWrapper>
            )}
            {showDefaultSettings && (
              <SchoolWrapper>
                <StandardSetsLabel>Standard Sets</StandardSetsLabel>
                <StandardSetsList data-cy="interestedStandards">
                  {this.getStandardSets()}
                </StandardSetsList>
                <StandardSetsButtons>
                  {showSaveStandSetsBtn && (
                    <SaveStandardSetsBtn
                      data-cy="saveStandardsets"
                      onClick={this.handleSaveStandardSets}
                    >
                      SAVE
                    </SaveStandardSetsBtn>
                  )}
                  <SelectSetsButton
                    width="190px"
                    isBlue
                    onClick={this.handleSelectStandardButton}
                    data-cy="selectStandardsets"
                    type="primary"
                  >
                    Select your standard sets
                  </SelectSetsButton>
                </StandardSetsButtons>
              </SchoolWrapper>
            )}
            {showDefaultSettings && (
              <SchoolWrapper>
                <Block>
                  <StyledDiv>
                    <Title>Default Settings</Title>
                    {showDefaultSettingSave && (
                      <SaveDefaultSettingsBtn
                        daya-cy="saveSettings"
                        onClick={this.saveSettings}
                      >
                        SAVE
                      </SaveDefaultSettingsBtn>
                    )}
                  </StyledDiv>
                  <FieldLabel>
                    {t('common.title.interestedGrade')}
                    <StyledRequired>*</StyledRequired>
                  </FieldLabel>
                  <SelectInputStyled
                    data-cy="gradeSelect"
                    mode="multiple"
                    size="large"
                    value={defaultGrades}
                    placeholder="Please select"
                    defaultValue={defaultGrades}
                    onChange={(value) => this.onSettingChange(value, 'grade')}
                    optionFilterProp="children"
                    getPopupContainer={(trigger) => trigger.parentNode}
                    margin="0px 0px 7px"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    isError={!defaultGrades?.length}
                  >
                    {selectsData.allGrades.map(({ value, text }) => (
                      <Select.Option key={value} value={value}>
                        {text}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                  {!defaultGrades?.length && (
                    <StyledRequiredFieldInfoText>
                      Atleast one grade need to be selected to save changes{' '}
                    </StyledRequiredFieldInfoText>
                  )}
                  <FieldLabel>
                    {t('common.title.interestedSubject')}
                    <StyledRequired>*</StyledRequired>
                  </FieldLabel>
                  <SelectInputStyled
                    data-cy="subjectSelect"
                    mode="multiple"
                    size="large"
                    margin="0px 0px 7px"
                    placeholder="Please select"
                    value={defaultSubjects}
                    defaultValue={defaultSubjects}
                    onChange={(value) => this.onSettingChange(value, 'subject')}
                    optionFilterProp="children"
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    isError={!defaultSubjects?.length}
                  >
                    {selectsData.allSubjects.map(({ value, text }) => (
                      <Select.Option key={value} value={value}>
                        {text}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                  {!defaultSubjects?.length && (
                    <StyledRequiredFieldInfoText>
                      Atleast one subject need to be selected to save changes{' '}
                    </StyledRequiredFieldInfoText>
                  )}
                  {user.role === roleuser.TEACHER && googleClassRoomAllowed && (
                    <SwitchWrapper>
                      <FieldLabel>
                        {t('common.title.autoShareWithGC')}
                      </FieldLabel>
                      ,
                      <EduSwitchStyled
                        defaultChecked={autoShareGCAssignment}
                        onChange={(checked) =>
                          this.onSettingChange(checked, 'autoSync')
                        }
                      />
                    </SwitchWrapper>
                  )}
                  {showPowerTools && (
                    <SwitchWrapper
                      style={{ justifyContent: 'space-between' }}
                      data-cy="powerUser"
                    >
                      <FieldLabel>{t('common.title.powerUser')}</FieldLabel>
                      <EduSwitchStyled
                        defaultChecked={userInfo.isPowerTeacher}
                        onChange={this.handlePowerTeacherUpdate}
                      />
                    </SwitchWrapper>
                  )}
                </Block>
              </SchoolWrapper>
            )}
          </RightContainer>
        </ProfileWrapper>
        {showModal && (
          <DeleteAccountModal
            visible={showModal}
            toggleModal={this.toggleModal}
            deleteProfile={this.deleteProfile}
          />
        )}
        {showDeleteSchoolModal && (
          <DeleteSchoolModal
            visible={showDeleteSchoolModal}
            toggleModal={this.toggleModal}
            removeSchool={this.handleRemoveSchool}
            selectedSchool={selectedSchool}
          />
        )}
        {showStandardSetsModal && (
          <StandardSetModal
            modalVisible={showStandardSetsModal}
            saveMyStandardsSet={this.updateMyStandardSets}
            closeModal={this.hideMyStandardSetsModal}
            standardList={curriculums}
            interestedStaData={interestedStaData}
          />
        )}
        {showEmailConfirmModal && (
          <EmailConfirmModal
            visible={showEmailConfirmModal}
            toggleModal={this.toggleModal}
            changeEmail={this.handleChangeEmail}
          />
        )}
        {joinSchoolVisible && (
          <StyledModal
            visible={joinSchoolVisible}
            title={null}
            centered
            footer={null}
            onCancel={hideJoinSchool}
            width="90%"
            style={{ maxWidth: 1100 }}
          >
            <JoinSchool
              userInfo={userInfo}
              fromUserProfile={!isEmpty(userInfo.orgData.districtIds)}
            />
          </StyledModal>
        )}
      </MainContentWrapper>
    )
  }
}

const enhance = compose(
  React.memo,
  withNamespaces('profile'),
  Form.create(),
  connect(
    (state) => ({
      flag: state.ui.flag,
      user: state.user.user,
      joinSchoolVisible: state.user.joinSchoolVisible,
      userInfo: get(state.user, 'user', {}),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      isSignupUsingUNAndPass: isSignupUsingUNAndPassSelector(state),
      curriculums: getCurriculumsListSelector(state),
      interestedCurriculums: getInterestedCurriculumsByOrgType(state),
      orgSchools: getOrgSchools(state),
      userOrg: getUserOrg(state),
      orgGroupList: getOrgGroupList(state),
      isCleverLibraryUser: getCleverLibraryUserSelector(state),
      isDataOpsOnlyUser: get(
        state,
        ['user', 'user', 'features', 'isDataOpsOnlyUser'],
        false
      ),
    }),
    {
      resetMyPassword: resetMyPasswordAction,
      updateUserDetails: updateUserDetailsAction,
      deleteAccount: deleteAccountAction,
      updateInterestedCurriculums: updateInterestedCurriculumsAction,
      getDictCurriculums: getDictCurriculumsAction,
      removeSchool: removeSchoolAction,
      removeInterestedCurriculum: removeInterestedCurriculumsAction,
      updateDefaultSettings: updateDefaultSettingsAction,
      showJoinSchool: showJoinSchoolAction,
      hideJoinSchool: hideJoinSchoolAction,
      updatePowerTeacher: updatePowerTeacherAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
      setIsUserOnProfilePage: setIsUserOnProfilePageAction,
      setShowJoinSchoolModal: setShowJoinSchoolModalAction,
    }
  )
)

export default enhance(ProfileBody)

ProfileBody.propTypes = {
  flag: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

const StyledModal = styled(Modal)`
  .ant-modal-body > .ant-row {
    min-height: 400px;
  }
  .ant-modal-body > .ant-row > .ant-col {
    width: 90%;
    margin-left: 5%;
  }
`

const StyledDiv = styled.div`
  padding-bottom: 15px;
`

export const Block = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: 0;

  :last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`

const ProfileWrapper = styled(Wrapper)`
  padding: 0px;
  margin: 0px;
  @media screen and (max-width: ${mobileWidthMax}) {
    padding: 20px;
  }
`

const RightContainer = styled.div`
  width: calc(100% - 310px);

  @media (max-width: ${largeDesktopWidth}) {
    width: calc(100% - 260px);
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
  }
`

const ProfileContentWrapper = styled.div`
  width: 100%;
  background-color: ${white};
  border-bottom: 1px solid #b6b6cc;
  padding-bottom: 20px;
  overflow: hidden;
`

const SchoolWrapper = styled(ProfileContentWrapper)`
  display: flex;
  align-items: center;
  margin-top: 20px;
`

const SchoolLabel = styled.span`
  font-weight: 600;
  font-size: 16px;
  min-width: 150px;
`

const StandardSetsLabel = styled(SchoolLabel)``

const SchoolListWrapper = styled.span`
  width: 100%;
  display: flex;
  display: inline-block;
`

const VerifyEmailSpan = styled.span`
  font-family: 'Times New Roman', serif;
  font-size: 1.1em;
  font-weight: 600;
  margin-left: 1em;
  span {
    color: ${themeColorBlue};
    cursor: pointer;
    :hover {
      color: ${themeColorHoverBlue};
    }
  }
`

const StandardSetsList = styled(SchoolListWrapper)`
  width: 100%;
  margin-bottom: 5px;
`

const StandardSetsButtons = styled.div`
  float: right;
`

const StyledTag = styled(Tag)`
  background-color: #b3bcc4;
  color: #676e74;
  border: none;
  font-weight: 600;
  font-size: 8px;
  padding: 2px 5px 2px 10px;
  margin: 2px;
  white-space: normal;
  text-transform: uppercase;
  i {
    color: #676e74 !important;
    margin-left: 10px !important;
  }
`

const UserDetail = styled.div``

const SubHeader = styled.div`
  overflow: hidden;
`

const Title = styled.h3`
  color: ${title};
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0px;
  float: left;
`

const ProfileImgWrapper = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  background-color: ${white};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${largeDesktopWidth}) {
    width: 250px;
    height: 200px;
  }
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`

const Details = styled.div`
  padding: 30px 0px 20px;
`

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0px;
`

const DetailTitle = styled.span`
  font-size: 10px;
  color: #aaafb5;
  font-weight: 600;
  width: 150px;
  display: inline-block;
  text-transform: uppercase;
`
const DetailData = styled.span`
  font-size: 11px;
  color: ${title};
  font-weight: 600;
  display: inline-block;
  width: calc(100% - 150px);
`

const Label = styled.label`
  text-transform: uppercase;
`

const ChangePasswordToggleButton = styled.div`
  color: '#6A737F';
  font-size: 10px;
  text-transform: uppercase;
  cursor: pointer;
  width: fit-content;
  span {
    margin-right: 20px;
    font-weight: 600;
  }
  svg {
    fill: ${themeColorBlue};
  }
`

const FormWrapper = styled(Form)`
  width: 100%;
  text-align: left;
  padding: 20px 0px 0px;
  display: flex;
  justify-content: space-between;

  .ant-input {
    height: 40px;
    background: ${backgrounds.primary};
    padding: 0 15px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    flex-direction: column;
  }
`

const FormItemWrapper = styled(FormItem)`
  width: calc(50% - 10px);
  display: inline-block;
  label {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 600;
  }
  .ant-form-explain {
    font-size: 12px;
  }
`

export const TitleSelect = styled(Select)`
  min-width: 100px;
`

export const InputItemWrapper = styled(FormItem)`
  width: 50%;
  display: inline-block;
  margin-bottom: 0 !important;
  .ant-form-explain {
    font-size: 12px;
  }
  .ant-input {
    height: 40px;
    background: ${backgrounds.primary};
    border: 1px solid ${borders.secondary};
    padding: 0 24px;
  }
  .ant-select {
    width:100%
    height: 40px;
  }
  .ant-select-selection{
    background: ${backgrounds.primary};
  }
  .ant-select-selection__rendered{
    line-height:40px;
    margin: 0 24px !important;
  }
  
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    display: block;
  }
`

const FormButtonWrapper = styled.div`
  text-align: center;
  float: right;
  padding-right: 0px;
  .ant-form-item-children {
    display: flex;
  }
`

export const EditProfileButton = styled(EduButton)`
  margin-left: 15px;
  font-size: 10px;
  float: right;
  font-weight: 600;
  height: 30px;
  padding: 0px 15px;
  i {
    font-size: 14px;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    height: 36px;
  }
  @media (max-width: ${desktopWidth}) {
    width: 100%;
    margin: 8px 0 0 0;
  }
`

export const DeleteAccountButton = styled(EditProfileButton)`
  background: ${white} !important;
  border: 1px solid ${red} !important;
  color: ${red} !important;
  svg {
    fill: ${red};
  }
  &:hover {
    svg {
      fill: ${red} !important;
    }
  }
`

const SelectSetsButton = styled(EditProfileButton)`
  background: ${themeColor};
  border-color: ${themeColor};
  color: ${white};
`

const SaveStandardSetsBtn = styled(SelectSetsButton)`
  margin: 5px 0px 5px 15px;
  &:hover {
    color: ${themeColor};
  }
`

const SaveDefaultSettingsBtn = styled(SelectSetsButton)`
  margin: 5px 0px 5px 15px;
  &:hover {
    color: ${themeColor};
  }
`

const AddSchoolBtn = styled(EditProfileButton)`
  background: ${themeColor};
  border-color: ${themeColor};
  color: ${white};
`

const AddSchoolSection = styled.div`
  float: right;
`

const SwitchWrapper = styled.div`
  justify-content: space-between;
  display: flex;
  align-items: center;
  margin-top: 10px;
  button {
    margin-right: 150px;
  }
`
const StyledRequiredFieldInfoText = styled.p`
  font-size: 10px;
  color: ${fieldRequiredColor2};
  margin-bottom: 10px;
`
