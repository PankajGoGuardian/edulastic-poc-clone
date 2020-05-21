import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, find } from "lodash";
import styled from "styled-components";
import { Form } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { EduButton } from "@edulastic/common";
import { themeColor, mobileWidthLarge, greyGraphstroke } from "@edulastic/colors";

import { searchDistrictsRequestAction, createAndJoinSchoolRequestAction } from "../../duck";
import { createAndAddSchoolAction } from "../../../Login/ducks";
import RequestSchoolForm from "./RequestSchoolForm";

class RequestSchool extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    districts: PropTypes.array.isRequired,
    userInfo: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, districts, userInfo, createAndAddSchool } = this.props;
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

        const { firstName, middleName, lastName, institutionIds } = userInfo;
        createAndAddSchool({
          createSchool: body,
          joinSchool: {
            data: {
              email: userInfo.email,
              firstName,
              middleName,
              lastName
            },
            userId: userInfo._id
          },
          institutionIds
        });
      }
    });
  };

  render() {
    const { form, t, creatingAddingSchool, userInfo } = this.props;

    return (
      <RequestFormWrapper>
        <RequestSchoolForm form={form} t={t} handleSubmit={this.handleSubmit} userInfo={userInfo} />
        <ButtonRow>
          <EduButton
            height="32px"
            data-cy="reqNewSchoolBtn"
            onClick={this.handleSubmit}
            htmlType="submit"
            disabled={creatingAddingSchool}
          >
            <span>{t("component.signup.teacher.requestnewschool")}</span>
          </EduButton>
        </ButtonRow>
      </RequestFormWrapper>
    );
  }
}

const RequestSchoolSection = Form.create({ name: "request_school" })(RequestSchool);

const enhance = compose(
  withNamespaces("login"),
  withRouter,
  connect(
    state => ({
      isSearching: get(state, "signup.isSearching", false),
      districts: get(state, "signup.districts", []),
      autocompleteDistricts: get(state, "signup.autocompleteDistricts", []),
      creatingAddingSchool: get(state, "user.creatingAddingSchool")
    }),
    {
      searchDistrict: searchDistrictsRequestAction,
      createAndJoinSchoolRequest: createAndJoinSchoolRequestAction,
      createAndAddSchool: createAndAddSchoolAction
    }
  )
);

export default enhance(RequestSchoolSection);

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const RequestFormWrapper = styled.div`
  margin-left: 10px;
  .ant-form-item {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .ant-form-item-required::before {
    display: none;
  }
  .ant-form-item-label {
    text-align: left;
  }
  .ant-form-item label {
    font-weight: 600;
    font-size: 16px;
  }
  .ant-row-flex {
    flex-direction: column;
  }
  .ant-row-flex .ant-col {
    width: 100%;
    margin-bottom: 0;
  }
  .ant-row-flex .ant-col div {
    text-align: left;
  }
  .ant-form-item-label {
    & > label::after {
      content: "";
    }
    align-self: start;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  .ant-select-arrow {
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
  .ant-form-item-control-wrapper {
    width: 100%;
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
    border-radius: 0px;
    border-bottom: 1px solid ${greyGraphstroke};
    box-shadow: none;
  }
  .remote-autocomplete-dropdown {
    border: none;
    box-shadow: none;
  }
  .has-error .ant-input,
  .has-error .ant-sel {
    border-bottom-color: red;
  }
  .ant-form-explain {
    margin-top: 2px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    .ant-row.ant-form-item {
      margin-bottom: 15px;
      &:nth-last-child(1) {
        margin: 0px;
      }
    }
  }
`;
