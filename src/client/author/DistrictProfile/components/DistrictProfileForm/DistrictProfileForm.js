import { Col, Form, Icon, Popover } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { connect } from "react-redux";
import { compose } from "redux";
import { roleuser } from "@edulastic/constants";
import { getUserOrgId, getUserRole, getSaSchoolsSortedSelector } from "../../../src/selectors/user";
import {
  createDistrictProfileAction,
  receiveDistrictProfileAction,
  setDistrictValueAction,
  updateDistrictProfileAction,
  receiveSchoolProfileAction
} from "../../ducks";
import { ProfileImgWrapper, RightContainer } from "../Container/styled";
import EditableLabel from "../EditableLabel/EditableLabel";
import ImageUpload from "../ImageUpload/ImageUpload";
import {
  ColumnSpacer,
  EditableLabelDiv,
  FormColumnLeft,
  FormColumnRight,
  FormFlexContainer,
  HeaderRow,
  InputWithUrl,
  PopoverCloseButton,
  StyledDistrictUrl,
  StyledDivMain,
  StyledFormDiv,
  StyledFormItem,
  StyledPopoverContent,
  StyledRowLogo,
  StyledTextArea,
  StyledUrlButton
} from "./styled";

class DistrictProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverVisible: false,
      editing: false,
      districtUrl: ""
    };

    this.childRefArr = [];

    this.childRefArr.push(
      { name: "name", component: React.createRef() },
      { name: "shortName", component: React.createRef() },
      { name: "city", component: React.createRef() },
      { name: "state", component: React.createRef() },
      { name: "zip", component: React.createRef() },
      { name: "nces", component: React.createRef() },
      { name: "pageBackground", component: React.createRef() },
      { name: "logo", component: React.createRef() }
    );
  }

  componentDidMount() {
    const { loadDistrictProfile, loadSchoolProfile, userOrgId, role, schoolId } = this.props;
    if (role === roleuser.SCHOOL_ADMIN) {
      loadSchoolProfile(schoolId);
    }
    if (role === roleuser.DISTRICT_ADMIN) {
      loadDistrictProfile({ orgId: userOrgId, orgType: "district" });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.districtProfile == null || Object.keys(nextProps.districtProfile).length === 0) {
      return {
        districtProfile: {
          logo: "",
          pageBackground: "",
          name: "",
          shortName: "",
          city: "",
          state: "",
          zip: "",
          nces: "",
          announcement: ""
        }
      };
    } else
      return {
        districtProfile: nextProps.districtProfile,
        districtUrl: `${window.location.origin}/${nextProps.role === roleuser.DISTRICT_ADMIN ? "district" : "school"}/${
          nextProps.districtProfile.shortName
        }`
      };
  }

  handleVisibleChange = visible => {
    this.setState({ popoverVisible: visible });
  };

  updateImgSrc = (imgSrc, keyName) => {
    let districtProfile = { ...this.state.districtProfile };
    if (keyName === "pageBackground") {
      districtProfile.pageBackground = imgSrc;
    } else if (keyName === "logo") {
      districtProfile.logo = imgSrc;
    }
    this.props.setDistrictValue(districtProfile);
  };

  updateProfileName = newName => {
    let districtProfile = { ...this.state.districtProfile };
    districtProfile.name = newName;
    this.setState({ editing: false });
    this.props.setDistrictValue(districtProfile);
  };

  updateProfileValue = (valueName, value) => {
    let districtProfile = { ...this.state.districtProfile };

    if (valueName === "District Short Name" || valueName === "School Short Name") {
      districtProfile.shortName = value;
      this.setState({ districtUrl: `${window.location.origin}/district/${value}` });
    } else if (valueName === "City") {
      districtProfile.city = value;
    } else if (valueName === "State") {
      districtProfile.state = value;
    } else if (valueName === "Zip") {
      districtProfile.zip = value;
    } else if (valueName === "NCES Code") {
      districtProfile.nces = value;
    }
    this.setState({ editing: false });
    this.props.setDistrictValue(districtProfile);
  };

  setEditing = value => {
    this.setState({ editing: value });
  };

  changeAnnouncement = e => {
    let districtProfile = { ...this.state.districtProfile };
    districtProfile.announcement = e.target.value;
    this.props.setDistrictValue(districtProfile);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { districtProfile } = this.state;
    const { districtUrl, popoverVisible } = this.state;
    const { isInputEnabled, role, schools, schoolId } = this.props;
    const isDA = role === roleuser.DISTRICT_ADMIN;
    const popoverContent = (
      <React.Fragment>
        <StyledPopoverContent>
          <StyledDistrictUrl>{districtUrl}</StyledDistrictUrl>
          <CopyToClipboard text={districtUrl}>
            <PopoverCloseButton>
              <Icon type="copy" theme="twoTone" /> &nbsp;copy
            </PopoverCloseButton>
          </CopyToClipboard>
        </StyledPopoverContent>
        <p>Share this URL with users of your {isDA ? "disctrict" : "school"}.</p>
      </React.Fragment>
    );

    return (
      <StyledFormDiv>
        <Form>
          <ProfileImgWrapper>
            <ImageUpload
              width="200px"
              height="200px"
              imgSrc={districtProfile.logo}
              keyName="logo"
              updateImgUrl={this.updateImgSrc}
              labelStr="logo image"
              ref={this.childRefArr[7].component}
              requiredStatus={false}
              form={this.props.form}
              isInputEnabled={isInputEnabled}
            />
          </ProfileImgWrapper>
          <RightContainer>
            <StyledDivMain>
              <HeaderRow type="flex" align="middle" justify="space-between">
                <Col span={12}>
                  <h3>{isDA ? districtProfile.name : schools.find(item => item._id === schoolId)?.name || ""}</h3>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {districtProfile.shortName && (
                    <Popover
                      trigger="click"
                      visible={popoverVisible}
                      content={popoverContent}
                      onVisibleChange={this.handleVisibleChange}
                      placement="bottomRight"
                    >
                      <StyledUrlButton type="primary" ghost>
                        {isDA ? "District Url" : "School Url"}
                      </StyledUrlButton>
                    </Popover>
                  )}
                </Col>
              </HeaderRow>
              <StyledRowLogo>
                <ImageUpload
                  imgSrc={districtProfile.pageBackground}
                  updateImgUrl={this.updateImgSrc}
                  keyName="pageBackground"
                  width="100%"
                  height="180px"
                  labelStr="page background"
                  ref={this.childRefArr[6].component}
                  requiredStatus={false}
                  form={this.props.form}
                  isInputEnabled={isInputEnabled}
                />
              </StyledRowLogo>
              <FormFlexContainer>
                <FormColumnLeft>
                  <InputWithUrl>
                    <EditableLabel
                      value={districtProfile.shortName}
                      valueName={isDA ? "District Short Name" : "School Short Name"}
                      maxLength={10}
                      requiredStatus
                      setProfileValue={this.updateProfileValue}
                      updateEditing={this.setEditing}
                      type="text"
                      ref={this.childRefArr[1].component}
                      isSpaceEnable={false}
                      form={this.props.form}
                      isInputEnabled={isInputEnabled}
                      flexGrow={1}
                    />
                  </InputWithUrl>
                  <EditableLabel
                    value={districtProfile.city}
                    valueName="City"
                    maxLength={40}
                    requiredStatus={false}
                    setProfileValue={this.updateProfileValue}
                    updateEditing={this.setEditing}
                    type="text"
                    ref={this.childRefArr[2].component}
                    isSpaceEnable={true}
                    form={this.props.form}
                    isInputEnabled={isInputEnabled}
                  />
                  <EditableLabel
                    value={districtProfile.state}
                    valueName="State"
                    maxLength={40}
                    requiredStatus={false}
                    setProfileValue={this.updateProfileValue}
                    updateEditing={this.setEditing}
                    type="text"
                    ref={this.childRefArr[3].component}
                    isSpaceEnable={true}
                    isInputEnabled={isInputEnabled}
                    form={this.props.form}
                  />
                  <EditableLabel
                    value={districtProfile.zip}
                    valueName="Zip"
                    maxLength={20}
                    requiredStatus={false}
                    setProfileValue={this.updateProfileValue}
                    updateEditing={this.setEditing}
                    type="text"
                    ref={this.childRefArr[4].component}
                    isSpaceEnable={true}
                    isInputEnabled={isInputEnabled}
                    form={this.props.form}
                  />
                </FormColumnLeft>
                <ColumnSpacer />
                <FormColumnRight>
                  <EditableLabel
                    value={districtProfile.nces}
                    valueName="NCES Code"
                    maxLength={100}
                    requiredStatus={false}
                    setProfileValue={this.updateProfileValue}
                    updateEditing={this.setEditing}
                    type="text"
                    ref={this.childRefArr[5].component}
                    isSpaceEnable={true}
                    form={this.props.form}
                    isInputEnabled={isInputEnabled}
                  />
                  <EditableLabelDiv>
                    <label>{isDA ? "District Announcement" : "School Announcement"}</label>
                    <StyledFormItem>
                      {getFieldDecorator("announcement", {
                        initialValue: districtProfile.announcement,
                        rules: [{ required: false, message: "Please input your announcement" }]
                      })(
                        <StyledTextArea
                          rows={9}
                          onChange={this.changeAnnouncement}
                          onBlur={isInputEnabled ? this.onInputBlur : null} // edit state
                          readOnly={!isInputEnabled} // edit state
                          className={!isInputEnabled ? "not-editing-input" : null} // edit state
                          disabled={!isInputEnabled} // edit state
                        />
                      )}
                    </StyledFormItem>
                  </EditableLabelDiv>
                </FormColumnRight>
              </FormFlexContainer>
            </StyledDivMain>
          </RightContainer>
        </Form>
      </StyledFormDiv>
    );
  }
}

const DistrictProfileFormContainer = Form.create({ name: "district_profile_form" })(DistrictProfileForm);

const enhance = compose(
  connect(
    state => ({
      userOrgId: getUserOrgId(state),
      districtProfile: get(state, ["districtProfileReducer", "data"], {}),
      role: getUserRole(state),
      schoolId: get(state, "user.saSettingsSchool"),
      schools: getSaSchoolsSortedSelector(state)
    }),
    {
      loadDistrictProfile: receiveDistrictProfileAction,
      loadSchoolProfile: receiveSchoolProfileAction,
      createDistrictProfile: createDistrictProfileAction,
      updateDistrictProfile: updateDistrictProfileAction,
      setDistrictValue: setDistrictValueAction
    }
  )
);
export default enhance(DistrictProfileFormContainer);

DistrictProfileForm.propTypes = {
  loadDistrictProfile: PropTypes.func.isRequired,
  loadSchoolProfile: PropTypes.func.isRequired,
  updateDistrictProfile: PropTypes.func.isRequired
};
