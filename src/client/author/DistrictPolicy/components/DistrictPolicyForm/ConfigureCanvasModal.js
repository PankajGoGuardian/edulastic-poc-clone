import React, { useState, useEffect } from 'react'
import { Modal, Input } from 'antd'
import styled from 'styled-components'
import {
  captureSentryException,
  EduButton,
  notification,
} from '@edulastic/common'
import { backgroundGrey2, green, red } from '@edulastic/colors'
import { canvasApi } from '@edulastic/api'
import authorizeCanvas from '../../../../common/utils/CanavsAuthorizationModule'
import { SpinContainer } from '../Container/styled'
import { StyledSpin } from '../../../../admin/Common/StyledComponents'

const ConfigureCanvasModal = ({
  visible,
  handleCancel,
  districtPolicyId,
  orgType,
  orgId,
  saveCanvasKeysRequest,
  canvasInstanceUrl = '',
  canvasConsumerKey = '',
  canvasSharedSecret = '',
  user,
}) => {
  const [canvasConfigureData, setCanvasConfigureData] = useState({
    canvasInstanceUrl,
    canvasConsumerKey,
    canvasSharedSecret,
  })

  const [fieldsEnabled, setEnableFields] = useState(true)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (canvasInstanceUrl && canvasConsumerKey && canvasSharedSecret)
      setEnableFields(false)
  }, [])

  const handleChange = ({ target: { value } }, key) => {
    setCanvasConfigureData({
      ...canvasConfigureData,
      [key]: value,
    })
  }

  const handleSave = () => {
    if (
      !canvasConfigureData.canvasConsumerKey ||
      !canvasConfigureData.canvasInstanceUrl ||
      !canvasConfigureData.canvasSharedSecret
    )
      return notification({
        type: 'warn',
        msg: 'Please fill all the required fields',
      })
    const data = {
      ...canvasConfigureData,
      orgId,
      orgType,
      id: districtPolicyId,
    }
    saveCanvasKeysRequest(data)
    setEnableFields(false)
  }

  const authenticateCanvasUser = async () => {
    setIsLoading(true)
    if (
      !canvasConfigureData.canvasConsumerKey ||
      !canvasConfigureData.canvasInstanceUrl ||
      !canvasConfigureData.canvasSharedSecret
    ) {
      setIsLoading(false)
      return notification({
        type: 'warn',
        msg: 'Please fill all the required fields',
      })
    }
    try {
      const result = await canvasApi.getCanvasAuthURI('', 'test')
      if (result?.errorMessage) {
        notification({
          type: 'warn',
          msg:
            result?.errorMessage ||
            'Failed to connect with canvas. Please enter the valid configuration',
        })
      } else {
        const subscriptionTopic = `canvas:${user?.districtIds?.[0]}_${
          user._id
        }_${user.username || user.email || ''}`
        authorizeCanvas(result.canvasAuthURL, subscriptionTopic)
          .then(() => {})
          .catch(() => {})
      }
      setIsLoading(false)
    } catch (err) {
      captureSentryException(err)
      notification({
        type: 'warn',
        msg:
          'Failed to connect with canvas. Please enter the valid configuration',
      })
    }
  }

  const footer = (
    <ButtonWrapper>
      {!fieldsEnabled && (
        <EduButton isGhost onClick={() => setEnableFields(true)}>
          Change Details
        </EduButton>
      )}

      <EduButton isGhost onClick={handleCancel}>
        Cancel
      </EduButton>
      <EduButton onClick={handleSave}>Save</EduButton>
    </ButtonWrapper>
  )
  return (
    <Modal
      visible={visible}
      title={<h2>Canvas Integration</h2>}
      footer={footer}
      onCancel={handleCancel}
      width="600px"
      centered
    >
      <ModalBodyWrapper>
        {isLoading && (
          <SpinContainer blur>
            <StyledSpin size="small" />
          </SpinContainer>
        )}
        <label>
          Instance URL <span>*</span>
          <Input
            placeholder="Enter Instance URL"
            onChange={(e) => handleChange(e, 'canvasInstanceUrl')}
            value={canvasConfigureData.canvasInstanceUrl}
            disabled={!fieldsEnabled}
          />
        </label>
        <label>
          Client Id <span>*</span>
          <Input
            placeholder="Enter Client Id"
            onChange={(e) => handleChange(e, 'canvasConsumerKey')}
            value={canvasConfigureData.canvasConsumerKey}
            disabled={!fieldsEnabled}
          />
        </label>
        <label>
          Secret Key <span>*</span>
          <Input
            placeholder="Enter Secret Key"
            onChange={(e) => handleChange(e, 'canvasSharedSecret')}
            value={canvasConfigureData.canvasSharedSecret}
            disabled={!fieldsEnabled}
          />
        </label>
        {!fieldsEnabled && (
          <AnchorLink onClick={authenticateCanvasUser}>
            Test Connection
          </AnchorLink>
        )}
      </ModalBodyWrapper>
    </Modal>
  )
}

export default ConfigureCanvasModal

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const AnchorLink = styled.a`
  color: ${green};
  margin-bottom: 5px;
  float: right;
`

const ModalBodyWrapper = styled.div`
  label {
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    > span {
      color: ${red};
    }
    input {
      margin-bottom: 20px;
      background: ${backgroundGrey2};
    }
  }
`
