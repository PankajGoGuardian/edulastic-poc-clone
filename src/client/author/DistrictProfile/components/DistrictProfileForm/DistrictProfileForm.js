import React, { Component } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";

import ImageUpload from "../../../Shared/Components/ImageUpload/ImageUpload";
import EditableNameLabel from "../EditableNameLabel/EditableNameLabel";
import EditableLabel from "../EditableLabel/EditableLabel";

import { Form, Icon, Popover } from "antd";
const FormItem = Form.Item;

import {
  StyledFormDiv,
  StyledDivBg,
  StyledDivMain,
  StyledRow,
  StyledRowLogo,
  StyledRowAnn,
  StyledLabel,
  StyledTextArea,
  SaveButton,
  StyledUrlButton,
  StyledPopoverContent,
  PopoverCloseButton,
  StyledDistrictUrl
} from "./styled";

class DistrictProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: this.props.districtProfile.logo,
      pageBackground: this.props.districtProfile.pageBackground,
      districtUrl: "http://edulastic-poc.snapwiz.net/district/" + this.props.districtProfile.shortName,
      popoverVisible: false,
      name: this.props.districtProfile.name,
      shortName: this.props.districtProfile.shortName,
      city: this.props.districtProfile.city,
      state: this.props.districtProfile.state,
      zip: this.props.districtProfile.zip,
      nces: this.props.districtProfile.nces,
      editing: false
    };
  }

  handleSubmit = () => {
    const saveData = { ...this.state };
    if (saveData.editing) return;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.saveDistrictProfile(Object.assign(this.props.districtProfile, values, saveData));
      }
    });
  };

  handleVisibleChange = visible => {
    this.setState({ popoverVisible: visible });
  };

  updateImgSrc = (imgSrc, keyName) => {
    if (keyName === "pageBackground") this.setState({ pageBackground: imgSrc });
    else if (keyName === "logo") this.setState({ logo: imgSrc });
  };

  updateProfileName = newName => {
    this.setState({ name: newName, editing: false });
  };

  updateProfileValue = (valueName, value) => {
    if (valueName === "District Short Name") {
      this.setState({
        shortName: value,
        districtUrl: `${window.location.origin}/district/${value}`,
        editing: false
      });
    } else if (valueName === "City") {
      this.setState({ city: value, editing: false });
    } else if (valueName === "State") {
      this.setState({ state: value, editing: false });
    } else if (valueName === "Zip") {
      this.setState({ zip: value, editing: false });
    } else if (valueName === "NCES Code") {
      this.setState({ nces: value, editing: false });
    }
  };

  setEditing = value => {
    this.setState({ editing: value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { districtProfile } = this.props;
    const { districtUrl, popoverVisible, editing } = this.state;

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
        <p>Share this URL with users of your disctrict.</p>
      </React.Fragment>
    );
    return (
      <StyledFormDiv>
        <Form>
          <StyledDivBg>
            <ImageUpload
              imgSrc={districtProfile.pageBackground}
              updateImgUrl={this.updateImgSrc}
              keyName={"pageBackground"}
              width={"100%"}
              height={"180px"}
            />
          </StyledDivBg>
          <StyledDivMain>
            <StyledRow>
              <EditableNameLabel
                value={districtProfile.name}
                setProfileName={this.updateProfileName}
                updateEditing={this.setEditing}
              />
            </StyledRow>
            <StyledRow>
              <EditableLabel
                value={districtProfile.shortName}
                valueName={"District Short Name"}
                maxLength={10}
                requiredStatus={true}
                setProfileValue={this.updateProfileValue}
                updateEditing={this.setEditing}
              />
              <Popover
                trigger="click"
                visible={popoverVisible}
                content={popoverContent}
                onVisibleChange={this.handleVisibleChange}
              >
                <StyledUrlButton type="primary" ghost>
                  (District Url)
                </StyledUrlButton>
              </Popover>
            </StyledRow>
            <StyledRow>
              <EditableLabel
                value={districtProfile.city}
                valueName={"City"}
                maxLength={40}
                requiredStatus={true}
                setProfileValue={this.updateProfileValue}
                updateEditing={this.setEditing}
              />
            </StyledRow>
            <StyledRow>
              <EditableLabel
                value={districtProfile.state}
                valueName={"State"}
                maxLength={40}
                requiredStatus={true}
                setProfileValue={this.updateProfileValue}
                updateEditing={this.setEditing}
              />
            </StyledRow>
            <StyledRow>
              <EditableLabel
                value={districtProfile.zip}
                valueName={"Zip"}
                maxLength={20}
                requiredStatus={true}
                setProfileValue={this.updateProfileValue}
                updateEditing={this.setEditing}
              />
            </StyledRow>
            <StyledRow>
              <EditableLabel
                value={districtProfile.nces}
                valueName={"NCES Code"}
                maxLength={100}
                requiredStatus={false}
                setProfileValue={this.updateProfileValue}
                updateEditing={this.setEditing}
              />
            </StyledRow>
            <StyledRowLogo>
              <StyledLabel>District Logo:</StyledLabel>
              <ImageUpload
                width={"150px"}
                height={"80px"}
                imgSrc={districtProfile.logo}
                keyName={"logo"}
                updateImgUrl={this.updateImgSrc}
              />
            </StyledRowLogo>
            <StyledRowAnn>
              <StyledLabel>District Announcement:</StyledLabel>
              <FormItem>
                {getFieldDecorator("announcement", {
                  initialValue: districtProfile.announcement
                })(<StyledTextArea rows={6} />)}
              </FormItem>
            </StyledRowAnn>
            <StyledRow>
              <SaveButton type="primary" onClick={this.handleSubmit} disabled={editing}>
                Save
              </SaveButton>
            </StyledRow>
          </StyledDivMain>
        </Form>
      </StyledFormDiv>
    );
  }
}

const DistrictProfileFormContainer = Form.create()(DistrictProfileForm);

export default DistrictProfileFormContainer;

DistrictProfileForm.propTypes = {
  districtProfile: PropTypes.object.isRequired,
  saveDistrictProfile: PropTypes.func.isRequired
};
