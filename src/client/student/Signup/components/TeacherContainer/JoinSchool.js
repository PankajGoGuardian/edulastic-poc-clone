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
  mobileWidth,
  mobileWidthLarge
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
  createAndJoinSchoolRequestAction
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
          {`${schoolLocation.city ? schoolLocation.city + ", " : ""} ${
            schoolLocation.state ? schoolLocation.state + ", " : ""
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
  searchSchoolByDistrictRequestAction,
  checkDistrictPolicyRequestAction,
  schools,
  newSchool,
  userInfo,
  joinSchool,
  createAndJoinSchoolRequestAction,
  updateUserWithSchoolLoading,
  ipZipCode,
  checkDistrictPolicy,
  districtId,
  isSignupUsingDaURL,
  t
}) => {
  const { email, firstName, middleName, lastName } = userInfo;
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
    } else if (!isSignupUsingDaURL && _school) {
      let signOnMethod = "userNameAndPassword";
      signOnMethod = userInfo.msoId ? "office365SignOn" : signOnMethod;
      signOnMethod = userInfo.cleverId ? "cleverSignOn" : signOnMethod;
      signOnMethod = userInfo.googleId ? "googleSignOn" : signOnMethod;

      checkDistrictPolicyRequestAction({
        data: { districtId: _school.districtId, email, type: userInfo.role, signOnMethod },
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
    }
    setTempSchool(null);
  }

  const handleSubmit = () => {
    const currentSignUpState = "PREFERENCE_NOT_SELECTED";
    const data = {
      institutionIds: [selected.schoolId || selected._id || ""],
      districtId: selected.districtId,
      currentSignUpState,
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
        searchSchoolByDistrictRequestAction({
          districtId,
          search: {
            name: [{ type: "cont", value: searchText }],
            city: [{ type: "cont", value: searchText }],
            zip: [{ type: "cont", value: searchText }]
          },
          searchKeysSearchType: "or"
        });
      } else {
        searchSchool({ ipZipCode, email, searchText });
      }
    }
  };

  const handleSearch = debounce(keyword => fetchSchool(keyword), 500);

  useEffect(() => {
    if (isSignupUsingDaURL || districtId) {
      searchSchoolByDistrictRequestAction({ districtId });
    } else {
      searchSchool({ ipZipCode, email });
    }
  }, []);

  useEffect(() => {
    if (newSchool._id && !homeSchool) {
      setSchool(newSchool._id);
    }
  }, [newSchool]);

  const dropdownSchoolData = useMemo(() => {
    return schools.map(item => {
      return {
        ...item,
        title: item.schoolName,
        key: item.schoolId,
        zip: get(item, "address.zip", ""),
        city: get(item, "address.city", "")
      };
    });
  }, [schools]);

  const onClickHomeSchool = event => {
    const schoolAndDistrictNamePrefix = userInfo.firstName + (userInfo.lastName ? userInfo.lastName + " " : " ");
    const districtName = schoolAndDistrictNamePrefix + "HOME SCHOOL DISTRICT";
    const schoolName = schoolAndDistrictNamePrefix + "HOME SCHOOL";

    const body = {
      name: schoolName,
      districtName: districtName,
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

    const { firstName, middleName, lastName } = userInfo;
    createAndJoinSchoolRequestAction({
      createSchool: body,
      joinSchool: {
        data: {
          currentSignUpState: "PREFERENCE_NOT_SELECTED",
          email: userInfo.email,
          firstName,
          middleName,
          lastName
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
                      <IconClose color={themeColor} onClick={() => setSchool(null)} />
                    </SelectedTag>
                  </SchoolSelected>
                ) : (
                  <StyledRemoteAutocompleteDropDown
                    by={""}
                    data={dropdownSchoolData}
                    onSearchTextChange={handleSearch}
                    iconType={"down"}
                    placeholder={t("component.signup.teacher.searchschool")}
                    ItemTemplate={SchoolDropDownItemTemplate}
                    minHeight="70px"
                    selectCB={changeSchool}
                    filterKeys={["title", "zip", "city"]}
                    isLoading={isSearching}
                    _ref={autoCompleteRef}
                    disabled={tempSelected ? true : false}
                  />
                )}
                <Actions>
                  <AnchorBtn onClick={onClickHomeSchool}> I want to homeschool</AnchorBtn>
                  {!isSignupUsingDaURL && !districtId ? (
                    <AnchorBtn onClick={toggleModal}> {t("component.signup.teacher.requestnewschool")}</AnchorBtn>
                  ) : null}
                  {selected && selected.districtName ? (
                    <DistrictName>
                      <span>{t("common.district")}: </span>
                      {selected.districtName}
                    </DistrictName>
                  ) : (
                    ""
                  )}
                </Actions>

                {selected && (
                  <>
                    <TeacherCarousel />
                    <ProceedBtn onClick={handleSubmit} disabled={updateUserWithSchoolLoading}>
                      {t("common.proceed")}
                    </ProceedBtn>
                  </>
                )}
              </SelectForm>
            </Col>
          </FlexWrapper>
        </Col>
      </JoinSchoolBody>
      {showModal ? <RequestSchoolModal isOpen={showModal} handleCancel={toggleModal} userInfo={userInfo} /> : null}
    </>
  );
};

JoinSchool.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  searchSchool: PropTypes.func.isRequired,
  schools: PropTypes.array.isRequired,
  newSchool: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  joinSchool: PropTypes.func.isRequired
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
      ipZipCode: getUserIPZipCode(state),
      districtId: getUserOrgId(state)
    }),
    {
      searchSchool: searchSchoolRequestAction,
      searchSchoolByDistrictRequestAction: searchSchoolByDistrictRequestAction,
      joinSchool: joinSchoolRequestAction,
      createAndJoinSchoolRequestAction: createAndJoinSchoolRequestAction,
      checkDistrictPolicyRequestAction
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
    font-size: 36px;
    line-height: 1.3;
    letter-spacing: -2px;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 15px;
    color: ${title};
  }
  h5 {
    font-size: 13px;
    margin-top: 10px;
    color: ${title};
  }

  @media (max-width: ${mobileWidthMax}) {
    margin-bottom: 30px;
    h3 {
      font-weight: 400;
    }
    h5 {
      font-size: 16px;
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
  font-size: 12px;
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
