import React, { useState, useEffect, useMemo, useRef } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { get, debounce, find } from "lodash";
import { Row, Col } from "antd";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";
import { IconClose } from "@edulastic/icons";
import {
  themeColor,
  white,
  title,
  fadedGreen,
  cardBg,
  mobileWidthMax,
  mobileWidthLarge,
  mediumDesktopExactWidth
} from "@edulastic/colors";

import { Button } from "antd/lib/radio";
import TeacherCarousel from "./TeacherCarousel";
import RequestSchoolModal from "./RequestSchoolModal";

import {
  searchSchoolRequestAction,
  searchSchoolByDistrictRequestAction,
  joinSchoolRequestAction,
  updateUserWithSchoolLoadingSelector,
  checkDistrictPolicyRequestAction,
  createAndJoinSchoolRequestAction,
  fetchSchoolTeachersRequestAction,
  setPreviousAutoSuggestSchools
} from "../../duck";
import { getUserIPZipCode, getUserOrgId } from "../../../../author/src/selectors/user";
import { RemoteAutocompleteDropDown } from "../../../../common/components/widgets/remoteAutoCompleteDropDown";

const SchoolDropDownItemTemplate = ({ itemData: school }) => {
  const { address, location } = school;
  const schoolLocation = address || location || {};

  return (
    <OptionBody>
      <SchoolInfo>
        <span>{school.schoolName || school.name}</span>
        <div>
          {`${schoolLocation.city ? `${schoolLocation.city}, ` : ""} ${
            schoolLocation.state ? `${schoolLocation.state}, ` : ""
          } ${schoolLocation.zip ? schoolLocation.zip : ""}`}
        </div>
      </SchoolInfo>
      {school.districtName ? (
        <DistrictInfo>
          <span>District: </span>
          {school.districtName}
        </DistrictInfo>
      ) : (
        ""
      )}
    </OptionBody>
  );
};

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
  t
}) => {
  const { email, firstName, middleName, lastName, currentSignUpState } = userInfo;
  const [selected, setSchool] = useState(null);
  const [tempSelected, setTempSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prevCheckDistrictPolicy, setPrevCheckDistrictPolicy] = useState(checkDistrictPolicy);
  const [homeSchool, setHomeSchool] = useState(false);
  const autoCompleteRef = useRef(null);

  const toggleModal = () => setShowModal(!showModal);

  const schoolIcon = "//cdn.edulastic.com/JS/webresources/images/as/signup-join-school-icon.png";

  const changeSchool = value => {
    const _school = find(schools, item => item.schoolId === value.key);

    if (isSignupUsingDaURL) {
      setSchool(_school);

      const teacherSearch = {
        limit: 20,
        page: 1,
        type: "SIGNUP",
        search: {
          role: ["teacher"]
        },
        districtId: _school.districtId,
        institutionIds: [_school.schoolId]
      };
      fetchSchoolTeachers(teacherSearch);
    } else if (!isSignupUsingDaURL && _school) {
      let signOnMethod = "userNameAndPassword";
      signOnMethod = userInfo.msoId ? "office365SignOn" : signOnMethod;
      signOnMethod = userInfo.cleverId ? "cleverSignOn" : signOnMethod;
      signOnMethod = userInfo.googleId ? "googleSignOn" : signOnMethod;

      checkDistrictPolicyAction({
        data: {
          districtId: _school.districtId,
          email,
          type: userInfo.role,
          signOnMethod,
          institutionId: _school.schoolId
        },
        error: { message: t("common.policyviolation") }
      });
      setTempSchool(_school);
    }
  };

  if (prevCheckDistrictPolicy !== checkDistrictPolicy) {
    setPrevCheckDistrictPolicy(checkDistrictPolicy);
    if (!Object.keys(checkDistrictPolicy).length) {
      if (autoCompleteRef.current) {
        autoCompleteRef.current.wipeSelected();
      }
      setSchool(null);
    } else {
      setSchool(tempSelected);

      const teacherSearch = {
        limit: 20,
        page: 1,
        type: "SIGNUP",
        search: {
          role: ["teacher"]
        },
        districtId: tempSelected.districtId,
        institutionIds: [tempSelected.schoolId]
      };
      fetchSchoolTeachers(teacherSearch);
    }
    setTempSchool(null);
  }

  const handleSubmit = () => {
    const data = {
      institutionIds: [selected.schoolId || selected._id || ""],
      districtId: selected.districtId,
      currentSignUpState: "PREFERENCE_NOT_SELECTED",
      email,
      firstName,
      middleName,
      lastName
    };
    joinSchool({ data, userId: userInfo._id });
  };

  const fetchSchool = searchText => {
    if (searchText && searchText.length >= 3) {
      if (isSignupUsingDaURL || districtId) {
        searchSchoolByDistrict({
          districtId,
          currentSignUpState,
          search: {
            name: [{ type: "cont", value: searchText }],
            city: [{ type: "cont", value: searchText }],
            zip: [{ type: "cont", value: searchText }],
            isApproved: [true]
          },
          searchKeysSearchType: "or"
        });
      } else {
        searchSchool({ ipZipCode, email, searchText, isApproved: true });
      }
    } else {
      // set the auto suggest schools
      setPreviousAutoSuggestSchoolsContent();
    }
  };

  const handleSearch = debounce(keyword => fetchSchool(keyword), 500);

  useEffect(() => {
    if (isSignupUsingDaURL || districtId) {
      searchSchoolByDistrict({ districtId, currentSignUpState, search: { isApproved: [true] } });
    } else {
      searchSchool({ ipZipCode, email, isApproved: true });
    }
  }, []);

  useEffect(() => {
    if (newSchool._id && !homeSchool) {
      setSchool(newSchool._id);
    }
  }, [newSchool]);

  const dropdownSchoolData = useMemo(() => {
    const approvedSchool = schools.filter(school => school.isApproved === true);
    return approvedSchool.map(item => ({
      ...item,
      title: item.schoolName,
      key: item.schoolId,
      zip: get(item, "address.zip", ""),
      city: get(item, "address.city", "")
    }));
  }, [schools]);

  const onClickHomeSchool = () => {
    if (createSchoolRequestPending || updateUserWithSchoolLoading) {
      return;
    }

    const schoolAndDistrictNamePrefix =
      userInfo.firstName + (userInfo.lastName ? `${userInfo.lastName} ` : " ");
    const districtName = `${schoolAndDistrictNamePrefix}HOME SCHOOL DISTRICT`;
    const schoolName = `${schoolAndDistrictNamePrefix}HOME SCHOOL`;

    const body = {
      name: schoolName,
      districtName,
      location: {
        city: userInfo.firstName,
        state: "Alaska",
        zip: userInfo.firstName,
        address: userInfo.firstName,
        country: "United States"
      },
      requestNewSchool: true,
      homeSchool: true
    };

    createAndJoinSchool({
      createSchool: body,
      joinSchool: {
        data: {
          currentSignUpState: "PREFERENCE_NOT_SELECTED",
          email: userInfo.email,
          firstName: userInfo.firstName,
          middleName: userInfo.middleName,
          lastName: userInfo.lastName
        },
        userId: userInfo._id
      }
    });
    setHomeSchool(true);
  };

  return (
    <>
      <JoinSchoolBody>
        <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
          <FlexWrapper type="flex" align="middle">
            <BannerText xs={24} sm={18} md={12}>
              <SchoolIcon src={schoolIcon} alt="" />
              <h3>
                {t("component.signup.teacher.joinschool")} <br /> {t("common.community")}
              </h3>
              <h5>{t("component.signup.teacher.collaboratetext")}</h5>
            </BannerText>
            <Col xs={24} sm={18} md={12}>
              <SelectForm>
                {selected ? (
                  <SchoolSelected>
                    <SelectedTag>
                      <span>{selected.schoolName || ""}</span>
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
                    placeholder={t("component.signup.teacher.searchschool")}
                    ItemTemplate={SchoolDropDownItemTemplate}
                    minHeight="70px"
                    selectCB={changeSchool}
                    filterKeys={["title", "zip", "city"]}
                    isLoading={isSearching}
                    _ref={autoCompleteRef}
                    disabled={!!tempSelected}
                  />
                )}
                <Actions>
                  <AnchorBtn onClick={onClickHomeSchool}> I want to homeschool</AnchorBtn>
                  {!isSignupUsingDaURL && !districtId ? (
                    <AnchorBtn onClick={toggleModal}>
                      {" "}
                      {t("component.signup.teacher.requestnewschool")}
                    </AnchorBtn>
                  ) : null}
                  {selected && selected.districtName ? (
                    <DistrictName data-cy="districtName">
                      <span>{t("common.district")}: </span>
                      {selected.districtName}
                    </DistrictName>
                  ) : (
                    ""
                  )}
                </Actions>

                {selected && (
                  <>
                    {schoolTeachers.length > 0 ? (
                      <TeacherCarousel teachers={schoolTeachers} />
                    ) : null}
                    <ProceedBtn
                      data-cy="proceed"
                      onClick={handleSubmit}
                      disabled={createSchoolRequestPending || updateUserWithSchoolLoading}
                    >
                      {t("common.proceed")}
                    </ProceedBtn>
                  </>
                )}
              </SelectForm>
            </Col>
          </FlexWrapper>
        </Col>
      </JoinSchoolBody>
      {showModal ? (
        <RequestSchoolModal isOpen={showModal} handleCancel={toggleModal} userInfo={userInfo} />
      ) : null}
    </>
  );
};

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
  setPreviousAutoSuggestSchoolsContent: PropTypes.func.isRequired
};

