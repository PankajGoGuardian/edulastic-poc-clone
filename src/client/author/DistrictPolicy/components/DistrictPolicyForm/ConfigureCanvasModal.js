import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import styled from 'styled-components'
import {
  captureSentryException,
  CustomModalStyled,
  EduButton,
  notification,
  TextInputStyled,
} from '@edulastic/common'
import { green, themeColor } from '@edulastic/colors'
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

  const { TabPane } = Tabs

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

  const handleCallback = () => {}

  return (
    <CustomModalStyled
      visible={visible}
      title="Canvas Integration"
      footer={null}
      onCancel={handleCancel}
      modalWidth="520px"
      bodyPadding="25px 0px 10px"
      centered
    >
      <ModalBodyWrapper>
        {isLoading && (
          <SpinContainer blur>
            <StyledSpin size="small" />
          </SpinContainer>
        )}

        <Tabs defaultActiveKey="1" onChange={handleCallback}>
          <TabPane tab="Developer keys" key="1">
            <InputRow>
              <label>Instance URL</label>
              <TextInputStyled
                placeholder="Enter Instance URL"
                onChange={(e) => handleChange(e, 'canvasInstanceUrl')}
                value={canvasConfigureData.canvasInstanceUrl}
                disabled={!fieldsEnabled}
                height="40px"
              />
            </InputRow>
            <InputRow>
              <label>Client Id</label>
              <TextInputStyled
                placeholder="Enter Client Id"
                onChange={(e) => handleChange(e, 'canvasConsumerKey')}
                value={canvasConfigureData.canvasConsumerKey}
                disabled={!fieldsEnabled}
                height="40px"
              />
            </InputRow>
            <InputRow>
              <label>Secret Key</label>
              <TextInputStyled
                placeholder="Enter Secret Key"
                onChange={(e) => handleChange(e, 'canvasSharedSecret')}
                value={canvasConfigureData.canvasSharedSecret}
                disabled={!fieldsEnabled}
                height="40px"
              />
            </InputRow>
            {!fieldsEnabled && (
              <AnchorLink onClick={authenticateCanvasUser}>
                Test Connection
              </AnchorLink>
            )}
            <ButtonWrapper fieldsEnabled={fieldsEnabled}>
              {!fieldsEnabled && (
                <ChangeLink isGhost onClick={() => setEnableFields(true)}>
                  Change Details
                </ChangeLink>
              )}
              <div>
                <EduButton
                  height="40px"
                  width="100px"
                  isGhost
                  onClick={handleCancel}
                >
                  Cancel
                </EduButton>
                <EduButton height="40px" width="100px" onClick={handleSave}>
                  Save
                </EduButton>
              </div>
            </ButtonWrapper>
          </TabPane>
          <TabPane tab="Edulastic app configuration" key="2">
            <ContentList>
              <p>Canvas admin can instal Edulastic app below steps:</p>
              <ol>
                <li>Search and Install Edualstic-SSO app form app center</li>
                <li>Enter Consumer and Secret Key in the app</li>
              </ol>
            </ContentList>
            <InputRow>
              <label>Consumer Key</label>
              <TextInputStyled placeholder="Enter Consumer Key" height="40px" />
            </InputRow>
            <InputRow>
              <label>Secret key</label>
              <TextInputStyled placeholder="Enter Secret Key" height="40px" />
            </InputRow>
            <ButtonWrapper fieldsEnabled>
              <div>
                <EduButton
                  height="40px"
                  width="200px"
                  isGhost
                  onClick={handleCancel}
                >
                  NO, CANCEL
                </EduButton>
                <EduButton height="40px" width="200px">
                  YES, ADD APP BUTTON
                </EduButton>
              </div>
            </ButtonWrapper>
          </TabPane>
        </Tabs>
      </ModalBodyWrapper>
    </CustomModalStyled>
  )
}

export default ConfigureCanvasModal

const ButtonWrapper = styled.div`
  width: 100%;
  padding-top: 25px;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.fieldsEnabled ? 'center' : 'space-between'};
  div {
    display: flex;
  }
`
const ChangeLink = styled.div`
  font-size: 11px;
  color: ${themeColor};
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`
const ContentList = styled.div`
  font-weight: regular;
  font-size: 15px;
  color: #304050;
  ol {
    padding-left: 23px;
  }
`

const AnchorLink = styled.a`
  color: ${green};
  margin-bottom: 5px;
  float: right;
`

const ModalBodyWrapper = styled.div`
  .ant-tabs-bar {
    border-bottom: 1px solid #2f4151;
    .ant-tabs-ink-bar {
      display: none !important;
    }
    .ant-tabs-nav-wrap {
      margin-bottom: 0px;
    }
    .ant-tabs-nav {
      width: 100%;
      .ant-tabs-tab {
        font-size: 10px;
        color: #87929b;
        font-weight: bold;
        text-transform: uppercase;
        margin: 0 0px 0 15px;
        border: 1px solid #e5e5e5;
        border-bottom: none;
        background: #e5e5e5;
        border-radius: 4px 4px 0px 0px;
        width: 45%;
        text-align: center;
        &.ant-tabs-tab-active {
          color: #2f4151;
          background: #ffffff;
          border: 1px solid #2f4151;
          border-bottom: 1px solid #ffffff;
        }
      }
    }
  }
`
const InputRow = styled.div`
  margin-bottom: 15px;
  label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`
