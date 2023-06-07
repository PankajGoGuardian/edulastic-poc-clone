import React, { useEffect } from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'
import { segmentApi } from '@edulastic/api'

const RequestModal = ({
  showSubscriptionsForms = false,
  setShowSubscriptionsForms = () => {},
  formType = 'request',
  category = 'enterprise',
}) => {
  useEffect(() => {
    if (window.hbspt) {
      window.jQuery =
        window.jQuery ||
        ((elm) => {
          elm.change = () => {}
          elm.trigger = () => {}
          return elm
        })
      if (
        !document?.getElementById('requestQuoteForm') ||
        document?.getElementById('requestQuoteForm')?.innerHTML === ''
      ) {
        window.hbspt.forms.create({
          region: 'na1',
          portalId: '5258344',
          formId: '830c8b35-4d35-48da-a4ef-62c6ed1f6a71',
          target: '#requestQuoteForm',
          onFormSubmit() {
            segmentApi.genericEventTrack('requestQuoteFormSubmit', {})
          },
        })
      }

      if (
        !document?.getElementById('requestDemoForm') ||
        document?.getElementById('requestDemoForm')?.innerHTML === ''
      ) {
        window.hbspt.forms.create({
          region: 'na1',
          portalId: '5258344',
          formId:
            category === 'data-studio'
              ? '84ef26e3-9307-410c-995e-c9fb4e182282'
              : '2b0a8ad3-4608-4cb1-b0d6-4aaa75eb6d5b',
          target: '#requestDemoForm',
          onFormSubmit() {
            segmentApi.genericEventTrack('demoFormSubmit', {})
          },
        })
      }
    }
  })

  return (
    <Modal
      width="60%"
      centered
      title={null}
      footer={null}
      visible={showSubscriptionsForms}
      onCancel={() => {
        setShowSubscriptionsForms(false)
      }}
    >
      <HubspotFormContainer>
        <RequestQuoteForm formType={formType} id="requestQuoteForm" />
        <RequestDemoForm formType={formType} id="requestDemoForm" />
      </HubspotFormContainer>
    </Modal>
  )
}

const HubspotFormContainer = styled.div`
  heigth: 100%;
  max-height: 650px;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 20px;
`
const RequestQuoteForm = styled.div`
  display: ${({ formType }) => (formType === 'request' ? 'block' : 'none')};
`

const RequestDemoForm = styled.div`
  display: ${({ formType }) => (formType === 'demo' ? 'block' : 'none')};
`

export default RequestModal
