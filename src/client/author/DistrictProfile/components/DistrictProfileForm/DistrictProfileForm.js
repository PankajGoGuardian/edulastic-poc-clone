import React, { Component } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";

import ImageUpload from "../../../Shared/Components/ImageUpload/ImageUpload";
import { Form, Icon, Popover } from "antd";
const FormItem = Form.Item;

import {
  StyledFormDiv,
  StyledDivBg,
  StyledDivMain,
  StyledLabel,
  StyledRow,
  StyledRowLogo,
  StyledRowAnn,
  StyledLabelSH,
  StyledInputB,
  StyledTextArea,
  StyledInput,
  SaveButton,
  StyledUrlButton,
  StyledPopoverContent,
  PopoverCloseButton,
  StyledDistrictUrl,
  StyledFormItem
} from "./styled";

class DistrictProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: this.props.districtProfile.logo,
      pageBackground: this.props.districtProfile.pageBackground,
      districtUrl: "http://edulastic-poc.snapwiz.net/district/" + this.props.districtProfile.shortName,
      popoverVisible: false,
      nameWidth: this.props.districtProfile.name.length * 9.5
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.saveDistrictProfile(Object.assign(this.props.districtProfile, values, this.state));
      }
    });
  };

  handleChangeShortName = e => {
    this.setState({
      districtUrl: "http://edulastic-poc.snapwiz.net/district/" + e.target.value
    });
  };

  handleVisibleChange = visible => {
    this.setState({ popoverVisible: visible });
  };

  updateImgSrc = (imgSrc, keyName) => {
    if (keyName === "pageBackground") this.setState({ pageBackground: imgSrc });
    else if (keyName === "logo") this.setState({ logo: imgSrc });
  };

  changeProfileName = e => {
    this.setState({
      nameWidth: e.target.value.length * 9.5
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { districtProfile } = this.props;
    const { districtUrl, popoverVisible, nameWidth } = this.state;

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
        <Form onSubmit={this.handleSubmit}>
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
              <StyledFormItem widthSize={nameWidth}>
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "Please input your name!" }],
                  initialValue: districtProfile.name
                })(<StyledInputB suffix={<Icon type="edit" theme="twoTone" />} onChange={this.changeProfileName} />)}
              </StyledFormItem>
            </StyledRow>
            <StyledRow>
              <StyledLabel>District Short Name:</StyledLabel>
              <FormItem>
                {getFieldDecorator("shortName", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your District Short Name!"
                    },
                    {
                      max: 10,
                      message: (
                        <p>
                          District Short Name must be less <br />
                          than 10 letters or equal!
                        </p>
                      )
                    }
                  ],
                  initialValue: districtProfile.shortName
                })(<StyledInput onChange={this.handleChangeShortName} suffix={<Icon type="edit" theme="twoTone" />} />)}
              </FormItem>
              <Popover
                trigger="click"
                visible={popoverVisible}
                content={popoverContent}
                onVisibleChange={this.handleVisibleChange}
              >
                <StyledUrlButton>(District Url)</StyledUrlButton>
              </Popover>
            </StyledRow>
            <StyledRow>
              <StyledLabel>City:</StyledLabel>
              <FormItem>
                {getFieldDecorator("city", {
                  rules: [{ required: true, message: "Please input your City!" }],
                  initialValue: districtProfile.city
                })(<StyledInput suffix={<Icon type="edit" theme="twoTone" />} />)}
              </FormItem>
            </StyledRow>
            <StyledRow>
              <StyledLabel>State:</StyledLabel>
              <FormItem>
                {getFieldDecorator("state", {
                  rules: [{ required: true, message: "Please input your State!" }],
                  initialValue: districtProfile.state
                })(<StyledInput suffix={<Icon type="edit" theme="twoTone" />} />)}
              </FormItem>
            </StyledRow>
            <StyledRow>
              <StyledLabel>Zip:</StyledLabel>
              <FormItem>
                {getFieldDecorator("zip", {
                  rules: [{ required: true, message: "Please input your Zip!" }],
                  initialValue: districtProfile.zip
                })(<StyledInput suffix={<Icon type="edit" theme="twoTone" />} />)}
              </FormItem>
            </StyledRow>
            <StyledRow>
              <StyledLabel>NCES Code:</StyledLabel>
              <FormItem>
                {getFieldDecorator("nces", {
                  rules: [{ required: true, message: "Please input your NCES Code!" }],
                  initialValue: districtProfile.nces
                })(<StyledInput suffix={<Icon type="edit" theme="twoTone" />} />)}
              </FormItem>
            </StyledRow>
            <StyledRowLogo>
              <StyledLabelSH>District Logo:</StyledLabelSH>
              <ImageUpload
                width={"150px"}
                height={"80px"}
                imgSrc={districtProfile.logo}
                keyName={"logo"}
                updateImgUrl={this.updateImgSrc}
              />
            </StyledRowLogo>
            <StyledRowAnn>
              <StyledLabelSH>District Announcement:</StyledLabelSH>
              <FormItem>
                {getFieldDecorator("announcement", {
                  initialValue: districtProfile.announcement
                })(<StyledTextArea rows={6} />)}
              </FormItem>
            </StyledRowAnn>
            <StyledRow>
              <SaveButton htmlType="submit">Save</SaveButton>
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
