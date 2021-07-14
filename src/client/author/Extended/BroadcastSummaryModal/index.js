/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Modal, Select, Empty } from 'antd'
import { keyBy } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import { FlexContainer, MeetFirebase } from '@edulastic/common'

import QuestionWrapper from '../../../assessment/components/QuestionWrapper'
import { getRows } from '../../ItemDetail/ducks'
import Broadcast from '../../src/assets/broadcast'
import { Container, Count, Title } from './styled'

const STATS_COLORS = {
  CORRECT: 'limegreen',
  INCORRECT: 'red',
  'NOT ENGAGED': 'grey',
}

const bodyStyle = {
  background: '#e3e3e3',
  minHeight: '600px',
  maxheight: '750px',
  padding: '0',
}

const Stats = ({ label, count }) => (
  <FlexContainer
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
  >
    <Count color={STATS_COLORS[label]}>{count}</Count>
    <Title>{label}</Title>
  </FlexContainer>
)

const BroadcastTitle = ({ classList = [], setClassId, value, counts = {} }) => (
  <FlexContainer
    height="40px"
    padding="10px 0 0 0"
    justifyContent="space-evenly"
  >
    <h3 style={{ fontWeight: '600' }}>
      <Broadcast
        iconStyle={{
          width: '22px',
          height: '22px',
          margin: '0px 10px 0px -14px',
          cursor: 'pointer',
        }}
      />
      Broadcast Performance
    </h3>

    <FlexContainer width="300px" justifyContent="space-evenly">
      <Stats
        label="CORRECT"
        count={Object.keys(counts).length ? counts.correct : '-'}
      />
      <Stats
        label="INCORRECT"
        count={Object.keys(counts).length ? counts.incorrect : '-'}
      />
      <Stats
        label="NOT ENGAGED"
        count={Object.keys(counts).length ? counts.notEngaged : '-'}
      />
    </FlexContainer>

    <div>
      <Select
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        dropdownMatchSelectWidth={false}
        value={value}
        style={{ width: '200px' }}
        onChange={setClassId}
      >
        {classList.map(({ _id, name }) => (
          <Select.Option value={_id}>{name}</Select.Option>
        ))}
      </Select>
    </div>
  </FlexContainer>
)

const QuestionNavigation = ({ disable, icon, clickCallback }) => (
  <FlexContainer width="40px" alignItems="center" justifyContent="center">
    {disable && (
      <FontAwesomeIcon
        icon={icon}
        aria-hidden="true"
        style={{ color: '#505050', fontSize: '30px', cursor: 'pointer' }}
        onClick={clickCallback}
      />
    )}
  </FlexContainer>
)

const BroadcastSummaryModal = ({
  visible = false,
  closeModal,
  evaluation = {},
  multiple,
  qIndex,
  classList = [],
  meetingID = 'rnt-jbbt-mri',
}) => {
  const [items, setItems] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [classId, setClassId] = useState(classList[0]?._id)
  const [counts, setCounts] = useState({})

  // rnt-jbbt-mri
  // 5e4a6c9b1838d70007432954
  // rnt-jbbt-mri-5e4a6c9b1838d70007432954

  useEffect(() => {
    if (meetingID) {
      MeetFirebase.db
        .collection('MeetingUserQuestions')
        .where('meetingID', '==', meetingID)
        .where('classId', '==', classId)
        .get()
        .then((snapshot) => {
          const { docs = [] } = snapshot
          const { questions = [] } = docs?.[0]?.data() || {}
          setItems(questions)

          const _counts = {}

          questions.forEach((question) => {
            const { _id: qId } = question

            let correct = 0
            let incorrect = 0
            let notEngaged = 0

            // This could get expensive !!!
            docs.forEach((doc) => {
              const { evaluations } = doc.data()
              const evaluation = evaluations.find(
                ({ itemId }) => itemId === qId
              )
              if (!evaluation) return ++notEngaged

              if (evaluation) {
                const { score, maxScore, skipped } = evaluation
                if (!skipped && score === maxScore) return ++correct
                return ++incorrect
              }
            })

            _counts[qId] = { correct, incorrect, notEngaged }
          })

          setCounts(_counts)
        })
    }
  }, [classId])

  const item = items[currentIndex]

  const rows = (item && getRows(item)) || []

  const widget = rows?.[0]?.widgets?.[0] || {}

  const questions = {
    ...keyBy(item?.data?.questions, 'id'),
    ...keyBy(item?.data?.resources, 'id'),
  }

  const question = questions[widget?.reference]

  const isFirstItem = currentIndex === 0
  const isLastItem = !items.length || currentIndex === items.length - 1

  const handleClassChange = (cId) => {
    setClassId(cId)
    setCurrentIndex(0)
  }

  return (
    <Modal
      width="900px"
      visible={visible}
      title={
        <BroadcastTitle
          value={classId}
          setClassId={handleClassChange}
          classList={classList}
          counts={counts[item?._id]}
        />
      }
      onCancel={closeModal}
      footer={null}
      bodyStyle={bodyStyle}
    >
      <FlexContainer height="" justifyContent="space-between">
        <QuestionNavigation
          disable={!isFirstItem}
          icon={faAngleLeft}
          clickCallback={() =>
            setCurrentIndex((previousIndex) => previousIndex - 1)
          }
        />

        <Container>
          {question ? (
            <QuestionWrapper
              evaluation={evaluation}
              multiple={multiple}
              type={widget.type}
              view="preview"
              qIndex={qIndex}
              previewTab="show"
              timespent={null}
              questionId={widget.reference}
              data={{ ...question, smallSize: true }}
              noPadding
              noBoxShadow
              isFlex
              LCBPreviewModal
              borderRadius="0"
              tabIndex={widget.tabIndex}
              isBroadcast
            />
          ) : (
            <FlexContainer alignItems="center" height="100%">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>No Broadcasted Questions to this Class</span>
                }
              />
            </FlexContainer>
          )}
        </Container>

        <QuestionNavigation
          disable={!isLastItem}
          icon={faAngleRight}
          clickCallback={() =>
            setCurrentIndex((previousIndex) => previousIndex + 1)
          }
        />
      </FlexContainer>
    </Modal>
  )
}

export default connect((state) => ({
  preview: state.view.preview,
  classList: state.user?.user?.orgData?.classList,
}))(BroadcastSummaryModal)
