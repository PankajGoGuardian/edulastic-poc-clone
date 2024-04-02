import { assignmentApi } from '@edulastic/api'
import {
  CustomModalStyled,
  EduButton,
  notification,
  RadioBtn,
  RadioGrp,
  FieldLabel,
  SelectInputStyled,
  DatePickerStyled,
  TextInputStyled,
  CheckboxLabel,
} from '@edulastic/common'
import { test as testContants } from '@edulastic/constants'
import { Col, Row, Select, Tooltip } from 'antd'
import { some, get } from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { IconInfo } from '@edulastic/icons'
import { getRedirectEndDate, getUserName } from '../utils'
import { BodyContainer } from './styled'
import { getIsSpecificStudents } from '../ducks'
import { gradebookUnSelectAllAction } from '../../src/reducers/gradeBook'

const { redirectPolicy } = testContants

const QuestionDelivery = {
  [redirectPolicy.QuestionDelivery.ALL]: 'All',
  [redirectPolicy.QuestionDelivery.SKIPPED]: 'Skipped',
  [redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG]: 'Skipped and Wrong',
  [redirectPolicy.QuestionDelivery.SKIPPED_PARTIAL_AND_WRONG]:
    'Skipped, Partial and Wrong',
}

const ShowPreviousAttempt = {
  FEEDBACK_ONLY: 'Teacher feedback only',
  SCORE_AND_FEEDBACK: 'Student score & teacher feedback',
  STUDENT_RESPONSE_AND_FEEDBACK: 'Student response & teacher feedback',
  SCORE_RESPONSE_AND_FEEDBACK: 'Student score, response & teacher feedback',
}

const Option = Select.Option

/**
 * @typedef {Object} RedirectPopUpProps
 * @property {{_id: string, firstName: string, status:string}[]} allStudents
 * @property {Object} selectedStudents
 * @property {Object} additionalData
 * @property {boolean} open
 * @property {Function} closePopup
 * @property {Function} setSelected
 * @property {string[]} disabledList
 * @property {string[]} absentList
 * @property {string} assignmentId
 * @property {string} groupId
 */

/**
 * @param {RedirectPopUpProps} props
 */
