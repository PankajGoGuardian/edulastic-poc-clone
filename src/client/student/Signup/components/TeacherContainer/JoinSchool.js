import React, { useState, useEffect, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { get, debounce, find } from 'lodash'
import { Row, Col, Breadcrumb, Icon, Button as Buttons } from 'antd'
import styled, { css } from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { IconClose } from '@edulastic/icons'
import { signUpState } from '@edulastic/constants'
import {
  themeColor,
  white,
  title,
  mobileWidthMax,
  mobileWidthLarge,
  extraDesktopWidthMax,
} from '@edulastic/colors'

import { Button } from 'antd/lib/radio'

import { segmentApi } from '@edulastic/api'
import { signupStateBykey } from '@edulastic/constants/const/signUpState'
import TeacherCarousel from './TeacherCarousel'
import RequestSchoolModal from './RequestSchoolModal'
import RequestSchoolSection from './RequestSchoolSection'

import { addSchoolAction } from '../../../Login/ducks'
import {
  searchSchoolRequestAction,
  searchSchoolByDistrictRequestAction,
  joinSchoolRequestAction,
  updateUserWithSchoolLoadingSelector,
  checkDistrictPolicyRequestAction,
  createAndJoinSchoolRequestAction,
  fetchSchoolTeachersRequestAction,
  setPreviousAutoSuggestSchools,
} from '../../duck'
import {
  getUserIPZipCode,
  getUserOrgId,
} from '../../../../author/src/selectors/user'
import { RemoteAutocompleteDropDown } from '../../../../common/components/widgets/remoteAutoCompleteDropDown'

const SchoolDropDownItemTemplate = ({ itemData: school }) => {
  const { address, location } = school
  const schoolLocation = address || location || {}

  return (
    <OptionBody>
      <SchoolInfo>
        <span className="school-name">{school.schoolName || school.name}</span>
        <div className="school-address">
          {`${schoolLocation.city ? `${schoolLocation.city}, ` : ''} ${
            schoolLocation.state ? `${schoolLocation.state}, ` : ''
          } ${schoolLocation.zip ? schoolLocation.zip : ''}`}
        </div>
        {school.districtName ? (
          <DistrictInfo className="district-name">
            <span>District: </span>
            {school.districtName}
          </DistrictInfo>
        ) : (
          ''
        )}
      </SchoolInfo>
    </OptionBody>
  )
}

const JoinSchool = ({
  isSearching,
  searchSchool,
  searchSchoolByDistrict,
  checkDistrictPolicyAction,
  schools,
  newSchool,
  userInfo,
  joinSchool,
  createAndJoinSchool,
  fetchSchoolTeachers,
  updateUserWithSchoolLoading,
  createSchoolRequestPending,
  ipZipCode,
  checkDistrictPolicy,
  districtId,
  isSignupUsingDaURL,
  schoolTeachers,
  setPreviousAutoSuggestSchoolsContent,
  t,
  allowCanvas,
  schoolchange = () => {},
  fromUserProfile,
  addSchool,
  addingSchool,
  isModal,
  isSchoolSignupOnly = false,
  triggerSource = '',
}) => {
  fromUserProfile = fromUserProfile || isSchoolSignupOnly
  const {
    email,
    firstName,
    middleName,
    lastName,
    currentSignUpState,
  } = userInfo
  const [selected, setSchool] = useState(null)
  const [tempSelected, setTempSchool] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [homeSchool, setHomeSchool] = useState(false)
  const [requestSchoolFormVisible, setRequestSchoolFormVisible] = useState(
    false
  )
  const autoCompleteRef = useRef(null)

  const toggleModal = () => setShowModal(!showModal)

  const schoolIcon =
    '//cdn.edulastic.com/JS/webresources/images/as/signup-join-school-icon.png'

  const changeSchool = (value) => {
    const _school = find(schools, (item) => item.schoolId === value.key)

    if (isSignupUsingDaURL) {
      setSchool(_school)

      const teacherSearch = {
        limit: 20,
        page: 1,
        type: 'SIGNUP',
        search: {
          role: ['teacher'],
        },
        districtId: _school.districtId,
        institutionIds: [_school.schoolId],
      }
      fetchSchoolTeachers(teacherSearch)
    } else if (!isSignupUsingDaURL && _school) {
      let signOnMethod = 'userNameAndPassword'
      signOnMethod = allowCanvas ? 'canvasSignOn' : signOnMethod
      signOnMethod = userInfo.msoId ? 'office365SignOn' : signOnMethod
      signOnMethod = userInfo.cleverId ? 'cleverSignOn' : signOnMethod
      signOnMethod = userInfo.googleId ? 'googleSignOn' : signOnMethod

      checkDistrictPolicyAction({
        data: {
          districtId: _school.districtId,
          email,
          type: userInfo.role,
          signOnMethod,
          institutionId: _school.schoolId,
          currentSignUpState: signupStateBykey[currentSignUpState],
        },
        error: { message: t('common.policyviolation') },
      })
      setTempSchool(_school)
    }
  }
  useEffect(() => {
    if (
      !Object.keys(checkDistrictPolicy).length &&
      !!userInfo.email &&
      !allowCanvas
    ) {
      if (autoCompleteRef.current) {
        autoCompleteRef.current.wipeSelected()
      }
      setSchool(null)
    } else if (tempSelected) {
      setSchool(tempSelected)

      const teacherSearch = {
        limit: 20,
        page: 1,
        type: 'SIGNUP',
        search: {
          role: ['teacher'],
        },
        districtId: tempSelected.districtId,
        institutionIds: [tempSelected.schoolId],
      }
      fetchSchoolTeachers(teacherSearch)
    }
    setTempSchool(null)
  }, [checkDistrictPolicy])

  const handleSubmit = () => {
    const schoolId = selected.schoolId || selected._id
    if (fromUserProfile) {
      const institutionIds = userInfo?.institutionIds || []
      const newInstitutionIds = schoolId
        ? [...institutionIds, schoolId]
        : institutionIds
      const data = {
        institutionIds: [...new Set(newInstitutionIds)],
        districtId: selected.districtId,
        email: email || '',
        ...(firstName ? { firstName } : {}),
        middleName,
        lastName,
      }
      addSchool({
        data,
        userId: userInfo._id,
      })
    } else {
      const data = {
        institutionIds: [selected.schoolId || selected._id || ''],
        districtId: selected.districtId,
        currentSignUpState:
          userInfo.currentSignUpState === signUpState.ACCESS_WITHOUT_SCHOOL
            ? 'ACCESS_WITHOUT_SCHOOL'
            : 'PREFERENCE_NOT_SELECTED',
        email: email || '',
        ...(firstName ? { firstName } : {}),
        middleName,
        lastName,
      }
      joinSchool({ data, userId: userInfo._id })
    }
  }

  const fetchSchool = (searchText) => {
    if (searchText && searchText.length >= 3) {
      if (isSignupUsingDaURL || districtId) {
        searchSchoolByDistrict({
          districtId,
          currentSignUpState,
          search: {
            name: [{ type: 'cont', value: searchText }],
            city: [{ type: 'cont', value: searchText }],
            zip: [{ type: 'cont', value: searchText }],
            isApproved: [true],
          },
          searchKeysSearchType: 'or',
          limit: 50,
        })
      } else {
        searchSchool({
          ipZipCode,
          email,
          searchText,
          isApproved: true,
          limit: 50,
        })
      }
    } else {
      // set the auto suggest schools
      setPreviousAutoSuggestSchoolsContent()
    }
  }

  const handleSearch = debounce((keyword) => fetchSchool(keyword), 500)

  useEffect(() => {
    segmentApi.genericEventTrack('School_Selection_ModalOpen', {
      Trigger_Source: triggerSource,
    })
  }, [])

  useEffect(() => {
    if (isSignupUsingDaURL || districtId) {
      searchSchoolByDistrict({
        districtId,
        currentSignUpState,
        search: { isApproved: [true] },
      })
    } else {
      searchSchool({ ipZipCode, email, isApproved: true })
    }
  }, [])

  useEffect(() => {
    if (newSchool._id && !homeSchool && !fromUserProfile) {
      setSchool(newSchool._id)
    }
  }, [newSchool])

  useEffect(() => {
    schoolchange(selected)
  }, [selected])

  const dropdownSchoolData = useMemo(() => {
    const approvedSchool = schools.filter(
      (school) => school.isApproved === true
    )
    return approvedSchool.map((item) => ({
      ...item,
      title: item.schoolName,
      key: item.schoolId,
      zip: get(item, 'address.zip', ''),
      city: get(item, 'address.city', ''),
    }))
  }, [schools])

  const onClickHomeSchool = () => {
    if (createSchoolRequestPending || updateUserWithSchoolLoading) {
      return
    }

    const schoolAndDistrictNamePrefix =
      userInfo.firstName + (userInfo.lastName ? `${userInfo.lastName} ` : ' ')
    const districtName = `${schoolAndDistrictNamePrefix}HOME SCHOOL DISTRICT`
    const schoolName = `${schoolAndDistrictNamePrefix}HOME SCHOOL`

    const body = {
      name: schoolName,
      districtName,
      location: {
        city: userInfo.firstName,
        state: 'AK',
        zip: userInfo.firstName,
        address: userInfo.firstName,
        country: 'US',
      },
      requestNewSchool: true,
      homeSchool: true,
    }

    createAndJoinSchool({
      createSchool: body,
      joinSchool: {
        data: {
          currentSignUpState:
            userInfo.currentSignUpState === signUpState.ACCESS_WITHOUT_SCHOOL
              ? 'ACCESS_WITHOUT_SCHOOL'
              : 'PREFERENCE_NOT_SELECTED',
          email: userInfo.email,
          firstName: userInfo.firstName,
          middleName: userInfo.middleName,
          lastName: userInfo.lastName,
        },
        userId: userInfo._id,
      },
    })
    setHomeSchool(true)
  }

  const showRequestForm = () => setRequestSchoolFormVisible(true)
  const hideRequestForm = () => setRequestSchoolFormVisible(false)

  return (
    <>
      <JoinSchoolBody hasMinHeight={!isModal} data-cy="joinSchoolBody">
        {requestSchoolFormVisible && (
          <BreadcrumbWrapper>
            <Breadcrumb.Item>
              <StyledIcon type="left" />
              <BreadcrumbLink onClick={hideRequestForm}>Back</BreadcrumbLink>
            </Breadcrumb.Item>
          </BreadcrumbWrapper>
        )}
        <Col
          xs={{ span: 20, offset: 2 }}
          lg={{ span: isModal ? 22 : 18, offset: isModal ? 1 : 3 }}
        >
          <FlexWrapper type="flex" align="middle">
            <BannerText
              xs={24}
              sm={18}
              md={12}
              fromUserProfile={fromUserProfile}
            >
              <SchoolIcon src={schoolIcon} alt="" />
              {requestSchoolFormVisible ? (
                <>
                  <h3>
                    {t('component.signup.teacher.request')} <br />{' '}
                    {t('component.signup.teacher.newschool')}
                  </h3>
                  <h5>
                    {t('component.signup.teacher.filldetails')} <br />{' '}
                    {t('component.signup.teacher.edulasticsupport')}
                  </h5>
                </>
              ) : (
                <>
                  <h3>
                    {t('component.signup.teacher.joinschool')} <br />{' '}
                    {t('common.community')}
                  </h3>
                  <h5>{t('component.signup.teacher.collaboratetext')}</h5>
                </>
              )}
            </BannerText>
            <Col xs={24} sm={18} md={12}>
              {requestSchoolFormVisible ? (
                <RequestSchoolSection userInfo={userInfo} />
              ) : (
                <SelectForm>
                  <label>SEARCH SCHOOL</label>
                  {selected ? (
                    <SchoolSelected>
                      <SelectedTag>
                        <span data-cy="selectedSchool">
                          {selected.schoolName || ''}
                        </span>
                        <IconClose
                          data-cy="removeSelected"
                          color={themeColor}
                          onClick={() => setSchool(null)}
                        />
                      </SelectedTag>
                    </SchoolSelected>
                  ) : (
                    <StyledRemoteAutocompleteDropDown
                      by=""
                      data={dropdownSchoolData}
                      onSearchTextChange={handleSearch}
                      iconType="search"
                      rotateIcon={false}
                      placeholder={t('component.signup.teacher.searchschool')}
                      ItemTemplate={SchoolDropDownItemTemplate}
                      minHeight="50px"
                      selectCB={changeSchool}
                      filterKeys={['title', 'zip', 'city']}
                      isLoading={isSearching}
                      _ref={autoCompleteRef}
                      disabled={!!tempSelected}
                    />
                  )}
                  {selected && selected.districtName ? (
                    <DistrictName data-cy="districtName">
                      <span>{t('common.district')}: </span>
                      {selected.districtName}
                    </DistrictName>
                  ) : (
                    ''
                  )}
                  <Actions>
                    {(!isSignupUsingDaURL && !districtId) || fromUserProfile ? (
                      <AnchorBtn
                        data-cy="reqNewSchoolBtn"
                        onClick={
                          fromUserProfile ? showRequestForm : toggleModal
                        }
                      >
                        {t('component.signup.teacher.requestnewschool')} »
                      </AnchorBtn>
                    ) : null}
                    {!allowCanvas && !fromUserProfile ? (
                      <AnchorBtn
                        loading={
                          createSchoolRequestPending ||
                          updateUserWithSchoolLoading
                        }
                        onClick={onClickHomeSchool}
                      >
                        {' '}
                        I WANT TO HOMESCHOOL »
                      </AnchorBtn>
                    ) : null}
                  </Actions>

                  {selected && (
                    <div style={{ textAlign: 'center' }}>
                      {schoolTeachers.length > 0 ? (
                        <TeacherCarousel teachers={schoolTeachers} />
                      ) : null}
                      <ProceedBtn
                        data-cy="proceed"
                        onClick={handleSubmit}
                        disabled={
                          createSchoolRequestPending ||
                          updateUserWithSchoolLoading ||
                          (fromUserProfile && addingSchool)
                        }
                      >
                        {t(
                          !allowCanvas
                            ? 'common.proceed'
                            : 'common.importCanvasClasses'
                        )}
                      </ProceedBtn>
                    </div>
                  )}
                </SelectForm>
              )}
            </Col>
          </FlexWrapper>
        </Col>
      </JoinSchoolBody>
      {showModal ? (
        <RequestSchoolModal
          isOpen={showModal}
          handleCancel={toggleModal}
          userInfo={userInfo}
        />
      ) : null}
    </>
  )
}

JoinSchool.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  searchSchool: PropTypes.func.isRequired,
  schools: PropTypes.array.isRequired,
  newSchool: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  joinSchool: PropTypes.func.isRequired,
  searchSchoolByDistrict: PropTypes.func.isRequired,
  createAndJoinSchool: PropTypes.func.isRequired,
  checkDistrictPolicy: PropTypes.func.isRequired,
  fetchSchoolTeachers: PropTypes.func.isRequired,
  setPreviousAutoSuggestSchoolsContent: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
}

