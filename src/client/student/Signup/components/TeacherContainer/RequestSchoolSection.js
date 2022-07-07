import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import styled from 'styled-components'
import { Form } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { EduButton, notification } from '@edulastic/common'
import { userApi } from '@edulastic/api'
import { signupStateBykey } from '@edulastic/constants/const/signUpState'
import {
  themeColor,
  mobileWidthLarge,
  greyGraphstroke,
} from '@edulastic/colors'

import {
  searchDistrictsRequestAction,
  createAndJoinSchoolRequestAction,
} from '../../duck'
import { createAndAddSchoolAction } from '../../../Login/ducks'
import RequestSchoolForm from './RequestSchoolForm'
import { getUserOrg } from '../../../../author/src/selectors/user'

const RequestSchool = (props) => {
  const [requestButtonDisabled, setRequestButtonDisabled] = useState(true)
  const {
    form,
    userInfo,
    createAndAddSchool,
    t,
    creatingAddingSchool,
    userOrg,
  } = props
  const { orgData, currentSignUpState } = userInfo
  const { districtId, districtName } = userOrg || orgData.districts?.[0] || {}

  useEffect(() => {
    ;(async function checkDistrictPolicy() {
      try {
        let signOnMethod = 'userNameAndPassword'
        signOnMethod = userInfo.msoId ? 'office365SignOn' : signOnMethod
        signOnMethod = userInfo.cleverId ? 'cleverSignOn' : signOnMethod
        signOnMethod = userInfo.googleId ? 'googleSignOn' : signOnMethod
        const checkDistrictPolicyPayload = {
          districtId,
          email: userInfo.email,
          type: userInfo.role,
          signOnMethod,
          undefined,
          currentSignUpState: signupStateBykey[currentSignUpState],
        }
        await userApi.validateDistrictPolicy(checkDistrictPolicyPayload)
        setRequestButtonDisabled(false)
      } catch (error) {
        notification({ msg: t('common.policyviolation') })
        setRequestButtonDisabled(true)
      }
    })()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const {
          name,
          address,
          city,
          country,
          us_state,
          other_state,
          zip,
        } = values
        const body = {
          name,
          districtName,
          districtId,
          location: {
            city,
            state: country === 'US' ? us_state : other_state,
            zip,
            address,
            country,
          },
          requestNewSchool: true,
        }

        const { firstName, middleName, lastName, institutionIds } = userInfo
        createAndAddSchool({
          createSchool: body,
          joinSchool: {
            data: {
              email: userInfo.email,
              firstName,
              middleName,
              lastName,
            },
            userId: userInfo._id,
          },
          institutionIds,
        })
      }
    })
  }

  return (
    <RequestFormWrapper>
      <RequestSchoolForm
        form={form}
        t={t}
        handleSubmit={handleSubmit}
        userInfo={userInfo}
        fromUserProfile
      />
      <ButtonRow>
        <EduButton
          height="32px"
          data-cy="reqNewSchoolBtn"
          onClick={handleSubmit}
          htmlType="submit"
          disabled={creatingAddingSchool || requestButtonDisabled}
        >
          <span>{t('component.signup.teacher.requestnewschool')}</span>
        </EduButton>
      </ButtonRow>
    </RequestFormWrapper>
  )
}

RequestSchool.propTypes = {
  form: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
}

const RequestSchoolSection = Form.create({ name: 'request_school' })(
  RequestSchool
)

const enhance = compose(
  withNamespaces('login'),
  withRouter,
  connect(
    (state) => ({
      creatingAddingSchool: get(state, 'user.creatingAddingSchool'),
      userOrg: getUserOrg(state),
    }),
    {
      searchDistrict: searchDistrictsRequestAction,
      createAndJoinSchoolRequest: createAndJoinSchoolRequestAction,
      createAndAddSchool: createAndAddSchoolAction,
    }
  )
)

export default enhance(RequestSchoolSection)

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

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
      content: '';
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
`
