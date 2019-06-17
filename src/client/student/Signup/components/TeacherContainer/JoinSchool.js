import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { get, debounce, find, split } from "lodash";
import { Row, Col, Select } from "antd";
import styled from "styled-components";
import { IconHeader } from "@edulastic/icons";
import { springGreen, white, title, fadedGrey } from "@edulastic/colors";

import { Button } from "antd/lib/radio";
import TeacherCarousel from "./TeacherCarousel";
import RequestSchoolModal from "./RequestSchoolModal";

import { searchSchoolRequestAction, joinSchoolRequestAction, updateUserWithSchoolLoadingSelector } from "../../duck";
import { getUserIPZipCode } from "../../../../author/src/selectors/user";
import { RemoteAutocompleteDropDown } from "../../../../common/components/widgets/remoteAutoCompleteDropDown";

const { Option } = Select;

const SchoolDropDownItemTemplate = ({ itemData: school }) => {
  const { address, location } = school;
  const schoolLocation = address || location;

  return (
    <OptionBody>
      <SchoolInfo>
        <span>{school.schoolName || school.name}</span>
        {`${schoolLocation.city ? schoolLocation.city + ", " : ""} ${
          schoolLocation.state ? schoolLocation.state + ", " : ""
        } ${schoolLocation.zip}`}
      </SchoolInfo>
      <DistrictInfo>
        <span>District:</span>
        {school.districtName}
      </DistrictInfo>
    </OptionBody>
  );
};

const JoinSchool = ({
  isSearching,
  searchSchool,
  schools,
  newSchool,
  userInfo,
  joinSchool,
  updateUserWithSchoolLoading,
  ipZipCode,
  districtId
}) => {
  const { email, firstName, middleName, lastName } = userInfo;
  const [selected, setSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const changeSchool = value => {
    const _school = find(schools, item => item.schoolId === value.key);
    setSchool(_school);
  };

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
    if (searchText) {
      searchSchool({ ipZipCode, email, searchText });
    }
  };

  const handleSearch = debounce(keyword => fetchSchool(keyword), 500);

  useEffect(() => {
    searchSchool({ ipZipCode, email });
  }, []);

  useEffect(() => {
    if (newSchool._id) {
      setSchool(newSchool._id);
    }
  }, [newSchool]);

  const dropdownSchoolData = useMemo(() => {
    return schools.map(item => {
      return {
        ...item,
        title: item.schoolName,
        key: item.schoolId,
        zip: item.address.zip,
        city: item.address.city
      };
    });
  }, [schools]);

  return (
    <>
      <JoinSchoolBody type="flex" align="middle">
        <Col xs={18} offset={3}>
          <Row type="flex" align="middle">
            <BannerText md={12}>
              <SchoolIcon />
              <h3>
                Join your school <br /> community
              </h3>
              <div>
                Collaborate with your colleagues <br /> and more
              </div>
            </BannerText>
            <Col md={12}>
              <SelectForm>
                <StyledRemoteAutocompleteDropDown
                  by={""}
                  data={dropdownSchoolData}
                  onSearchTextChange={handleSearch}
                  iconType={"down"}
                  placeholder="Search school by Zip, name or City"
                  ItemTemplate={SchoolDropDownItemTemplate}
                  minHeight="70px"
                  selectCB={changeSchool}
                  filterKeys={["title", "zip", "city"]}
                  isLoading={isSearching}
                />
                <Actions>
                  {/* I want to home school removed temporarily */}
                  {/* <AnchorBtn> I want to homeschool</AnchorBtn> */}
                  <AnchorBtn onClick={toggleModal}> Request a new School</AnchorBtn>
                  {selected && (
                    <DistrictName>
                      <span>District:</span> {selected.districtName}
                    </DistrictName>
                  )}
                </Actions>

                {selected && (
                  <>
                    <TeacherCarousel />
                    <ProceedBtn onClick={handleSubmit} disabled={updateUserWithSchoolLoading}>
                      Proceed
                    </ProceedBtn>
                  </>
                )}
              </SelectForm>
            </Col>
          </Row>
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
  connect(
    state => ({
      isSearching: get(state, "signup.isSearching", false),
      schools: get(state, "signup.schools", []),
      newSchool: get(state, "signup.newSchool", {}),
      updateUserWithSchoolLoading: updateUserWithSchoolLoadingSelector(state),
      ipZipCode: getUserIPZipCode(state)
    }),
    { searchSchool: searchSchoolRequestAction, joinSchool: joinSchoolRequestAction }
  )
);

export default enhance(JoinSchool);

const JoinSchoolBody = styled(Row)`
  margin-top: 80px;
`;

const BannerText = styled(Col)`
  text-align: center;
  h3 {
    font-size: 46px;
    line-height: 1.3;
    letter-spacing: -2px;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 15px;
    color: ${title};
  }

  div {
    font-size: 13px;
    margin-top: 10px;
    color: ${title};
  }
`;

const SelectForm = styled.div`
  max-width: 640px;
  margin: 0px auto;
  padding: 32px;
  background: ${fadedGrey};
  border-radius: 8px;
  text-align: center;
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
  border-bottom: 2px ${springGreen} solid;
  font-weight: 600;
  padding-bottom: 2px;
  font-size: 12px;
  margin-left: 16px;
  user-select: none;
  cursor: pointer;
`;

const SchoolIcon = styled(IconHeader)`
  width: 119px;
  height: 21px;
`;

const SchoolSelect = styled(Select)`
  width: 100%;
  .ant-select-selection {
    height: 32px;
    overflow: hidden;
  }
`;

const ProceedBtn = styled(Button)`
  background: ${springGreen};
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
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

const SchoolInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  span {
    font-weight: 600;
  }
`;

const DistrictInfo = styled.div`
  span {
    font-weight: 600;
  }
`;

const StyledRemoteAutocompleteDropDown = styled(RemoteAutocompleteDropDown)`
  width: 100%;
`;
