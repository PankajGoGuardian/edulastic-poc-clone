/* eslint-disable react/prop-types */
import React from 'react'
import { FieldLabel, EduIf } from '@edulastic/common'
import { test as testConst } from '@edulastic/constants'
import { Col } from 'antd'
import { Label } from '../AdvancedOptons/styled-components'
import TimeSelector from './TimeSelector'
import DaySelector from './DaySelector'
import AttemptWindowTypeInputSelector from './AttemptWindowTypeInputSelector'
import useAttempWindowChangeHandler from './useAttempWindowChangeHandler'

const { ATTEMPT_WINDOW_TYPE } = testConst

const AttemptWindowTypeSelector = ({ changeField, isAdvancedView }) => {
  const {
    handleStartTimeChange,
    handleEndTimeChange,
    handleDayChange,
    handleChange,
    selectedAttemptWindowType,
    selectedDays,
  } = useAttempWindowChangeHandler(changeField)
  return (
    <>
      <EduIf condition={!isAdvancedView}>
        <Col span={10}>
          <FieldLabel>STUDENT ATTEMPT WINDOW</FieldLabel>
        </Col>
        <Col span={14}>
          <AttemptWindowTypeInputSelector
            selectedAttemptWindowType={selectedAttemptWindowType}
            handleChange={handleChange}
          />
          <EduIf
            condition={
              selectedAttemptWindowType !== ATTEMPT_WINDOW_TYPE.DEFAULT
            }
          >
            <EduIf
              condition={
                selectedAttemptWindowType === ATTEMPT_WINDOW_TYPE.CUSTOM
              }
            >
              <DaySelector
                isAdvancedView={isAdvancedView}
                selectedDays={selectedDays}
                handleDayChange={handleDayChange}
              />
            </EduIf>
            <TimeSelector
              handleStartTimeChange={handleStartTimeChange}
              handlerEndTimeChange={handleEndTimeChange}
            />
          </EduIf>
        </Col>
      </EduIf>
      <EduIf condition={isAdvancedView}>
        <Col xs={24} md={12} lg={6}>
          <Label>Student Attempt Window</Label>
          <AttemptWindowTypeInputSelector
            selectedAttemptWindowType={selectedAttemptWindowType}
            handleChange={handleChange}
          />
        </Col>
        <EduIf
          condition={selectedAttemptWindowType !== ATTEMPT_WINDOW_TYPE.DEFAULT}
        >
          <EduIf
            condition={selectedAttemptWindowType === ATTEMPT_WINDOW_TYPE.CUSTOM}
          >
            <Col xs={24} md={12} lg={6}>
              <Label />
              <DaySelector
                isAdvancedView={isAdvancedView}
                selectedDays={selectedDays}
                handleDayChange={handleDayChange}
              />
            </Col>
          </EduIf>
          <Col xs={24} md={12} lg={6}>
            <Label />
            <TimeSelector
              handleStartTimeChange={handleStartTimeChange}
              handlerEndTimeChange={handleEndTimeChange}
            />
          </Col>
        </EduIf>
      </EduIf>
    </>
  )
}

export default AttemptWindowTypeSelector
