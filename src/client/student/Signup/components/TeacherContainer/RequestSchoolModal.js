import {
  boxShadowDefault,
  extraDesktopWidthMax,
  lightGrey3,
  linkColor,
  mediumDesktopExactWidth,
  mobileWidthLarge,
  smallDesktopWidth,
  themeColor
} from "@edulastic/colors";
import { EduButton } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { Form, Modal } from "antd";
import { find, get } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import styled from "styled-components";
import { createAndJoinSchoolRequestAction, searchDistrictsRequestAction } from "../../duck";
import RequestSchoolForm from "./RequestSchoolForm";

class RequestSchool extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    districts: PropTypes.array.isRequired,
    isSearching: PropTypes.bool.isRequired,
    searchDistrict: PropTypes.func.isRequired,
    userInfo: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    isOpen: false
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, districts, createAndJoinSchoolRequestAction, homeSchool } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { name, districtId, address, city, country, state, zip } = values;
        const district = find(districts, ({ districtId: _id }) => _id === districtId.key) || {
          districtName: districtId.title
        };
        const { districtName } = district;
        const body = {
          name,
          districtName: districtName,
          location: {
            city,
            state,
            zip,
            address,
            country
          },
          requestNewSchool: true
        };

        if (district.districtId) {
          body.districtId = district.districtId;
        }
        if (homeSchool) {
          body.homeSchool = true;
        }
        const { firstName, middleName, lastName } = this.props.userInfo;
        createAndJoinSchoolRequestAction({
          createSchool: body,
          joinSchool: {
            data: {
              currentSignUpState: "PREFERENCE_NOT_SELECTED",
              email: this.props.userInfo.email,
              firstName,
              middleName,
              lastName
            },
            userId: this.props.userInfo._id
          }
        });
      }
    });
  };

  render() {
    const { isOpen, handleCancel, form, t, userInfo } = this.props;

    const title = (
      <Title>
        <h4>{t("component.signup.teacher.requestnewschool")}</h4>
        <span>{t("component.signup.teacher.infotext")}</span>
      </Title>
    );

    const footer = (
      <EduButton height="32px" data-cy="reqNewSchoolBtn" onClick={this.handleSubmit} htmlType="submit">
        <span>{t("component.signup.teacher.requestnewschool")}</span>
      </EduButton>
    );

    return (
      <StyledModal title={title} visible={isOpen} footer={footer} onCancel={handleCancel} centered>
        <RequestSchoolForm form={form} t={t} handleSubmit={this.handleSubmit} userInfo={userInfo} />
      </StyledModal>
    );
  }
}

const RequestSchoolModal = Form.create({ name: "request_school" })(RequestSchool);

const enhance = compose(
  withNamespaces("login"),
  withRouter,
  connect(
    state => ({
      isSearching: get(state, "signup.isSearching", false),
      districts: get(state, "signup.districts", []),
      autocompleteDistricts: get(state, "signup.autocompleteDistricts", [])
    }),
    {
      searchDistrict: searchDistrictsRequestAction,
      createAndJoinSchoolRequestAction: createAndJoinSchoolRequestAction
    }
  )
);
export default enhance(RequestSchoolModal);

const StyledModal = styled(Modal)`
  min-width: 60vw;
  .ant-modal-body {
    padding: 20px;

    @media (min-width: ${smallDesktopWidth}) {
      padding-right: 40px;
    }
    @media (min-width: ${mediumDesktopExactWidth}) {
      padding-right: 80px;
    }
  }
  .ant-modal-content,
  .ant-modal-header {
    background-color: ${lightGrey3};
    border-bottom: 0px;
  }
  .ant-modal-header {
    padding: 40px 50px 10px;
  }
  .ant-modal-footer {
    display: flex;
    justify-content: center;
    border-top: 0px;
    padding: 10px 24px 40px;
  }
  .ant-form-item {
    text-align: center;
    display: flex;
    align-items: center;
  }
  .ant-form-item-required::before {
    display: none;
  }
  .ant-form-item label {
    font-weight: 600;
    font-size: 16px;
  }
  .ant-form-item-label {
    & > label::after {
      content: "";
    }
    align-self: start;
    padding-top: 5px;
  }
  .ant-select-arrow,
  .ant-modal-close-x {
    svg {
      fill: ${themeColor};
    }
  }
  .ant-select {
    width: 100%;
  }
  .ant-select-selection {
    height: 32px;
    overflow: hidden;
  }
  .ant-select-selection-selected-value {
    div:nth-child(1) {
      display: block;
      text-align: left;
    }
  }
  .ant-form-item-control {
    line-height: normal;
  }
  .ant-form > .ant-form-item:nth-child(2) {
    .ant-form-item-control-wrapper {
      display: flex;
      justify-content: left;
      align-items: center;
      .ant-form-item-control {
        width: 100%;
        .remote-autocomplete-dropdown {
          display: flex;
          margin: 0;
        }
      }
    }
  }
  .ant-modal-close-x svg {
    width: 20px;
    height: 20px;
  }
  .ant-select-selection,
  .ant-input {
    border: none;
    box-shadow: ${boxShadowDefault};
  }
  .remote-autocomplete-dropdown {
    border: none;
    box-shadow: ${boxShadowDefault};
  }
  .has-error .ant-input {
    border: 1px solid red;
  }
  @media (max-width: ${mobileWidthLarge}) {
    &.ant-modal {
      min-width: 90%;
      top: 20px;
    }
    .ant-row.ant-form-item {
      margin-bottom: 15px;
      &:nth-last-child(1) {
        margin: 0px;
      }
    }
  }
`;

const Title = styled.div`
  color: ${linkColor};
  h4 {
    font-weight: 700;
    font-size: 16px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 18px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 22px;
    }
  }
  span {
    font-size: 13px;
    letter-spacing: -0.7px;
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 14px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 16px;
    }
  }

  @media (max-width: ${mobileWidthLarge}) {
    text-align: center;
    font-size: 14px;
    h4 {
      font-size: 22px;
    }
  }
`;
