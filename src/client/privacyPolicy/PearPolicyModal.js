import React from 'react'
import styled from 'styled-components'
import { Modal, Spin } from 'antd'
import { Checkbox, EduButton, EduIf } from '@edulastic/common'
import { themeColor, themeColorBlue } from '@edulastic/colors'
import appConfig from '../../app-config'
import { pearAssessmentText } from '../common/utils/helpers'

const EULA_TERMS_URL = 'https://www.peardeck.com/policies/product-terms-eula'
const PRIVACY_POLICY_URL = 'https://www.peardeck.com/policies/product-privacy'
const DATA_PROCESSING_ADDENDUM_URL =
  'https://www.peardeck.com/policies/data-processing-addendum'
const COPPA_URL = 'https://www.peardeck.com/policies/coppa-disclosure'

const PearPolicyModal = ({
  isChecked,
  setIsChecked,
  onAccept,
  isLoading,
  showEEAPolicy,
}) => {
  const onCheck = () => {
    setIsChecked((prevState) => !prevState)
  }

  return (
    <StyledModal visible footer={null} closable={false}>
      <Spin spinning={isLoading}>
        <ModalContentWrapper>
          <UpperContainer>
            <img
              src={`${appConfig.cdnURI}/app-logo/PearDeckLearning_ProductLogo_PearAssessment_MultiColor.png`}
              alt={pearAssessmentText}
              width="218px"
            />
            <StyledHeader data-cy="pearPolicyModalTitle">
              Welcome to {pearAssessmentText}!
            </StyledHeader>
            <p data-cy="pearPolicyModalSubTitle">
              Before we proceed, please review the following terms
            </p>
          </UpperContainer>
          <LowerContainer>
            <div>
              <Checkbox onChange={onCheck} checked={isChecked} darkBorder />
            </div>
            <div data-cy="policyAgreeCheckboxText">
              <p>By checking this box, you are agreeing:</p>
              <StyledOrderedList>
                <li>
                  To the{' '}
                  <Link href={EULA_TERMS_URL} target="_blank">
                    Product Terms & End User License Agreement
                  </Link>
                </li>
                <li>
                  To the{' '}
                  <Link href={PRIVACY_POLICY_URL} target="_blank">
                    Privacy Policy for Product Users
                  </Link>
                </li>
                <EduIf condition={showEEAPolicy}>
                  <li>
                    To the{' '}
                    <Link href={DATA_PROCESSING_ADDENDUM_URL} target="_blank">
                      {pearAssessmentText} Data Processing Addendum
                    </Link>
                  </li>
                </EduIf>
                <li>
                  You are authorized to act for your school and you consent to{' '}
                  {pearAssessmentText}&apos;s collection of student data in our{' '}
                  <Link href={COPPA_URL} target="_blank">
                    COPPA disclosure
                  </Link>
                </li>
              </StyledOrderedList>
            </div>
          </LowerContainer>
          <ButtonsContainer>
            <Button disabled={!isChecked || isLoading} onClick={onAccept}>
              Accept & Continue
            </Button>
          </ButtonsContainer>
        </ModalContentWrapper>
      </Spin>
    </StyledModal>
  )
}

export default PearPolicyModal

const Button = styled(EduButton)`
  border: none;
  padding: 15px 50px;
  border-radius: 8px;
  text-transform: capitalize;
  font-size: 16px;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 10px;
`

const StyledModal = styled(Modal)`
  top: 50%;
  transform: translateY(-50%);
  .ant-modal-content {
    width: 600px;
    border-radius: 15px;
    .ant-modal-body {
      padding: 16px;
      padding-bottom: 40px;
    }
    .ant-modal-header {
      border: none;
      border-radius: 15px;
    }
  }
`

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledHeader = styled.h1`
  font-weight: 700;
  margin-bottom: 8px;
`

const UpperContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #eee;
  padding: 40px;
  border-radius: 5px;
  width: 100%;
`
const LowerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px 50px;
`
const StyledOrderedList = styled.ol`
  padding-left: 16px;
`

const Link = styled.a`
  color: ${themeColor};
  font-weight: 600;
  line-height: 22px;
  &:hover,
  &:active {
    color: ${themeColorBlue};
  }
`