JoinSchool.defaultProps = {
  isModal: false,
}

const enhance = compose(
  withRouter,
  withNamespaces('login'),
  connect(
    (state) => ({
      isSearching: get(state, 'signup.isSearching', false),
      schools: get(state, 'signup.schools', []),
      newSchool: get(state, 'signup.newSchool', {}),
      checkDistrictPolicy: get(state, 'signup.checkDistrictPolicy', false),
      updateUserWithSchoolLoading: updateUserWithSchoolLoadingSelector(state),
      createSchoolRequestPending: get(
        state,
        'signup.createSchoolRequestPending',
        false
      ),
      ipZipCode: getUserIPZipCode(state),
      districtId: getUserOrgId(state),
      schoolTeachers: get(state, 'signup.schoolTeachers', []),
      addingSchool: get(state, 'user.addingSchool'),
    }),
    {
      searchSchool: searchSchoolRequestAction,
      searchSchoolByDistrict: searchSchoolByDistrictRequestAction,
      joinSchool: joinSchoolRequestAction,
      createAndJoinSchool: createAndJoinSchoolRequestAction,
      checkDistrictPolicyAction: checkDistrictPolicyRequestAction,
      fetchSchoolTeachers: fetchSchoolTeachersRequestAction,
      setPreviousAutoSuggestSchoolsContent: setPreviousAutoSuggestSchools,
      addSchool: addSchoolAction,
    }
  )
)

