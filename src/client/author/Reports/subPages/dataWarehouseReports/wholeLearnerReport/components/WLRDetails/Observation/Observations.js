import { feedbackApi } from '@edulastic/api'
import {
  EduButton,
  EduElse,
  EduIf,
  EduThen,
  notification,
} from '@edulastic/common'
import moment from 'moment'
import { Row, Spin, Typography } from 'antd'
import { get, isEmpty, omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { formatName } from '@edulastic/constants/reportUtils/common'
import { ROLE_LABEL } from '@edulastic/constants/const/roleType'
import FeedbackModal from '../../../../../../../Student/components/StudentTable/FeedbackModal'
import DeleteFeedBackModal from '../../DeleteFeedBackModal'
import ObservationTile from './ObservationTile'
import { NoDataContainer } from './styled'

const Observations = (props) => {
  const {
    studentId,
    termId,
    currentUserId,
    studentData,
    isSharedReport,
    data: observationData,
    isModal = false,
    isCsvDownloading = false,
    onCsvConvert,
  } = props
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletedFeedback, setDeleteFeedback] = useState(null)
  const [params, setParams] = useState(null)
  const [loading, setLoading] = useState(false)
  const [feedbackStudent, setFeedbackStudent] = useState({})
  const [data, setData] = useState([])
  const [isEditFlow, setIsEditFlow] = useState(false)

  const handleDelete = (feedback) => {
    setShowDeleteModal(true)
    setDeleteFeedback(feedback)
  }
  const loadData = async () => {
    const response = await feedbackApi.getFeedbacks(
      params.studentId,
      omit(params, ['studentId'])
    )
    return response.result.map((d) => ({
      ...d,
    }))
  }

  useEffect(() => {
    setLoading(false)
    setData([])
    if (studentId && termId) {
      setParams({
        studentId,
        termId,
      })
    }
  }, [studentId, termId, observationData])

  useEffect(() => {
    if (!params) return
    setLoading(true)
    loadData()
      .then((d) => setData(d))
      .catch((err) => {
        notification({
          type: 'error',
          msg: `Failed to get Observations: ${err}`,
        })
      })
      .finally(() => setLoading(false))
  }, [params])

  useEffect(() => {
    if (isCsvDownloading && data.length) {
      const header = ['DATE', 'TYPE', 'USER', 'ROLE', 'CLASS', 'FEEDBACK']
      const csvRawData = [header]
      data.forEach((row) => {
        const {
          givenBy,
          feedback,
          type: feedbackType,
          class: { name: className = '-' } = {},
          updatedAt,
        } = row
        const date = moment(parseInt(updatedAt, 10)).format("Do MMM'YY")
        const authorName =
          formatName(givenBy, {
            lastNameFirst: false,
          }) || 'Anonymous'
        csvRawData.push([
          date,
          feedbackType,
          authorName,
          ROLE_LABEL[givenBy.role],
          className,
          feedback.replace(/<[^>]*>?/gm, ''),
        ])
      })
      const finalData = csvRawData
        .map((row) =>
          row
            .map((cell) =>
              cell
                .replace(/(\r\n|\n|\r)/gm, ' ')
                .replace(/(\s+)/gm, ' ')
                .replace(/"/g, '""')
            )
            .join(',')
        )
        .join('\n')
      onCsvConvert(finalData)
    }
  }, [isCsvDownloading, data])

  const handleEdit = (record) => {
    setIsEditFlow(true)
    setFeedbackStudent({
      ...record.givenTo,
      classId: record.class?._id,
      ...record,
    })
  }

  const handleAdd = () => {
    setFeedbackStudent({
      ...studentData,
      _id: studentId,
    })
  }

  const handleClose = () => {
    setFeedbackStudent({})
    setIsEditFlow(false)
  }

  return (
    <>
      <EduIf condition={!isModal}>
        <Row
          type="flex"
          style={{
            margin: 'auto',
            marginTop: '32px',
            marginBottom: '32px',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '70%',
            maxWidth: '800px',
          }}
        >
          <Typography.Title style={{ margin: 0 }} level={4}>
            {data.length} Observations
          </Typography.Title>
          {!isSharedReport && (
            <EduButton onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
              Add Observation
            </EduButton>
          )}
        </Row>
      </EduIf>
      <Spin spinning={loading}>
        <EduIf condition={loading || data.length}>
          <EduThen>
            {data.map((observation) => (
              <ObservationTile
                observation={observation}
                currentUserId={currentUserId}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isModal={isModal}
              />
            ))}
          </EduThen>
          <EduElse>
            <NoDataContainer>No observations available</NoDataContainer>
          </EduElse>
        </EduIf>
        {!isEmpty(feedbackStudent) && (
          <FeedbackModal
            feedbackStudentId={feedbackStudent._id}
            feedbackStudent={feedbackStudent}
            isEditFlow={isEditFlow}
            onClose={handleClose}
            setData={setData}
            termId={termId}
            data={data}
          />
        )}
      </Spin>
      {showDeleteModal && (
        <DeleteFeedBackModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          deleteFeedback={deletedFeedback}
          setDeleteFeedback={setDeleteFeedback}
          setData={setData}
          data={data}
        />
      )}
    </>
  )
}

const enhance = compose(
  connect((state) => ({
    currentUserId: get(state, 'user.user._id', ''),
  }))
)

export default enhance(Observations)
