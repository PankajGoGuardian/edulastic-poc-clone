import { segmentApi } from '@edulastic/api'
import { EduButton, EduIf, FlexContainer } from '@edulastic/common'
import React, { useEffect, useState } from 'react'
import CalendlyScheduleModal from './CalendlyScheduleModal'
import RequestModal from './RequestModals'
import {
  AddonCard,
  AddonDescription,
  AddonImg,
  AddonSection,
  CardContainer,
  EnterpriseSection,
  IconWrapper,
  SectionContainer,
  SectionDescription,
  SectionTitle,
  StyledLinkItem,
  StyledLinkWrapper,
  StyledNewTag,
  StyledTag,
  TopSection,
} from './styled'

const SubscriptionContainer = ({
  showRequestOption,
  data,
  type = 'enterprise',
  additionalContent = null,
}) => {
  const [showSelectStates, setShowSelectStates] = useState(false)
  const [showSubscriptionsForms, setShowSubscriptionsForms] = useState(false)
  const [subscriptionFormType, setSubscriptionFormType] = useState('request')

  const showSubscriptionFormsModal = (formType = 'request') => {
    setSubscriptionFormType(formType)
    setShowSubscriptionsForms(true)
    const name = type === 'enterprise' ? 'Enterprise' : 'DS'
    segmentApi.genericEventTrack(`${name}: ${formType}FormButtonClick`, {})
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    document.body.appendChild(script)
  }, [])

  return (
    <SectionContainer>
      <RequestModal
        showSubscriptionsForms={showSubscriptionsForms}
        setShowSubscriptionsForms={setShowSubscriptionsForms}
        formType={subscriptionFormType}
        category={type}
      />
      <TopSection>
        <h1>
          {data.title}{' '}
          <EduIf condition={data.isNew}>
            <StyledNewTag>NEW</StyledNewTag>
          </EduIf>
        </h1>
        <p>{data.description}</p>
      </TopSection>
      {additionalContent}
      <EnterpriseSection data-cy="enterpriseCard">
        <FlexContainer justifyContent="flex-start" alignItems="flex-start">
          <IconWrapper>{data.header.icon}</IconWrapper>
          <div>
            <SectionTitle>{data.header.title}</SectionTitle>
            <SectionDescription>
              {data.header.description}
              <EduIf condition={(data.links || []).length > 0}>
                <StyledLinkWrapper>
                  {data.links?.map(({ label, url }, index) => (
                    <StyledLinkItem
                      href={url}
                      target="_blank"
                      key={index}
                      rel="noreferrer"
                    >
                      {label}
                    </StyledLinkItem>
                  ))}
                </StyledLinkWrapper>
              </EduIf>
            </SectionDescription>
          </div>
        </FlexContainer>
        {showRequestOption && (
          <FlexContainer flexDirection="column" justifyContent="center">
            <EduButton
              data-cy="requestQuote"
              style={{ margin: '10px 0px' }}
              onClick={() => showSubscriptionFormsModal('request')}
              height="32px"
              width="180px"
              isBlue
            >
              request a quote
            </EduButton>
            <EduButton
              onClick={() => showSubscriptionFormsModal('demo')}
              height="32px"
              width="180px"
              isGhost
              isBlue
              data-cy="scheduleDemo"
              style={{ margin: '0px' }}
            >
              schedule a demo
            </EduButton>
          </FlexContainer>
        )}
      </EnterpriseSection>
      <AddonSection>
        <SectionTitle>{data.addOn.title}</SectionTitle>
        <SectionDescription>{data.addOn.description}</SectionDescription>
        <CardContainer>
          {data.addOn.data.map(
            ({ icon, title, description, comingSoon }, index) => (
              <AddonCard key={index}>
                <AddonImg $type={type}>{icon}</AddonImg>
                <h3>
                  {title}
                  <EduIf condition={comingSoon}>
                    <StyledTag>COMING SOON</StyledTag>
                  </EduIf>
                </h3>
                <AddonDescription>{description}</AddonDescription>
              </AddonCard>
            )
          )}
        </CardContainer>
      </AddonSection>
      <CalendlyScheduleModal
        visible={showSelectStates}
        setShowSelectStates={setShowSelectStates}
      />
    </SectionContainer>
  )
}

export default SubscriptionContainer