export default enhance(JoinSchool)

const StyledIcon = styled(Icon)`
  font-size: ${(props) =>
    props.theme.breadcrumbs.breadcrumbTextSize} !important;
  color: ${(props) => props.theme.themeColor};
`

const BreadcrumbWrapper = styled(Breadcrumb)`
  margin-top: -50px;
  margin-bottom: 20px;
`

const BreadcrumbLink = styled.span`
  cursor: pointer;
  font-weight: bold;
  font-size: ${(props) =>
    props.theme.breadcrumbs.breadcrumbTextSize} !important;
  color: ${(props) => props.theme.themeColor};
  text-transform: uppercase;
`

const JoinSchoolBody = styled(Row)`
  padding: 60px 0px;
  background: white;
  ${({ hasMinHeight = true }) =>
    hasMinHeight && `min-height: calc(100vh - 93px);`}
`

const FlexWrapper = styled(Row)`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    align-items: center;
  }
`

const BannerText = styled(Col)`
  text-align: left;
  h3 {
    font-size: 45px;
    font-weight: bold;
    color: ${title};
    line-height: 1;
    letter-spacing: -2.25px;
    margin-top: 0px;
    margin-bottom: 15px;
  }
  h5 {
    font-size: 14px;
    margin-top: 10px;
    color: ${title};
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    h3 {
      font-size: 40px;
    }
    h5 {
      font-size: 24px;
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    margin-bottom: 30px;
    h3 {
      font-weight: 400;
    }
  }
`

