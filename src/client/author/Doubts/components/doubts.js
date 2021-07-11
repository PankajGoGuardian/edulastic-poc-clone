import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Spin, Input } from 'antd'
import {
  MainContentWrapper,
  CustomModalStyled,
  EduButton,
} from '@edulastic/common'
import ClassHeader from '../../Shared/Components/ClassHeader/ClassHeader'
import {
  getAdditionalDataSelector,
  getTestActivitySelector,
} from '../../ClassBoard/ducks'
import {
  getDoubtsAction,
  getDoubtsList,
  getLoading,
  postAnswerAction,
} from '../ducks'

const { TextArea } = Input

const Doubts = ({
  additionalData = {},
  match,
  history,
  testActivity,
  loading,
  getDoubts,
  doubts,
  postAnswer,
}) => {
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [answer, setAnswer] = useState('')
  const [selectedDoubt, setSelectedDoubt] = useState({})

  useEffect(() => {
    getDoubts(additionalData.testId)
  }, [])

  const openAnswerModal = (doubt) => {
    setSelectedDoubt(doubt)
    setShowAnswerModal(true)
  }

  const closeAnswerModal = () => {
    setAnswer('')
    setShowAnswerModal(false)
  }

  const submitAnswer = () => {
    postAnswer({
      assignmentId: selectedDoubt.assignmentId,
      questionId: selectedDoubt._id,
      answers: answer,
    })
    closeAnswerModal()
  }

  return (
    <div>
      <ClassHeader
        classId={match.params?.classId}
        active="doubts"
        assignmentId={match.params?.assignmentId}
        additionalData={additionalData || {}}
        onCreate={() => history.push(`${match.url}/create`)}
        testActivity={testActivity}
      />
      <MainContentWrapper>
        {loading ? (
          <Spin />
        ) : (
          doubts.map((doubt, index) => (
            <>
              <Row style={{ marginBottom: '10px' }}>
                <p>
                  <b>Question {index + 1}</b> : {doubt.question}{' '}
                </p>
              </Row>
              {doubt.answers.length === 0 && (
                <EduButton
                  isGhost
                  onClick={() => {
                    openAnswerModal(doubt)
                  }}
                >
                  Post an answer
                </EduButton>
              )}
              {doubt.answers.length !== 0 && (
                <Row style={{ marginBottom: '20px' }}>
                  <p>
                    <b>Answer</b>: {doubt.answers[0].answers}
                  </p>
                </Row>
              )}
            </>
          ))
        )}
        {showAnswerModal && (
          <CustomModalStyled
            visible={showAnswerModal}
            title="Post an answer"
            footer={
              <>
                <EduButton
                  data-cy="cancelButton"
                  isGhost
                  onClick={closeAnswerModal}
                >
                  CANCEL
                </EduButton>
                <EduButton
                  data-cy="applyButton"
                  onClick={submitAnswer}
                  disabled={answer.length === 0}
                >
                  CREATE
                </EduButton>
              </>
            }
          >
            <div>
              <TextArea
                rows="4"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </CustomModalStyled>
        )}
      </MainContentWrapper>
    </div>
  )
}

export default connect(
  (state) => ({
    additionalData: getAdditionalDataSelector(state),
    testActivity: getTestActivitySelector(state),
    doubts: getDoubtsList(state),
    loading: getLoading(state),
  }),
  {
    getDoubts: getDoubtsAction,
    postAnswer: postAnswerAction,
  }
)(Doubts)
