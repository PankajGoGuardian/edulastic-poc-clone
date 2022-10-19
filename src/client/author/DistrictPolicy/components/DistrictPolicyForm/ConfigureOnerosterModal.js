import React, { useState, useEffect } from 'react'
import { Tabs, Tooltip } from 'antd'
import styled from 'styled-components'
import {
  captureSentryException,
  CustomModalStyled,
  EduButton,
  notification,
  TextInputStyled,
  RadioBtn,
} from '@edulastic/common'
import { green, themeColor } from '@edulastic/colors'
import { onerosterApi } from '@edulastic/api'
import { connect } from 'react-redux'
import { StyledRadioGrp } from '../../../../admin/Common/StyledComponents/settingsContent'
import {
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'
import { getUserOrgId } from '../../../src/selectors/user'

const ConfigureOnerosterModal = ({
  visible,
  handleClose,
  districtPolicyId,
  orgType,
  orgId,
  isLoading,
  setIsLoading,
  saveOnerosterApiConfiguration,
  generateOnerosterLtiKeys,
  oneRosterBaseUrl = '',
  oneRosterClientId = '',
  oneRosterSecretKey = '',
  oneRosterTokenUrl = '',
  rosterOAuthConsumerKey = '',
  rosterOAuthConsumerSecret = '',
}) => {
  const [apiConfig, setApiConfig] = useState({
    oneRosterBaseUrl,
    oneRosterClientId,
    oneRosterSecretKey,
    oneRosterTokenUrl,
  })

  const { TabPane } = Tabs

  const [fieldsEnabled, setEnableFields] = useState(true)
  const [isOAuth2, setIsOAuth2] = useState(false)

  const isFieldEmptyInApiConfig =
    !apiConfig.oneRosterClientId ||
    !apiConfig.oneRosterBaseUrl ||
    !apiConfig.oneRosterSecretKey ||
    (isOAuth2 && !apiConfig.oneRosterTokenUrl)

  const isApiKeysPresent =
    oneRosterClientId &&
    oneRosterBaseUrl &&
    oneRosterSecretKey &&
    (!isOAuth2 || (isOAuth2 && oneRosterTokenUrl))

  const isLtiKeysPresent = rosterOAuthConsumerKey && rosterOAuthConsumerSecret

  useEffect(() => {
    if (oneRosterBaseUrl && oneRosterClientId && oneRosterSecretKey)
      setEnableFields(false)
  }, [])

  useEffect(() => {
    if (isFieldEmptyInApiConfig) {
      setEnableFields(true)
    } else {
      setEnableFields(false)
    }
  }, [isOAuth2])

  const handleApiConfigChange = ({ target: { value } }, key) => {
    setApiConfig({
      ...apiConfig,
      [key]: value,
    })
  }

  const handleSave = () => {
    if (isFieldEmptyInApiConfig) {
      return notification({
        type: 'warn',
        msg: 'Please fill all the required fields',
      })
    }
    const data = {
      oneRosterClientId: apiConfig.oneRosterClientId.trim(),
      oneRosterBaseUrl: apiConfig.oneRosterBaseUrl.trim(),
      oneRosterSecretKey: apiConfig.oneRosterSecretKey.trim(),
      orgId,
      orgType,
      isOAuth2,
      id: districtPolicyId,
    }
    if (isOAuth2) {
      Object.assign(data, {
        oneRosterTokenUrl: apiConfig.oneRosterTokenUrl.trim(),
      })
    }
    saveOnerosterApiConfiguration(data)
    setEnableFields(false)
  }

  const generateLtiKeys = () => {
    generateOnerosterLtiKeys()
    setEnableFields(false)
  }

  const resetApiConfig = () => {
    setApiConfig({
      oneRosterBaseUrl,
      oneRosterClientId,
      oneRosterSecretKey,
      oneRosterTokenUrl,
    })
  }

  const handleCallback = (key) => {
    if (key === '1' && isFieldEmptyInApiConfig) {
      setEnableFields(true)
    } else {
      setEnableFields(false)
    }
    resetApiConfig()
  }

  const handleCancel = () => {
    resetApiConfig()
    setEnableFields(false)
  }

  const testConnection = async () => {
    setIsLoading(true)
    if (isFieldEmptyInApiConfig) {
      setIsLoading(false)
      return notification({
        type: 'warn',
        msg: 'Please fill all the required fields',
      })
    }
    const data = {
      oneRosterClientId: apiConfig.oneRosterClientId.trim(),
      oneRosterBaseUrl: apiConfig.oneRosterBaseUrl.trim(),
      oneRosterSecretKey: apiConfig.oneRosterSecretKey.trim(),
      isOAuth2,
    }
    if (isOAuth2) {
      Object.assign(data, {
        oneRosterTokenUrl: apiConfig.oneRosterTokenUrl.trim(),
      })
    }
    try {
      const result = await onerosterApi.testApiConfig(data)
      notification({
        type: 'success',
        msg:
          result ||
          'Connection established successfully with current configuration',
      })
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      captureSentryException(err)
      notification({
        type: 'warn',
        msg:
          'Failed to connect with OneRoster. Please enter the valid configuration',
      })
    }
  }

  return (
    <CustomModalStyled
      visible={visible}
      title="OneRoster Integration"
      footer={null}
      onCancel={handleClose}
      modalWidth="520px"
      bodyPadding="25px 0px 10px"
      centered
    >
      {isLoading ? (
        <SpinContainer loading>
          <StyledSpin size="large" />
        </SpinContainer>
      ) : null}
      <ModalBodyWrapper>
        <Tabs defaultActiveKey="1" onChange={handleCallback}>
          <TabPane tab="Api Configuration" key="1">
            <StyledRadioGrp
              onChange={() => setIsOAuth2(!isOAuth2)}
              value={isOAuth2 ? 2 : 1}
            >
              <RadioBtn mb="10px" value={1} data-cy="oAuth1" data-testid="oAuth1">
                oAuth 1.0
              </RadioBtn>
              <Tooltip title="Feature not supported." placement="right">
                <RadioBtn
                  mb="10px"
                  value={2}
                  data-cy="oAuth2"
                  disabled
                  defaultChecked={false}
                  data-testid="oAuth2">
                >
                  oAuth 2.0
                </RadioBtn>
              </Tooltip>
            </StyledRadioGrp>
            {isOAuth2 ? (
              <InputRow>
                <label>Token URL</label>
                <TextInputStyled
                  placeholder="Enter Token URL"
                  onChange={(e) =>
                    handleApiConfigChange(e, 'oneRosterTokenUrl')
                  }
                  value={apiConfig.oneRosterTokenUrl}
                  disabled={!fieldsEnabled}
                  height="40px"
                />
              </InputRow>
            ) : null}
            <InputRow>
              <label>Base URL</label>
              <TextInputStyled
                placeholder="Enter Base URL"
                onChange={(e) => handleApiConfigChange(e, 'oneRosterBaseUrl')}
                value={apiConfig.oneRosterBaseUrl}
                disabled={!fieldsEnabled}
                height="40px"
                data-testid="baseUrl"
              />
            </InputRow>
            <InputRow>
              <label>Client Id</label>
              <TextInputStyled
                placeholder="Enter Client Id"
                onChange={(e) => handleApiConfigChange(e, 'oneRosterClientId')}
                value={apiConfig.oneRosterClientId}
                disabled={!fieldsEnabled}
                height="40px"
                data-testid="clientId"
              />
            </InputRow>
            <InputRow>
              <label>Secret Key</label>
              <TextInputStyled
                placeholder="Enter Secret Key"
                onChange={(e) => handleApiConfigChange(e, 'oneRosterSecretKey')}
                value={apiConfig.oneRosterSecretKey}
                disabled={!fieldsEnabled}
                height="40px"
                data-testid = "secretKey"
              />
            </InputRow>
            {!fieldsEnabled && (
              <AnchorLink onClick={testConnection}>Test Connection</AnchorLink>
            )}
            <ButtonWrapper fieldsEnabled={fieldsEnabled}>
              {!fieldsEnabled && (
                <ChangeLink isGhost onClick={() => setEnableFields(true)}>
                  Change Details
                </ChangeLink>
              )}
              <div>
                {isApiKeysPresent && fieldsEnabled ? (
                  <EduButton
                    height="40px"
                    width="100px"
                    isGhost
                    key="0"
                    onClick={handleCancel}
                  >
                    Cancel
                  </EduButton>
                ) : (
                  <EduButton
                    height="40px"
                    width="100px"
                    isGhost
                    key="1"
                    onClick={handleClose}
                  >
                    Close
                  </EduButton>
                )}
                <EduButton height="40px" width="100px" onClick={handleSave}>
                  Save
                </EduButton>
              </div>
            </ButtonWrapper>
          </TabPane>
          <TabPane tab="Lti Integration" key="2">
            {isLtiKeysPresent ? (
              <>
                <InputRow>
                  <label>Auth Url</label>
                  <TextInputStyled
                    placeholder="Auth Url"
                    value="http://edulasticv2-dryrun.snapwiz.net/api/auth/Lti"
                    disabled
                    height="40px"
                  />
                </InputRow>
                <InputRow>
                  <label>Consumer Key</label>
                  <TextInputStyled
                    placeholder="Enter Consumer Key"
                    value={rosterOAuthConsumerKey}
                    disabled
                    height="40px"
                    data-testid="consumerKey"
                  />
                </InputRow>
                <InputRow>
                  <label>Secret key</label>
                  <TextInputStyled
                    placeholder="Enter Secret Key"
                    value={rosterOAuthConsumerSecret}
                    disabled
                    height="40px"
                    data-testid="secretKey2"
                  />
                </InputRow>
              </>
            ) : (
              <ContentList>
                <p>
                  District admin can generate LTI Integration keys by clicking
                  below GENERATE KEY button.
                </p>
                <p>Note:</p>
                <ol>
                  <li>LTI keys cannot be generated again.</li>
                </ol>
              </ContentList>
            )}
            <ButtonWrapper fieldsEnabled>
              <div>
                <EduButton
                  height="40px"
                  width="200px"
                  isGhost
                  onClick={handleClose}
                >
                  CLOSE
                </EduButton>
                {!isLtiKeysPresent ? (
                  <EduButton
                    height="40px"
                    width="200px"
                    onClick={generateLtiKeys}
                  >
                    GENERATE KEY
                  </EduButton>
                ) : null}
              </div>
            </ButtonWrapper>
          </TabPane>
        </Tabs>
      </ModalBodyWrapper>
    </CustomModalStyled>
  )
}

export default connect((state) => ({
  userDistrictId: getUserOrgId(state),
}))(ConfigureOnerosterModal)

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