const selectStyle = css`
  .ant-select-selection {
    min-height: 45px;
    .ant-select-selection__rendered {
      line-height: 45px;
      .ant-input-affix-wrapper .ant-input {
        min-height: 43px;
        box-shadow: none;
        border: none;
        font-size: 20px;
      }
      .ant-input-affix-wrapper:hover .ant-input,
      .ant-input:hover {
        box-shadow: none;
        border: none;
      }
    }
  }
`

const SelectForm = styled.div`
  max-width: 640px;
  margin: 0px auto;
  padding: 25px;
  background: ${white};
  border-radius: 8px;
  .remote-autocomplete-dropdown {
    border-bottom: 1px solid #a0a0a0;
    background: ${white};
    margin: 0px;
    ${selectStyle};
  }
  .ant-select-auto-complete.ant-select .ant-input {
    border: none;
  }

  label {
    font-size: 11px;
    margin-bottom: 10px;
    display: inline-block;
  }
`

const DistrictName = styled.div`
  font-size: 12px;
  margin-right: auto;
  padding: 15px 0px 0px;
  span {
    font-weight: 600;
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 15px 0px;
`

const AnchorBtn = styled(Buttons)`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 10px;
  color: ${themeColor};
  margin-right: 25px;
  user-select: none;
  cursor: pointer;
  padding: 0;
  border: none;
  outline: none;
`

