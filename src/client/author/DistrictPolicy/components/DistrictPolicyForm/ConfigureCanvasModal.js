import React, { useState, useEffect } from 'react'
import { Modal, Input } from 'antd'
import styled from 'styled-components'
import { EduButton, notification } from '@edulastic/common'
import { backgroundGrey2, red } from '@edulastic/colors'

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
}) => {
  const [canvasConfigureData, setCanvasConfigureData] = useState({
    canvasInstanceUrl,
    canvasConsumerKey,
    canvasSharedSecret,
  })

  const [fieldsEnabled, setEnableFields] = useState(true)

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
    handleCancel()
  }

  const footer = (
    <ButtonWrapper>
      {!fieldsEnabled && (
        <EduButton onClick={() => setEnableFields(true)}>
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
          Consumer Key <span>*</span>
          <Input
            placeholder="Enter Consumer Key"
            onChange={(e) => handleChange(e, 'canvasConsumerKey')}
            value={canvasConfigureData.canvasConsumerKey}
            disabled={!fieldsEnabled}
          />
        </label>
        <label>
          Shared Secret <span>*</span>
          <Input
            placeholder="Enter Shared Secret"
            onChange={(e) => handleChange(e, 'canvasSharedSecret')}
            value={canvasConfigureData.canvasSharedSecret}
            disabled={!fieldsEnabled}
          />
        </label>
      </ModalBodyWrapper>
    </Modal>
  )
}

export default ConfigureCanvasModal

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
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
