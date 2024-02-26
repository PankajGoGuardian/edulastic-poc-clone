import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Button, Divider, Icon } from 'antd'
import { EduSwitchStyled, notification } from '@edulastic/common'
import ButtonGroup from 'antd/lib/button/button-group'
import styled from 'styled-components'
import {
  CloseModal,
  LinksWrapper,
  NavigationWrapper,
  StyledText,
  StyledTextInfo,
  CloseModalText,
  EditResponse,
} from './styled'
import { StyledSelect } from '../../../../common/styled'

const { Option } = StyledSelect

const BtnGroup = styled(ButtonGroup)`
  & > .ant-select {
    & > .ant-select-selection {
      padding: 0px;
    }
  }
  & > :not(:first-child):not(:last-child) {
    &.ant-btn,
    &.ant-select > .ant-select-selection {
      border: 1px solid #d9d9d9;
      border-inline: 0;
      border-radius: 0;
    }
  }
`

const getParentElement = (node) => node.parentNode.parentNode

const BottomNavigation = ({
  qIndex,
  selectQuestion,
  studentIndex,
  tableData,
  selectStudent,
  // prevStudent,
  // nextStudent,
  // prevQuestion,
  // nextQuestion,
  hideModal,
  editResponse,
  toggleEditResponse,
  gradingType,
  setGradingType,
  gradingStatus,
  setGradingStatus,
}) => {
  // const [gradingType, setGradingType] = useState('all')
  // const [gradingStatus, setGradingStatus] = useState('all')

  // notification({ type: 'success', messageKey: 'finishedGrading' })

  const [
    questionsByStudent,
    gradingTypeStats,
    gradingStatusStats,
  ] = useMemo(() => {
    const _gradingTypeStats = {
      all: 0,
      auto: 0,
      manual: 0,
    }
    const _gradingStatusStats = {
      all: 0,
      graded: 0,
      ungraded: 0,
    }
    const qbyStu = tableData.map((td) => {
      const questions = []
      let studentAutoGraded = true
      let studentGraded = true
      _gradingTypeStats.all += td.questions
      _gradingStatusStats.all += td.questions
      for (let i = 0; i < td.questions; i++) {
        const qi = `Q${i}`
        questions.push({
          ...td[qi],
          disabled:
            (gradingType !== 'all' &&
              td[qi].autoGrade !== (gradingType === 'auto')) ||
            (gradingStatus !== 'all' &&
              td[qi].graded !== (gradingStatus === 'graded')),
        })
        _gradingTypeStats.auto += td[qi].autoGrade ? 1 : 0
        _gradingStatusStats.graded += td[qi].graded ? 1 : 0
        studentAutoGraded = studentAutoGraded && td[qi].autoGrade
        studentGraded = studentGraded && td[qi].graded
      }
      return {
        questions,
        student: td.students,
        autoGraded: studentAutoGraded,
        graded: studentGraded,
        disabled: questions.every((q) => q.disabled),
      }
    })
    _gradingTypeStats.manual = _gradingTypeStats.all - _gradingTypeStats.auto
    _gradingStatusStats.ungraded =
      _gradingStatusStats.all - _gradingStatusStats.graded
    return [qbyStu, _gradingTypeStats, _gradingStatusStats]
  }, [tableData, gradingType, gradingStatus])

  const prevStudent = useCallback(() => {
    const idx = questionsByStudent.findLastIndex(
      (s, i) => !s.disabled && i < studentIndex
    )
    if (idx !== -1) selectStudent(idx)
    else notification({ type: 'info', msg: 'No more students' })
  }, [questionsByStudent, studentIndex])
  const nextStudent = useCallback(() => {
    if (
      studentIndex === questionsByStudent.length - 1 &&
      questionsByStudent[studentIndex].questions.length - 1 === qIndex
    ) {
      notification({ type: 'success', messageKey: 'finishedGrading' })
      return
    }
    const idx = questionsByStudent.findIndex(
      (s, i) => !s.disabled && i > studentIndex
    )
    if (idx !== -1) selectStudent(idx)
    else notification({ type: 'info', msg: 'No more students' })
  }, [questionsByStudent, studentIndex, qIndex])
  const prevQuestion = useCallback(() => {
    const idx = questionsByStudent[studentIndex].questions.findLastIndex(
      (s, i) => !s.disabled && i < qIndex
    )
    if (idx !== -1) selectQuestion(idx)
    else notification({ type: 'info', msg: 'No more questions' })
  }, [questionsByStudent, studentIndex, qIndex])
  const nextQuestion = useCallback(() => {
    if (
      studentIndex === questionsByStudent.length - 1 &&
      questionsByStudent[studentIndex].questions.length - 1 === qIndex
    ) {
      notification({ type: 'success', messageKey: 'finishedGrading' })
      return
    }
    const idx = questionsByStudent[studentIndex].questions.findIndex(
      (s, i) => !s.disabled && i > qIndex
    )
    if (idx !== -1) selectQuestion(idx)
    else notification({ type: 'info', msg: 'No more questions' })
  }, [questionsByStudent, studentIndex, qIndex])

  useEffect(() => {
    const keyListener = (event) => {
      if (event.keyCode === 37) {
        prevQuestion()
      }
      if (event.keyCode === 38) {
        prevStudent()
      }
      if (event.keyCode === 39) {
        nextQuestion()
      }
      if (event.keyCode === 40) {
        nextStudent()
      }
    }
    document.addEventListener('keyup', keyListener, false)

    return () => {
      document.removeEventListener('keyup', keyListener, false)
    }
  }, [prevQuestion, nextQuestion, prevStudent, nextStudent])

  return (
    <NavigationWrapper>
      <StyledTextInfo>
        <Icon type="info-circle" />
        <StyledText>
          USE THE KEYBOARDS ARROW TO NAVIGATE BETWEEN THE SCREENS
        </StyledText>
      </StyledTextInfo>
      <LinksWrapper>
        <StyledSelect
          value={gradingType}
          onChange={(value) => setGradingType(value)}
          getPopupContainer={getParentElement}
          style={{ width: 200, marginInline: '8px' }}
        >
          <Option value="all">
            Auto/Manual Graded ({gradingTypeStats.all})
          </Option>
          <Option value="auto">Auto Graded ({gradingTypeStats.auto})</Option>
          <Option value="manual">
            Manual Graded ({gradingTypeStats.manual})
          </Option>
        </StyledSelect>
        <StyledSelect
          value={gradingStatus}
          onChange={(value) => setGradingStatus(value)}
          getPopupContainer={getParentElement}
          style={{ width: 200, marginInline: '8px' }}
        >
          <Option value="all">
            Graded/UnGraded ({gradingStatusStats.all})
          </Option>
          <Option value="graded">Graded ({gradingStatusStats.graded})</Option>
          <Option value="ungraded">
            UnGraded ({gradingStatusStats.ungraded})
          </Option>
        </StyledSelect>
        <Divider type="vertical" />
        <BtnGroup>
          <Button onClick={prevStudent}>
            <Icon type="up" />
            {/* <StyledText>{'<'}</StyledText> */}
          </Button>
          <StyledSelect
            value={questionsByStudent[studentIndex].student.studentId}
            onChange={(sid) =>
              selectStudent(
                questionsByStudent.findIndex((s) => s.student.studentId === sid)
              )
            }
            // placeholder="All"
            getPopupContainer={getParentElement}
          >
            {questionsByStudent.map((item) => (
              <Option
                key={item.student.studentId}
                value={item.student.studentId}
                disabled={item.disabled}
              >
                {item.student.studentName ?? item.student.fakeName}
              </Option>
            ))}
          </StyledSelect>
          <Button onClick={nextStudent}>
            <Icon type="down" />
            {/* <StyledText>NEXT STUDENT</StyledText> */}
          </Button>
        </BtnGroup>
        <Divider type="vertical" />
        <BtnGroup>
          <Button onClick={prevQuestion}>
            <Icon type="left" />
            {/* <StyledText>PREV QUESTION</StyledText> */}
          </Button>
          <StyledSelect
            value={questionsByStudent[studentIndex].questions[qIndex]._id}
            onChange={(sid) =>
              selectQuestion(
                questionsByStudent[studentIndex].questions.findIndex(
                  (s) => s._id === sid
                )
              )
            }
            getPopupContainer={getParentElement}
          >
            {questionsByStudent[studentIndex].questions.map((item, index) => (
              <Option key={item._id} value={item._id} disabled={item.disabled}>
                {item.barLabel ?? `Q${index + 1}`}
              </Option>
            ))}
          </StyledSelect>
          <Button onClick={nextQuestion}>
            {/* <StyledText>NEXT QUESTION</StyledText> */}
            <Icon type="right" />
          </Button>
        </BtnGroup>
        <EditResponse>
          <StyledText>EDIT RESPONSE</StyledText>
          <EduSwitchStyled
            width={45}
            data-cy="editResponse"
            checked={editResponse}
            onClick={toggleEditResponse}
          />
        </EditResponse>
        <CloseModal data-cy="exitbutton" onClick={hideModal}>
          <Icon type="close" width={5} height={5} />
          <CloseModalText>EXIT</CloseModalText>
        </CloseModal>
      </LinksWrapper>
    </NavigationWrapper>
  )
}

BottomNavigation.propTypes = {
  hideModal: PropTypes.func.isRequired,
}

export default BottomNavigation
