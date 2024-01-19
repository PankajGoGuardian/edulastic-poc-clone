import {
  black,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  mobileWidthMax,
  themeColor,
} from '@edulastic/colors'
import { EduElse, EduIf, EduThen, OnDarkBgLogo } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Button, Col, Row, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'
import IconPearAssessmentFormerlyEdulastic from '@edulastic/icons/src/IconPearAssessmentFormerlyEdulastic'
import {
  getDistrictGetStartedUrl,
  getPartnerGetStartedUrl,
  isDistrictPolicyAllowed,
} from '../../../common/utils/helpers'
import { isPearDomain } from '../../../../utils/pear'

const Header = ({
  t,
  Partners,
  isSignupUsingDaURL,
  districtPolicy,
  orgShortName,
  generalSettings = {},
  orgType,
}) => (
  <RegistrationHeader type="flex" align="middle">
    <Col span={12} style={{ display: 'flex' }}>
      <EduIf condition={isPearDomain}>
        <EduThen>
          <IconPearAssessmentFormerlyEdulastic
            width="148px"
            height="43px"
            style={{ marginLeft: '15px' }}
          />
        </EduThen>
        <EduElse>
          <OnDarkBgLogo height="30px" />
        </EduElse>
      </EduIf>
      {Partners.name !== 'login' && (
        <PartnerLogo
          Partners={Partners}
          src={Partners.headerLogo}
          alt={Partners.name}
        />
      )}
      {isSignupUsingDaURL ? (
        <div
          className="district-name-and-announcement"
          style={{ paddingLeft: '15px' }}
        >
          <Row type="flex">
            <Col className="district-name">{generalSettings.name || '---'}</Col>
            <Col>
              <StyledCustomTooltip
                placement="bottom"
                title={generalSettings.announcement}
                trigger="click"
              >
                <Button
                  icon="bell"
                  type="link"
                  className="district-announcement-button"
                >
                  {orgType === 'district'
                    ? 'District Announcement'
                    : 'School Announcement'}
                </Button>
              </StyledCustomTooltip>
            </Col>
          </Row>
        </div>
      ) : null}
    </Col>
    <Col span={12} align="right">
      {isSignupUsingDaURL &&
      !isDistrictPolicyAllowed(
        isSignupUsingDaURL,
        districtPolicy,
        'teacherSignUp'
      ) &&
      !isDistrictPolicyAllowed(
        isSignupUsingDaURL,
        districtPolicy,
        'studentSignUp'
      ) ? (
        <div className="teacher-student-restricted-message">
          {`${t('common.policyviolation').split('.')[0]}.`}
          <br />
          {`${t('common.policyviolation').split('.')[1]}.`}
        </div>
      ) : (
        <>
          <DontHaveAccountText>
            {t('common.donthaveanaccount')}
          </DontHaveAccountText>
          <Link
            to={
              isDistrictPolicyAllowed(
                isSignupUsingDaURL,
                districtPolicy,
                'teacherSignUp'
              ) ||
              isDistrictPolicyAllowed(
                isSignupUsingDaURL,
                districtPolicy,
                'studentSignUp'
              )
                ? getDistrictGetStartedUrl(orgShortName, orgType)
                : getPartnerGetStartedUrl(Partners)
            }
          >
            {t('common.signupbtn')}
          </Link>
        </>
      )}
    </Col>
  </RegistrationHeader>
)

Header.propTypes = {
  t: PropTypes.func.isRequired,
  Partners: PropTypes.object.isRequired,
}

const enhance = compose(withNamespaces('login'))

export default enhance(Header)

const RegistrationHeader = styled(Row)`
  padding: 16px 24px;
  color: white;

  .district-name-and-announcement {
    display: inline-block;
    vertical-align: middle;

    .district-name {
      padding: 4px;
      margin-right: 10px;
    }

    .district-announcement-button {
      border: none;
      color: white;
      font-size: 14px;
      padding: 0;
      span {
        font-size: 14px;
      }
    }
  }

  .teacher-student-restricted-message {
    display: inline-block;
    text-align: left;
  }

  span {
    font-size: 14px;
    margin-right: 20px;
  }
  a {
    padding: 8px 48px;
    text-decoration: none;
    color: white;
    text-transform: uppercase;
    border-radius: 4px;
    background: ${themeColor};
    font-size: 11px;

    @media (max-width: ${mobileWidthMax}) {
      padding: 8px 35px;
      font-size: 11px;
    }
  }
`

const DontHaveAccountText = styled.span`
  font-size: 12px;
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 13px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 14px;
  }
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`

const PartnerLogo = styled.img`
  filter: ${(props) => props.Partners.colorFilter};
  margin-left: 10px;
  max-height: 30px;
`

const CustomTooltip = (props) => {
  const { className, children, ...attrs } = props

  return (
    <Tooltip {...attrs} overlayClassName={`${className}`}>
      {children}
    </Tooltip>
  )
}

const StyledCustomTooltip = styled(CustomTooltip)`
  max-width: 300px;

  .ant-tooltip-content {
    .ant-tooltip-arrow {
      border-bottom-color: white;
    }
    .ant-tooltip-inner {
      background-color: white;
      color: ${black};
      .custom-table-tooltip-value {
        font-weight: 900;
        margin-left: 5px;
      }
    }
  }
`
