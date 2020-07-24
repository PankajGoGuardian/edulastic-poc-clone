import { backgroundGrey2, themeColor } from "@edulastic/colors";
import {
  CheckBoxGrp,
  CheckboxLabel,
  CustomModalStyled,
  DatePickerStyled,
  EduButton,
  FieldLabel,
  notification,
  SelectInputStyled,
  TextAreaInputStyled,
  TextInputStyled,
  RadioBtn
} from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { Col, Row, Select, Spin, Radio } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUser, isOrganizationDistrictSelector } from "../../../src/selectors/user";
import {
  getCreateCollectionStateSelector,
  getDistrictListSelector,
  getFetchOrganizationStateSelector,
  getSchoolListSelector,
  getUserListSelector,
  searchOrgaizationRequestAction
} from "../../ducks";
import staticData from "../../staticData";
import { FieldRow, Heading, ModalBody } from "./ImportContentModal";

const { roleOptions, permissionLevelOptions } = staticData;

const AddPermissionModal = ({
  visible,
  handleResponse,
  user,
  isCreating,
  searchRequest,
  schoolList,
  userList,
  districtList,
  itemBankName,
  selectedPermission = {},
  isEditPermission,
  isFetchingOrganization,
  isOrganizationDistrict
}) => {
  // for any role except student will have only one Object in districts
  const [fieldData, setFieldData] = useState({
    districtId: user.role === "edulastic-admin" ? "" : user?.orgData?.districts?.[0]?.districtId,
    districtName: user.role === "edulastic-admin" ? "" : user?.orgData?.districts?.[0]?.districtName,
    orgType: "",
    orgDetails: [],
    role: [],
    itemBankName,
    accessLevel: ""
  });

  useEffect(() => {
    if (isEditPermission) {
      const {
        districtId,
        districtName,
        orgType,
        orgId,
        orgName,
        role,
        itemBankName: collectionName,
        startDate,
        endDate,
        csManager = "",
        opportunityId = "",
        notes = "",
        accessLevel = "read"
      } = selectedPermission;
      setFieldData({
        districtId,
        districtName,
        orgType,
        orgDetails: [{ orgId, orgName, role }],
        role,
        itemBankName: collectionName,
        accessLevel,
        ...(user.role === roleuser.EDULASTIC_ADMIN ? { startDate, endDate, csManager, opportunityId, notes } : {})
      });
      if (["SCHOOL", "USER"].includes(orgType)) {
        searchRequest({
          orgType,
          districtId,
          searchString: ""
        });
      }
      if (user.role === "edulastic-admin") {
        searchRequest({
          orgType: "DISTRICT",
          searchString: ""
        });
      }
    }

    if (!isEditPermission && !fieldData.orgType) {
      setFieldData(prevState => ({ ...prevState, accessLevel: "read" }));
    }

    // setting default start and end date.
    if (!isEditPermission && user.role === "edulastic-admin") {
      const startDate = moment().valueOf();
      const endDate = moment()
        .add(1, "years")
        .valueOf();
      setFieldData(prevState => ({ ...prevState, startDate, endDate }));
    }
  }, []);

  const validateFields = () => {
    if (!fieldData.orgType) {
      return notification({ messageKey: "pleaseSelectPersmissionLevel" });
    }
    if (!fieldData.orgDetails.length) {
      if (fieldData.orgType === "USER") return notification({ messageKey: "pleaseSelectAUser" });
      if (fieldData.orgType === "SCHOOL") return notification({ messageKey: "pleaseSelectSchool" });
    }
    if (fieldData.orgType !== "USER" && !fieldData.role.length) {
      return notification({ messageKey: "pleaseSelectAtleastOneRole" });
    }
    const { orgDetails, role, ..._permissionDetails } = fieldData;
    let permissionDetails;
    if (_permissionDetails.orgType !== "USER") {
      permissionDetails = orgDetails.map(d => {
        delete _permissionDetails.accessLevel;
        return { ...d, ..._permissionDetails, role };
      });
    } else {
      permissionDetails = orgDetails.map(d => ({ ...d, ..._permissionDetails }));
    }

    handleResponse(isEditPermission ? { ...permissionDetails[0] } : { permissionDetails });
  };

  const Footer = [
    <EduButton isGhost onClick={() => handleResponse()} disabled={isCreating}>
      CANCEL
    </EduButton>,
    <EduButton onClick={validateFields} loading={isCreating}>
      {isEditPermission ? "SAVE" : "APPLY"}
    </EduButton>
  ];

  const Title = [
    <>
      <Heading style={{ marginBottom: "0px" }}>{isEditPermission ? "Edit Permission" : "Add Permission"}</Heading>
      <ModalSubHeading>
        Collection: <span style={{ color: themeColor }}>{itemBankName}</span>
      </ModalSubHeading>
    </>
  ];

  const handleFieldChange = (fieldName, value) => {
    if (user.role === "edulastic-admin" && !fieldData.districtId) {
      return notification({ messageKey: "pleaseSelectAnOrganization" });
    }

    const updatedFieldData = { ...fieldData, [fieldName]: value };
    if (fieldName === "orgType") {
      if (value === "DISTRICT") {
        updatedFieldData.orgDetails = [{ orgId: fieldData.districtId, orgName: fieldData.districtName }];
      } else if (value === "SCHOOL") {
        updatedFieldData.orgDetails = [];
        updatedFieldData.role = updatedFieldData.role.filter(r => r !== "district-admin");
      } else {
        updatedFieldData.accessLevel = isOrganizationDistrict ? "write" : "read";
        updatedFieldData.orgDetails = [];
        updatedFieldData.role = [];
      }
    }
    setFieldData(updatedFieldData);
  };

  const handleSelectDistrict = (value, option) => {
    const { value: districtId, name: districtName } = option.props;

    // resetting all the org fields as we are changing the organization(district)
    setFieldData({ ...fieldData, districtId, districtName, orgType: "", orgDetails: [] });
  };

  const handleSchoolUserSelect = (value, options) => {
    const orgDetails = options.map(({ props: p }) => ({
      orgId: p.value,
      orgName: p.orgName,
      role: [p.role]
    }));
    setFieldData({ ...fieldData, orgDetails });
  };

  const handleSearch = (searchString, searchType) => {
    if (user.role === "edulastic-admin" && !fieldData.districtId && searchType !== "DISTRICT")
      return notification({ messageKey: "pleaseSelectDistrict" });
    const data = {
      orgType: searchType,
      searchString
    };
    if (searchType !== "DISTRICT") data.districtId = fieldData.districtId;
    searchRequest(data);
  };

  const handleDate = (fieldName, date) => {
    let currentDate = moment().format("DD-MM-YYYY");
    currentDate = moment(currentDate, "DD-MM-YYYY").valueOf();
    if (date < currentDate) {
      return notification({ messageKey: "pickedDateCannotBeLesseThanCurrentDate" });
    }
    if (fieldName === "startDate" && date >= fieldData?.endDate) {
      return notification({ messageKey: "startDateShouldBeLessThanTheEndDate" });
    }
    if (fieldName === "endDate" && date <= fieldData?.startDate) {
      return notification({ messageKey: "endDateShouldBeMoreThanThestartDate" });
    }
    handleFieldChange(fieldName, date);
  };

  return (
    <CustomModalStyled
      title={Title}
      visible={visible}
      footer={Footer}
      onCancel={() => handleResponse(null)}
      width={400}
      centered
    >
      <ModalBody>
        {user.role === roleuser.EDULASTIC_ADMIN && (
          <StyledFieldRow>
            <FieldLabel>Organization</FieldLabel>
            <SelectInputStyled
              disabled={isEditPermission}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              style={{ width: "100%" }}
              showSearch
              placeholder="Search for an organization"
              notFoundContent={isFetchingOrganization ? <Spin size="small" /> : null}
              value={fieldData.districtId}
              onFocus={() => handleSearch("", "DISTRICT")}
              onChange={handleSelectDistrict}
              filterOption={(inputValue, option) =>
                option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {districtList.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id} name={name}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledFieldRow>
        )}
        <StyledFieldRow>
          <FieldLabel>Permission Level</FieldLabel>
          <SelectInputStyled
            disabled={isEditPermission}
            style={{ width: "100%" }}
            placeholder="Select a permission"
            getPopupContainer={triggerNode => triggerNode.parentNode}
            value={fieldData.orgType}
            onChange={value => handleFieldChange("orgType", value)}
          >
            {permissionLevelOptions.map(option => (
              <Select.Option value={option.value}>{option.label}</Select.Option>
            ))}
          </SelectInputStyled>
        </StyledFieldRow>

        {["SCHOOL", "USER"].includes(fieldData.orgType) && (
          <StyledFieldRow>
            <FieldLabel>{fieldData.orgType}</FieldLabel>
            <SelectInputStyled
              disabled={isEditPermission}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              style={{ width: "100%" }}
              showSearch
              mode="multiple"
              placeholder={fieldData.orgType === "SCHOOL" ? "Please select school" : "Please select user"}
              notFoundContent={isFetchingOrganization ? <Spin size="small" /> : null}
              value={fieldData.orgDetails.map(o => o.orgId)}
              onFocus={() => handleSearch("", fieldData.orgType)}
              onChange={handleSchoolUserSelect}
              filterOption={(inputValue, option) =>
                option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
              }
            >
              {fieldData.orgType === "SCHOOL" &&
                schoolList.map(school => (
                  <Select.Option value={school._id} key={school._id} orgName={school.name}>
                    {school.name}
                  </Select.Option>
                ))}
              {fieldData.orgType === "USER" &&
                userList.map(_user => (
                  <Select.Option
                    value={_user._id}
                    key={_user._id}
                    orgName={`${_user.firstName} ${_user.lastName}`}
                    role={_user.role}
                  >
                    {`${_user.firstName} ${_user.lastName} (${_user.email})`}
                  </Select.Option>
                ))}
            </SelectInputStyled>
          </StyledFieldRow>
        )}
        <StyledFieldRow>
          <FieldLabel>Role</FieldLabel>
          <CheckBoxGrp onChange={value => handleFieldChange("role", value)} value={fieldData.role}>
            {roleOptions.map(checkbox => (
              <CheckboxLabel
                style={{ width: "50%", marginLeft: "0px" }}
                disabled={
                  (fieldData.orgType === "SCHOOL" && checkbox.value === "district-admin") ||
                  fieldData.orgType === "USER"
                }
                value={checkbox.value}
              >
                {checkbox.label}
              </CheckboxLabel>
            ))}
          </CheckBoxGrp>
        </StyledFieldRow>
        {fieldData.orgType === "USER" && (
          <StyledFieldRow>
            <label>Add Content</label>
            <Radio.Group
              value={fieldData.accessLevel}
              onChange={e => handleFieldChange("accessLevel", e.target.value)}
              style={{ width: "50%" }}
            >
              <RadioBtn value="write">Write</RadioBtn>
              <RadioBtn value="read">Read</RadioBtn>
            </Radio.Group>
          </StyledFieldRow>
        )}
        {user.role === "edulastic-admin" && (
          <>
            <StyledFieldRow>
              <Row gutter={20}>
                <Col span={12}>
                  <FieldLabel>Start Date</FieldLabel>
                  <DatePickerStyled
                    style={{ width: "100%" }}
                    placeholder="Set a start date"
                    format="DD-MM-YYYY"
                    showTime
                    value={(fieldData.startDate && moment(fieldData.startDate)) || ""}
                    onChange={date => handleDate("startDate", date?.valueOf() || "")}
                  />
                </Col>
                <Col span={12}>
                  <FieldLabel>End Date</FieldLabel>
                  <DatePickerStyled
                    style={{ width: "100%" }}
                    placeholder="Set an end date"
                    format="DD-MM-YYYY"
                    showTime
                    value={(fieldData.endDate && moment(fieldData.endDate)) || ""}
                    onChange={date => handleDate("endDate", date?.valueOf() || "")}
                  />
                </Col>
              </Row>
            </StyledFieldRow>
            <StyledFieldRow>
              <FieldLabel>CS Manager</FieldLabel>
              <TextInputStyled
                placeholder="Type the CS Manager"
                value={fieldData.csManager || ""}
                onChange={e => handleFieldChange("csManager", e.target.value)}
              />
            </StyledFieldRow>
            <StyledFieldRow>
              <FieldLabel>Opportunity Id</FieldLabel>
              <TextInputStyled
                placeholder="Type the ID"
                value={fieldData.opportunityId || ""}
                onChange={e => handleFieldChange("opportunityId", e.target.value)}
              />
            </StyledFieldRow>
            <StyledFieldRow>
              <FieldLabel>Notes</FieldLabel>
              <TextAreaInputStyled
                height="80px"
                placeholder="Type notes..."
                value={fieldData.notes || ""}
                onChange={e => handleFieldChange("notes", e.target.value)}
              />
            </StyledFieldRow>
          </>
        )}
      </ModalBody>
    </CustomModalStyled>
  );
};

export default connect(
  state => ({
    user: getUser(state),
    isCreating: getCreateCollectionStateSelector(state),
    schoolList: getSchoolListSelector(state),
    userList: getUserListSelector(state),
    districtList: getDistrictListSelector(state),
    isFetchingOrganization: getFetchOrganizationStateSelector(state),
    isOrganizationDistrict: isOrganizationDistrictSelector(state)
  }),
  { searchRequest: searchOrgaizationRequestAction }
)(AddPermissionModal);

AddPermissionModal.propTypes = {
  user: PropTypes.object,
  isCreating: PropTypes.bool,
  schoolList: PropTypes.array,
  userList: PropTypes.array,
  districtList: PropTypes.array,
  isFetchingOrganization: PropTypes.bool,
  searchRequest: PropTypes.func,
  visible: PropTypes.bool,
  handleResponse: PropTypes.func,
  itemBankName: PropTypes.string,
  selectedPermission: PropTypes.object,
  isEditPermission: PropTypes.bool
};

AddPermissionModal.defaultProps = {
  user: {},
  isCreating: false,
  schoolList: [],
  userList: [],
  districtList: [],
  isFetchingOrganization: false,
  searchRequest: () => { },
  visible: true,
  handleResponse: () => { },
  itemBankName: "",
  selectedPermission: {},
  isEditPermission: false
};

const StyledFieldRow = styled(FieldRow)`
  &:last-child {
    margin-bottom: 0px;
  }

  .ant-switch {
    margin-left: 20px;
  }

  textarea {
    background: ${backgroundGrey2};
  }
`;

const ModalSubHeading = styled.span`
  font-size: ${props => props.theme.bodyFontSize};
  text-transform: uppercase;
  font-weight: ${props => props.theme.semiBold};
`;