const enhance = compose(
  withRouter,
  withNamespaces("login"),
  connect(
    state => ({
      isSearching: get(state, "signup.isSearching", false),
      schools: get(state, "signup.schools", []),
      newSchool: get(state, "signup.newSchool", {}),
      checkDistrictPolicy: get(state, "signup.checkDistrictPolicy", false),
      updateUserWithSchoolLoading: updateUserWithSchoolLoadingSelector(state),
      createSchoolRequestPending: get(state, "signup.createSchoolRequestPending", false),
      ipZipCode: getUserIPZipCode(state),
      districtId: getUserOrgId(state),
      schoolTeachers: get(state, "signup.schoolTeachers", [])
    }),
    {
      searchSchool: searchSchoolRequestAction,
      searchSchoolByDistrict: searchSchoolByDistrictRequestAction,
      joinSchool: joinSchoolRequestAction,
      createAndJoinSchool: createAndJoinSchoolRequestAction,
      checkDistrictPolicyAction: checkDistrictPolicyRequestAction,
      fetchSchoolTeachers: fetchSchoolTeachersRequestAction,
      setPreviousAutoSuggestSchoolsContent: setPreviousAutoSuggestSchools
    }
  )
);

export default enhance(JoinSchool);

const JoinSchoolBody = styled(Row)`
  padding: 60px 0px;
  background: white;
  min-height: calc(100vh - 93px);
`;

