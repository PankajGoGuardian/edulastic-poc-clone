import { extraDesktopWidthMax, linkColor, mediumDesktopExactWidth, mobileWidthLarge } from "@edulastic/colors";
import { CustomModalStyled, EduButton } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { Form } from "antd";
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
    userInfo: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    isOpen: false
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, districts, createAndJoinSchoolRequestAction, userInfo } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { name, districtId, address, city, country, state, zip } = values;
        const district = find(districts, ({ districtId: _id }) => _id === districtId.key) || {
          districtName: districtId.title
        };
        const { districtName } = district;
        const body = {
          name,
          districtName,
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
        const { firstName, middleName, lastName, email, _id } = userInfo;
        createAndJoinSchoolRequestAction({
          createSchool: body,
          joinSchool: {
            data: {
              currentSignUpState: "PREFERENCE_NOT_SELECTED",
              email,
              firstName,
              middleName,
              lastName
            },
            userId: _id
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
      <CustomModalStyled width="700px" title={title} visible={isOpen} footer={footer} onCancel={handleCancel} centered>
        <RequestSchoolForm form={form} t={t} handleSubmit={this.handleSubmit} userInfo={userInfo} />
      </CustomModalStyled>
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
      createAndJoinSchoolRequestAction
    }
  )
);
export default enhance(RequestSchoolModal);

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
