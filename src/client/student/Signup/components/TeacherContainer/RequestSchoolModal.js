import {
  extraDesktopWidthMax,
  linkColor,
  mediumDesktopExactWidth,
  mobileWidthLarge,
} from '@edulastic/colors'
import { CustomModalStyled, EduButton } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Form } from 'antd'
import { find, get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'
import {
  createAndJoinSchoolRequestAction,
  searchDistrictsRequestAction,
  updateUserWithSchoolLoadingSelector,
} from '../../duck'
import RequestSchoolForm from './RequestSchoolForm'
import {
  TitleHeader,
  TitleParagraph,
} from '../../../../author/Welcome/styled/styled'
import { ContainerForButtonAtEnd } from '../../styled'

class RequestSchool extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    districts: PropTypes.array.isRequired,
    userInfo: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      districts,
      createAndJoinSchoolRequest,
      userInfo,
      setSchool,
    } = this.props
    const _userOrg = userInfo.userOrg || userInfo.orgData?.districts?.[0] || {}
    form.validateFields((err, values) => {
      if (!err) {
        const {
          name,
          districtId,
          address,
          city,
          country,
          us_state,
          other_state,
          zip,
        } = values
        const district = find(
          districts,
          ({ districtId: _id }) => _id === districtId.key
        ) || {
          districtName: districtId.title,
        }
        const districtName = district?.districtName || _userOrg?.districtName
        const body = {
          name,
          districtName,
          location: {
            city,
            state: country === 'US' ? us_state : other_state,
            zip,
            address,
            country,
          },
          requestNewSchool: true,
        }

        if (district.districtId || _userOrg.districtId) {
          body.districtId = district.districtId || _userOrg.districtId
        }
        const { firstName, middleName, lastName, email, _id } = userInfo
        createAndJoinSchoolRequest({
          createSchool: body,
          joinSchool: {
            data: {
              currentSignUpState: 'ACCESS_WITHOUT_SCHOOL',
              email,
              firstName,
              middleName,
              lastName,
            },
            userId: _id,
          },
          setSchoolInJoinSchoolModal: true,
          onSuccessHandler: setSchool,
        })
      }
    })
  }

  render() {
    const {
      isOpen,
      handleCancel,
      form,
      t,
      userInfo,
      createSchoolRequestPending,
      updateUserWithSchoolLoading,
    } = this.props
    const loading = createSchoolRequestPending || updateUserWithSchoolLoading
    const title = (
      <Title>
        <TitleHeader>
          {t('component.signup.teacher.requestnewschool')}
        </TitleHeader>
        <TitleParagraph>
          {t('component.signup.teacher.infotext')}
        </TitleParagraph>
      </Title>
    )

    const footer = (
      <ContainerForButtonAtEnd containerWidth="100%" mB="10px">
        <EduButton
          height="42px"
          width="175px"
          data-cy="reqNewSchoolBtn"
          onClick={this.handleSubmit}
          htmlType="submit"
          disabled={loading}
        >
          <span>Request new school</span>
        </EduButton>
      </ContainerForButtonAtEnd>
    )

    return (
      <CustomModalStyled
        width="850px"
        title={title}
        visible={isOpen}
        footer={footer}
        onCancel={handleCancel}
        centered
        padding="30px 60px"
        modalWidth="565px"
        borderRadius="10px"
        closeTopAlign="14px"
        closeRightAlign="10px"
        closeIconColor="black"
      >
        <RequestSchoolForm
          form={form}
          t={t}
          handleSubmit={this.handleSubmit}
          userInfo={userInfo}
        />
      </CustomModalStyled>
    )
  }
}

const RequestSchoolModal = Form.create({ name: 'request_school' })(
  RequestSchool
)

const enhance = compose(
  withNamespaces('login'),
  withRouter,
  connect(
    (state) => ({
      isSearching: get(state, 'signup.isSearching', false),
      districts: get(state, 'signup.districts', []),
      autocompleteDistricts: get(state, 'signup.autocompleteDistricts', []),
      updateUserWithSchoolLoading: updateUserWithSchoolLoadingSelector(state),
      createSchoolRequestPending: get(
        state,
        'signup.createSchoolRequestPending',
        false
      ),
    }),
    {
      searchDistrict: searchDistrictsRequestAction,
      createAndJoinSchoolRequest: createAndJoinSchoolRequestAction,
    }
  )
)
export default enhance(RequestSchoolModal)

const Title = styled.div`
  color: ${linkColor};
  h4 {
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 18px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 22px;
    }
  }
  span {
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
`