const FlexWrapper = styled(Row)`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    align-items: center;
  }
`;

const BannerText = styled(Col)`
  text-align: center;
  h3 {
    font-size: 40px;
    font-weight: 600;
    color: ${title};
    line-height: 1.3;
    letter-spacing: -2px;
    margin-top: 0px;
    margin-bottom: 15px;
  }
  h5 {
    font-size: 24px;
    margin-top: 10px;
    color: ${title};
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    h3 {
      font-size: 36px;
    }
    h5 {
      font-size: 16px;
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    margin-bottom: 30px;
    h3 {
      font-weight: 400;
    }
  }
`;

const SelectForm = styled.div`
  max-width: 640px;
  margin: 0px auto;
  padding: 32px;
  background: ${cardBg};
  border-radius: 8px;
  text-align: center;
  .remote-autocomplete-dropdown {
    box-shadow: 2px 2px 2px 2px rgba(201, 208, 219, 0.5);
    background: ${white};
  }
  .ant-select-auto-complete.ant-select .ant-input {
    border: none;
  }
`;

const DistrictName = styled.div`
  font-size: 12px;
  margin-right: auto;
  span {
    font-weight: 600;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 16px 0px 0px;
`;

const AnchorBtn = styled.div`
  text-transform: uppercase;
  border-bottom: 2px ${themeColor} solid;
  font-weight: 600;
  padding-bottom: 2px;
  font-size: 11px;
  margin-left: 16px;
  user-select: none;
  cursor: pointer;
`;

const SchoolIcon = styled.img`
  width: 80px;
  margin-bottom: 10px;
`;

const SchoolSelected = styled.div`
  width: 100%;
  background: ${white};
  border-radius: 2px;
  box-shadow: 2px 2px 2px 2px rgba(201, 208, 219, 0.5);
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 2px;
`;

const SelectedTag = styled.div`
  background: ${fadedGreen};
  border-radius: 8px;
  display: flex;
  padding: 2px 15px;
  height: auto;
  color: ${themeColor};
  align-items: center;
  span {
    margin-right: 10px;
  }
  svg {
    width: 10px;
    height: 10px;
    cursor: pointer;
  }
`;

const ProceedBtn = styled(Button)`
  background: ${themeColor};
  min-width: 60%;
  color: ${white};
  margin-top: 32px;
  text-transform: uppercase;
  text-align: center;
  &:hover {
    color: ${white};
  }
`;

const OptionBody = styled.div`
  display: flex;
  width: 100%;
  @media (max-width: ${mobileWidthLarge}) {
    flex-direction: column;
  }
`;

const SchoolInfo = styled.div`
  width: 50%;
  span {
    font-weight: 600;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
  }
`;

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
`;

const StyledRemoteAutocompleteDropDown = styled(RemoteAutocompleteDropDown)`
  width: 100%;
`;
