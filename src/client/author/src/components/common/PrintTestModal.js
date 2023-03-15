import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Radio, Modal, Input, Alert, Checkbox } from 'antd'
import { EduButton, FlexContainer } from '@edulastic/common'
import {
  greyThemeDark1,
  greyishBorder,
  lightGreySecondary,
  themeColorBlue,
} from '@edulastic/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { testsApi } from '@edulastic/api'
import { getOrderedQuestionsAndAnswers } from '../../../PrintAssessment/utils'

const regexStr = /^[0-9,-]+$/
const optionInfos = {
  complete: ['All the items in the test will be printed.'],
  manualGraded: [
    'Items that are marked as manual graded will be printed.',
    'e.g. Essay with rich Text, Math Essay etc...',
  ],
  custom: ['Enter the item numbers in the below box to print'],
}

const PrintTestModal = ({
  onCancel,
  onProceed,
  currentTestId,
  assignmentId,
  showAnswerCheckbox = false,
}) => {
  const [option, setOption] = useState('complete')
  const [customValue, setCustomValue] = useState('')
  const [error, setError] = useState('')
  const [haveManualGradedQs, setHaveManualGradedQs] = useState(false)
  const [showAnswers, setShowAnswers] = useState(true)

  useEffect(() => {
    // fetching test to check if manual graded items avaiable or not
    testsApi.getById(currentTestId, { assignmentId }).then((test) => {
      const { passages, itemGroups = [] } = test
      const testItems = itemGroups.flatMap((itemGroup) => itemGroup.items || [])
      const { questions } = getOrderedQuestionsAndAnswers(
        testItems,
        passages,
        'manualGraded',
        []
      )
      setHaveManualGradedQs(!!questions.length)
    })
  }, [])

  const handleChangeOption = (e) => {
    setError('')
    setOption(e.target.value)
  }

  const handlePrintAnswers = (e) => {
    const { checked } = e.target
    setShowAnswers(checked)
  }
  const onChangeInput = (e) => {
    const { value } = e.target
    // restricting to comma, dash and number
    if (regexStr.test(value)) {
      setCustomValue(value)
    }
  }

  const handleSubmit = () => {
    const params = {
      type: option,
      customValue,
      showAnswers,
    }
    if (option === 'custom' && !customValue.trim()) {
      return setError('Please enter custom inputs')
    }
    onProceed(params)
  }

  return (
    <StyledModal
      centered
      visible
      onCancel={onCancel}
      title="Print Test"
      footer={
        <>
          <StyledFooter>
            <EduButton
              isGhost
              data-cy="CANCEL"
              height="40px"
              onClick={onCancel}
            >
              CANCEL
            </EduButton>

            <EduButton height="40px" data-cy="PRINT" onClick={handleSubmit}>
              PRINT
            </EduButton>
          </StyledFooter>
        </>
      }
      width={626}
    >
      <FlexContainer
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          fontWeight: '600',
          minHeight: '180px',
          justifyContent: 'flex-start',
        }}
      >
        <div style={{ marginBottom: '31px', fontSize: '14px' }}>
          Select the print type based on your need.
        </div>
        <StyledRadioGroup onChange={handleChangeOption} value={option}>
          <Radio value="complete">COMPLETE TEST</Radio>
          {haveManualGradedQs && (
            <Radio value="manualGraded">MANUALLY GRADED ITEMS</Radio>
          )}
          <Radio value="custom">CUSTOM</Radio>
        </StyledRadioGroup>

        <Info>
          <FontAwesomeIcon icon={faInfoCircle} aria-hidden="true" />
          <div data-cy="print-option-info" style={{ marginLeft: '5px' }}>
            {optionInfos[option].map((txt, i) => (
              <span key={i}>{txt}</span>
            ))}
          </div>
        </Info>
        {option === 'custom' && (
          <StyledInput
            data-cy="select-que-to-print"
            size="large"
            placeholder="e.g. 1-4, 8, 11-13"
            onChange={onChangeInput}
            value={customValue}
          />
        )}
        {error && <Alert message={error} type="error" showIcon closable />}

        {showAnswerCheckbox && (
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Checkbox defaultChecked="true" onChange={handlePrintAnswers}>
              Print Answer Key
            </Checkbox>
          </div>
        )}
      </FlexContainer>
    </StyledModal>
  )
}

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0 46px 0 46px;
  }
  .ant-modal-header {
    padding: 24px 46px;
    border: 0;
    .ant-modal-title {
      font-size: 22px;
      font-weight: bold;
      letter-spacing: -1.1px;
    }
  }
  .ant-modal-footer {
    border: 0;
    padding-bottom: 30px;
  }
  .ant-modal-close {
    top: 6px;
    color: black;
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .ant-alert-error {
    width: 100%;
    margin-top: 10px;
  }
`
const StyledFooter = styled.div`
  display: flex;
  justify-content: center;
  button {
    min-width: 200px;
  }
`
const StyledRadioGroup = styled(Radio.Group)`
  margin-bottom: 32px;
  span {
    font-size: 12px;
    letter-spacing: 0.2px;
    color: ${greyThemeDark1};
    padding: 0;
    font-weight: 600;
  }

  .ant-radio {
    margin-right: 18px;
  }

  .ant-radio-wrapper {
    margin-right: 46px;
  }
`

const StyledInput = styled(Input)`
  border: 1px solid ${greyishBorder};
  background: ${lightGreySecondary};
  border-radius: 0;
  &:focus,
  &:hover {
    border: 1px solid ${themeColorBlue};
  }
`

const Info = styled.div`
  font-weight: 500;
  align-items: flex=start;
  display: flex;
  margin-bottom: 5px;
  span {
    display: block;
  }
  svg {
    margin-top: 4px;
  }
`

export default PrintTestModal
