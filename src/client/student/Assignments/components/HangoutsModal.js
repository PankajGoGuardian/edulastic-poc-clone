import React from 'react'
import styled from 'styled-components'
import { Modal, Row, Col, Spin, Select, Checkbox } from 'antd'
import { IconClose } from '@edulastic/icons'
import { EduButton, EduIf } from '@edulastic/common'
import {
  greyThemeDark1,
  greyThemeLight,
  greyThemeLighter,
  lightGrey9,
  darkGrey2,
  themeColor,
} from '@edulastic/colors'
import { AUTH_FLOW, GoogleLoginWrapper } from '../../../../vendors/google'
import { scopes } from '../../../author/ManageClass/components/ClassListContainer/ClassCreatePage'

const HangoutsModal = ({
  title,
  description,
  visible,
  selected,
  onSelect,
  checked,
  onCheckUncheck,
  hangoutLink,
  onOk,
  onError,
  onCancel,
  loading,
  classList = [],
  isStudent,
}) => {
  const loginGoogle = (googleClient) => googleClient.requestAccessToken()

  const loadGapiClient = () => window.gapi.load('client')

  return (
    <StyledModal visible={visible} footer={null} onCancel={onCancel} centered>
      <EduIf condition={loading}>
        <Spin size="small" />
      </EduIf>
      <EduIf condition={!loading}>
        <Row type="flex" align="middle" gutter={[20, 20]}>
          <StyledCol span={24} justify="space-between">
            <StyledDiv fontStyle="22px/30px Open Sans" fontWeight={700}>
              {title}
            </StyledDiv>
            <IconClose height={20} width={20} onClick={onCancel} />
          </StyledCol>
          <StyledCol span={24} marginBottom="5px" justify="left">
            <StyledDiv color={darkGrey2}>{description}</StyledDiv>
          </StyledCol>
          <StyledCol
            span={24}
            marginBottom={!isStudent && selected?.googleId ? '5px' : '20px'}
          >
            <StyledSelect
              placeholder="Select Class"
              dropdownStyle={{ zIndex: 2000 }}
              defaultValue={selected?._id}
              onChange={onSelect}
              data-cy="select-class"
            >
              {classList.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </StyledSelect>
          </StyledCol>
          <EduIf
            condition={[!isStudent, selected?.googleId].every((val) => !!val)}
          >
            <StyledCol span={24} marginBottom="15px" justify="left">
              <Checkbox checked={checked} onChange={onCheckUncheck}>
                <StyledDiv fontStyle="11px/15px Open Sans">
                  SHARE VIDEO CALL LINK ON GOOGLE CLASSROOM
                </StyledDiv>
              </Checkbox>
            </StyledCol>
          </EduIf>
          <StyledCol span={24}>
            <EduButton
              height="40px"
              width="200px"
              isGhost
              onClick={onCancel}
              style={{ 'margin-left': '0px' }}
            >
              Cancel
            </EduButton>
            <EduIf condition={[isStudent, hangoutLink].some((val) => !!val)}>
              <EduButton
                height="40px"
                width="200px"
                href={hangoutLink}
                target="_blank"
                disabled={!selected}
                style={{ 'margin-left': '20px' }}
              >
                Join
              </EduButton>
            </EduIf>
            <EduIf condition={[!isStudent, !hangoutLink].every((val) => !!val)}>
              <GoogleLoginWrapper
                loadGapi
                WrappedComponent={({ googleClient }) => (
                  <EduButton
                    height="40px"
                    width="200px"
                    disabled={!selected}
                    onClick={() => loginGoogle(googleClient)}
                    style={{ 'margin-left': '20px' }}
                  >
                    Launch
                  </EduButton>
                )}
                scopes={scopes}
                successCallback={onOk}
                errorCallback={(response) => onError(response)}
                prompt="consent"
                flowType={AUTH_FLOW.IMPLICIT}
                onScriptLoad={loadGapiClient}
              />
            </EduIf>
          </StyledCol>
        </Row>
      </EduIf>
    </StyledModal>
  )
}

export default HangoutsModal

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 630px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      display: none;
    }
    .ant-modal-body {
      padding: 24px 46px 32px;
    }
  }
`

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify || 'center'};
  margin-bottom: ${(props) => props.marginBottom};
  svg {
    cursor: pointer;
  }
`

const StyledSelect = styled(Select)`
  width: 100%;
  .ant-select-selection {
    background: ${greyThemeLighter};
    min-height: 40px;
    padding: 5px;
    border-radius: 2px;
    border: 1px solid ${greyThemeLight};
    .ant-select-selection__rendered {
      .ant-select-selection__placeholder {
        font-size: 13px;
        letter-spacing: 0.24px;
        color: ${lightGrey9};
      }
    }
    .ant-select-arrow {
      top: 20px;
    }
    .ant-select-arrow-icon {
      svg {
        fill: ${themeColor};
      }
    }
  }
`

const StyledDiv = styled.div`
  display: inline;
  text-align: left;
  font: ${(props) => props.fontStyle || '14px/19px Open Sans'};
  font-weight: ${(props) => props.fontWeight || 600};
  color: ${(props) => props.color || greyThemeDark1};
`