const SchoolIcon = styled.img`
  width: 80px;
  margin-bottom: 10px;
`

const SchoolSelected = styled.div`
  width: 100%;
  background: ${white};
  border-bottom: 1px solid #a0a0a0;
  margin: 0px;
  display: flex;
  align-items: center;
  padding: 5px;
  min-height: 45px;
`

const SelectedTag = styled.div`
  background: #e3e3e3;
  border-radius: 20px;
  display: flex;
  padding: 2px 15px;
  min-height: 30px;
  color: ${themeColor};
  align-items: center;
  span {
    margin-right: 10px;
    font-size: 11px;
    color: #434b5d;
    text-transform: uppercase;
  }
  svg {
    width: 8px;
    height: 8px;
    cursor: pointer;
    fill: #434b5d !important;
  }
`

const ProceedBtn = styled(Button)`
  background: ${themeColor};
  min-width: 180px;
  color: ${white};
  margin: 20px auto 20px;
  text-transform: uppercase;
  text-align: center;
  &:hover {
    color: ${white};
  }
`

const OptionBody = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: column;
  }
`

const SchoolInfo = styled.div`
  width: 100%;
  color: ${title};
  display: flex;
  flex-wrap: wrap;
  .school-name {
    width: 100%;
    font-size: 16px;
    font-weight: 600;
  }
  .school-address {
    width: 50%;
    font-size: 11px;
  }
  .district-name {
    width: 50%;
    font-size: 11px;
  }
`

const DistrictInfo = styled.div`
  align-self: flex-end;
  text-align: end;
  width: 50%;
  span {
    font-weight: 600;
  }
  @media (max-width: ${mobileWidthLarge}) {
    align-self: flex-start;
    text-align: start;
    width: 100%;
  }
`

const StyledRemoteAutocompleteDropDown = styled(RemoteAutocompleteDropDown)`
  width: 100%;
`