const RedirectPopUp = ({
  allStudents,
  enrollmentStatus,
  selectedStudents,
  additionalData,
  open,
  closePopup,
  setSelected,
  assignmentId,
  absentList = [],
  disabledList = [],
  groupId,
  testActivity,
  isPremiumUser,
  specificStudents,
  studentUnselectAll,
}) => {
  const [dueDate, setDueDate] = useState(moment().add(1, 'day'))
  const [endDate, setEndDate] = useState(
    moment(getRedirectEndDate(additionalData, dueDate))
  )
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('specificStudents')
  const [studentsToRedirect, setStudentsToRedirect] = useState(selectedStudents)
  const [qDeliveryState, setQDeliveryState] = useState(
    isPremiumUser ? '' : redirectPolicy.QuestionDelivery.ALL
  )
  const [showPrevAttempt, setshowPrevAttempt] = useState(
    'STUDENT_RESPONSE_AND_FEEDBACK'
  )
  const [selectQDeleveryErrorMsg, setselectQDeleveryErrorMsg] = useState('')
  const [allowedTime, setAllowedTime] = useState(
    additionalData.allowedTime || 1
  )
  const [changeAlgo, setChangeAlgo] = useState(false)
  useEffect(() => {
    const setRedirectStudents = {}
    if (type === 'absentStudents') {
      absentList.forEach((st) => {
        setRedirectStudents[st] = true
      })
      setStudentsToRedirect(setRedirectStudents)
    } else if (type === 'entire') {
      const isNotRedirectable = disabledList.length > 0
      !isNotRedirectable &&
        allStudents.forEach((st) => {
          setRedirectStudents[st._id] = true
        })
      setStudentsToRedirect(isNotRedirectable ? {} : setRedirectStudents)
    } else {
      setStudentsToRedirect(selectedStudents)
    }
  }, [type, selectedStudents])

  const submitAction = useCallback(async () => {
    if (!qDeliveryState) {
      setselectQDeleveryErrorMsg('Please select questions to deliver.')
      return
    }
    if (endDate < moment()) {
      return notification({ messageKey: 'SelectFutureEndDate' })
    }
    setLoading(true)
    const selected = Object.keys(studentsToRedirect)
    if (selected.length === 0) {
      notification({
        msg:
          type === 'entire'
            ? 'You can redirect an assessment only after the assessment has been submitted by the student(s).'
            : 'At least one student should be selected to redirect assessment.',
      })
    } else {
      let _selected = selected
      if (
        qDeliveryState === redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG ||
        qDeliveryState === redirectPolicy.QuestionDelivery.SKIPPED
      ) {
        const selectedStudentsTestActivity = testActivity.filter(
          (item) =>
            studentsToRedirect[item.studentId] &&
            some(
              item.questionActivities.filter((o) => o.maxScore != 0),
              (o) => o.skipped || !o.correct
            )
        )
        _selected = selectedStudentsTestActivity.map((item) => item.studentId)
      }
      if (_selected.length) {
        const redirectAssignment = {
          _id: groupId,
          students: type === 'entire' ? [] : _selected,
          showPreviousAttempt: showPrevAttempt,
          questionsDelivery: qDeliveryState,
          endDate: +endDate,
          timedAssignment: additionalData.timedAssignment,
          allowedTime,
          pauseAllowed: !!additionalData.pauseAllowed,
          changeAlgo,
        }
        if (additionalData.dueDate) {
          redirectAssignment.dueDate = dueDate.valueOf()
        }
        await assignmentApi
          .redirect(assignmentId, redirectAssignment)
          .then(() => {
            notification({ type: 'success', messageKey: 'redirectSuccessful' })
            closePopup(true)
          })
          .catch((err) => {
            notification({
              msg: err?.response?.data?.message || 'Unknown Error',
            })
            closePopup()
          })
      } else {
        notification({
          messageKey: 'pleaseSelectStudentsWithIncorrectOrSkippedQuestions',
        })
      }
    }
    studentUnselectAll()
    setLoading(false)
  }, [
    studentsToRedirect,
    assignmentId,
    endDate,
    groupId,
    showPrevAttempt,
    changeAlgo,
    qDeliveryState,
    dueDate,
    allowedTime,
  ])

  const disabledEndDate = (_endDate) => {
    if (!_endDate) {
      return false
    }
    return _endDate < moment().startOf('day')
  }

  const disabledDueDate = useCallback(
    (_dueDate) => _dueDate < moment().startOf('day') || dueDate > endDate,
    [endDate]
  )
  return (
    <CustomModalStyled
      centered
      title="Redirect / Reattempt Assignment"
      visible={open}
      onCancel={closePopup}
      footer={[
        <EduButton isGhost key="cancel" onClick={closePopup}>
          CANCEL
        </EduButton>,
        <EduButton
          data-cy="confirmRedirect"
          loading={loading}
          key="submit"
          onClick={submitAction}
        >
          REDIRECT
        </EduButton>,
      ]}
    >
      <BodyContainer>
        <h4 style={{ fontWeight: 550 }}>{additionalData.className}</h4>
        <Row>
          {/* 
            TODO: handle the change
        */}
          <RadioGrp
            value={type}
            onChange={(e) => {
              setType(e.target.value)
            }}
          >
            <RadioBtn
              data-cy="entireClass"
              value="entire"
              disabled={specificStudents}
            >
              Entire Class
            </RadioBtn>
            <RadioBtn data-cy="absentStudents" value="absentStudents">
              Absent Students
            </RadioBtn>
            <RadioBtn data-cy="specificStudents" value="specificStudents">
              Specific Students
            </RadioBtn>
          </RadioGrp>
        </Row>

        <Row>
          <FieldLabel>
            {' '}
            Students{' '}
            {type === 'specificStudents' && (
              <span
                style={{
                  fontSize: '15px',
                  verticalAlign: 'middle',
                  color: 'red',
                }}
              >
                *
              </span>
            )}
          </FieldLabel>
          <SelectInputStyled
            showSearch
            optionFilterProp="data"
            filterOption={(input, option) => {
              return (
                option.props.data.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              )
            }}
            mode="multiple"
            disabled={type !== 'specificStudents'}
            style={{ width: '100%' }}
            placeholder="Select the students"
            value={Object.keys(selectedStudents)}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(v) => {
              setSelected(v)
            }}
          >
            {allStudents.map(
              (x) =>
                enrollmentStatus[x._id] == '1' && (
                  <Option
                    key={x._id}
                    value={x._id}
                    disabled={disabledList.includes(x._id)}
                    data={`${x.firstName}${x.lastName || ''}${x.email || ''}${
                      x.username || ''
                    }`}
                  >
                    {getUserName(x)}
                  </Option>
                )
            )}
          </SelectInputStyled>
        </Row>

        <Row gutter={24}>
          {additionalData.dueDate ? (
            <Col span={12}>
              <FieldLabel>Due Date</FieldLabel>
              <DatePickerStyled
                data-cy="dueDate"
                allowClear={false}
                disabledDate={disabledDueDate}
                style={{ width: '100%', cursor: 'pointer' }}
                value={dueDate}
                showTime={{ use12Hours: true, format: 'hh:mm a' }}
                format="YYYY-MM-DD hh:mm a"
                showToday={false}
                onChange={(v) => setDueDate(v)}
              />
            </Col>
          ) : (
            isPremiumUser && (
              <Col span={12}>
                <FieldLabel>
                  Questions delivery{' '}
                  <span
                    style={{
                      fontSize: '15px',
                      verticalAlign: 'middle',
                      color: 'red',
                    }}
                  >
                    *
                  </span>
                </FieldLabel>
                <SelectInputStyled
                  data-cy="questionDelivery"
                  onChange={(val) => setQDeliveryState(val)}
                  style={{
                    width: '100%',
                    border:
                      !qDeliveryState && selectQDeleveryErrorMsg
                        ? '0.5px solid red'
                        : '',
                  }}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  placeholder="Select questions to deliver"
                >
                  {Object.keys(QuestionDelivery).map((item) => (
                    <Option key="1" value={item}>
                      {QuestionDelivery[item]}
                    </Option>
                  ))}
                </SelectInputStyled>
                {!qDeliveryState && selectQDeleveryErrorMsg && (
                  <p style={{ color: 'red' }}>{selectQDeleveryErrorMsg}</p>
                )}
              </Col>
            )
          )}
          <Col span={12}>
            <FieldLabel>Close Date</FieldLabel>
            <DatePickerStyled
              data-cy="closeDate"
              allowClear={false}
              disabledDate={disabledEndDate}
              style={{ width: '100%', cursor: 'pointer' }}
              value={endDate}
              showToday={false}
              onChange={(v) => setEndDate(v)}
              showTime={{ use12Hours: true, format: 'hh:mm a' }}
              format="YYYY-MM-DD hh:mm a"
            />
          </Col>
        </Row>
        {isPremiumUser && (
          <Row gutter={24}>
            {additionalData.dueDate ? (
              <Col span={12}>
                <FieldLabel>Questions delivery</FieldLabel>
                <SelectInputStyled
                  data-cy="questionDelivery"
                  defaultValue={qDeliveryState}
                  onChange={(val) => setQDeliveryState(val)}
                  style={{ width: '100%' }}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {Object.keys(QuestionDelivery).map((item) => (
                    <Option key="1" value={item}>
                      {QuestionDelivery[item]}
                    </Option>
                  ))}
                </SelectInputStyled>
              </Col>
            ) : null}
            <Col span={12}>
              <FieldLabel>Show Previous attempt</FieldLabel>
              <SelectInputStyled
                data-cy="previousAttempt"
                value={showPrevAttempt}
                onChange={(val) => setshowPrevAttempt(val)}
                style={{ width: '100%' }}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {Object.keys(ShowPreviousAttempt).map((item, index) => (
                  <Option key={index} value={item}>
                    {ShowPreviousAttempt[item]}
                  </Option>
                ))}
              </SelectInputStyled>
            </Col>
            {additionalData.timedAssignment ? (
              <Col span={12}>
                <FieldLabel>Time Limit</FieldLabel>
                <TextInputStyled
                  type="number"
                  data-cy="allowedTime"
                  value={allowedTime / (60 * 1000)}
                  onChange={(e) => setAllowedTime(e.target.value * (60 * 1000))}
                  style={{ width: '60%' }}
                  min={1}
                  max={300}
                />{' '}
                <span>&nbsp;minutes</span>
              </Col>
            ) : null}
            <Col span={12}>
              <CheckboxLabel
                onChange={() => setChangeAlgo(!changeAlgo)}
                value={changeAlgo}
              >
                Change dynamic parameter values &nbsp;
                <Tooltip title="Students will get different value for dynamic parameter from their last attempt">
                  <IconInfo />
                </Tooltip>
              </CheckboxLabel>
            </Col>
          </Row>
        )}
      </BodyContainer>
    </CustomModalStyled>
  )
}

export default connect(
  (state) => ({
    isPremiumUser: get(state, ['user', 'user', 'features', 'premium'], false),
    specificStudents: getIsSpecificStudents(state),
  }),
  {
    studentUnselectAll: gradebookUnSelectAllAction,
  }
)(RedirectPopUp)
