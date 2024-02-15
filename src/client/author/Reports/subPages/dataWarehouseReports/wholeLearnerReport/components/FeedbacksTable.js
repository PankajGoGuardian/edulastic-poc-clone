import { feedbackApi } from '@edulastic/api'
import { EduButton, notification } from '@edulastic/common'
import { IconInfo, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { formatDate } from '@edulastic/constants/reportUtils/common'
import { Row, Spin, Tooltip, Typography } from 'antd'
import { get, isEmpty, omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { themeColor } from '@edulastic/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUnlockAlt } from '@fortawesome/free-solid-svg-icons'
import CsvTable from '../../../../common/components/tables/CsvTable'
import FeedbackModal from '../../../../../Student/components/StudentTable/FeedbackModal'
import DeleteFeedBackModal from './DeleteFeedBackModal'
import { StyledTableButton } from '../../../../../../assessment/widgets/Coding/styled'
import { styledTable } from '../common/styled'
import { getFormattedName } from '../../../../../Gradebook/transformers'

const getFormattedData = (arr) => {
  return arr.length > 1
    ? `${arr.slice(0, arr.length - 1).join(', ')} and ${arr[arr.length - 1]}`
    : arr.join(', ')
}

const FeedbacksTable = (props) => {
  const {
    studentId,
    termId,
    currentUserId,
    onCsvConvert,
    isCsvDownloading,
    studentData,
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
  }, [studentId, termId])

  useEffect(() => {
    if (!params) return
    setLoading(true)
    loadData()
      .then((d) => setData(d))
      .catch((err) => {
        notification({
          type: 'error',
          msg: `Failed to get feedbacks: ${err}`,
        })
      })
      .finally(() => setLoading(false))
  }, [params])

  const handleEdit = (record) => {
    setIsEditFlow(true)
    setFeedbackStudent({
      ...record.givenTo,
      classId: record.class._id,
      ...record,
    })
  }

  const handleAdd = () => {
    setFeedbackStudent({
      ...studentData,
      _id: studentId,
      classId: studentData.groupId,
    })
  }

  const handleClose = () => {
    setFeedbackStudent({})
    setIsEditFlow(false)
  }

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'createdAt',
      align: 'left',
      width: 100,
      render: (value) => formatDate(value) || '-',
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      align: 'left',
      width: 100,
    },
    {
      title: 'USER',
      dataIndex: 'givenBy',
      align: 'left',
      width: 150,
      render: (value) =>
        getFormattedName(value.firstName, value.middleName, value.lastName),
    },
    {
      title: 'ROLE',
      dataIndex: 'givenBy.role',
      align: 'left',
      width: 100,
    },
    {
      title: 'CLASS',
      dataIndex: 'class',
      align: 'left',
      width: 150,
      render: (value) => {
        return value.name
      },
    },
    {
      title: 'FEEDBACK',
      dataIndex: 'feedback',
      align: 'left',
      width: 400,
      render: (value) => {
        return (
          <Typography.Paragraph style={{ whiteSpace: 'pre-line' }}>
            {value}
          </Typography.Paragraph>
        )
      },
    },
    {
      title: 'ACCESS',
      dataIndex: 'sharedWith',
      align: 'left',
      width: 100,
      render: (value, record) => {
        if (value.type === 'me') {
          return (
            <>
              <FontAwesomeIcon
                icon={faUnlockAlt}
                style={{ marginRight: '10px' }}
              />
              Only to you
            </>
          )
        }
        if (value.type === 'individual') {
          return (
            <>
              Selected
              <Tooltip
                title={getFormattedData(
                  record.sharedWith.users.map((o) => o.email)
                )}
              >
                <IconInfo
                  height="11px"
                  style={{ marginLeft: '2px', cursor: 'pointer' }}
                />
              </Tooltip>
            </>
          )
        }
        return 'Everyone'
      },
    },
    {
      title: 'ACTIONS',
      dataIndex: '_id',
      align: 'left',
      width: 100,
      render: (id, record) => {
        return record.givenBy._id === currentUserId ? (
          <div style={{ whiteSpace: 'nowrap' }}>
            <StyledTableButton onClick={() => handleEdit(record)} title="Edit">
              <IconPencilEdit color={themeColor} />
            </StyledTableButton>
            <StyledTableButton
              onClick={() => handleDelete(record)}
              title="delete"
            >
              <IconTrash color={themeColor} />
            </StyledTableButton>
          </div>
        ) : null
      },
    },
  ]

  return (
    <>
      <Row
        type="flex"
        style={{
          margin: '32px 0',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography.Title style={{ margin: 0 }} level={4}>
          Narrative Feedback
        </Typography.Title>
        <EduButton onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
          Add Feedback
        </EduButton>
      </Row>
      <Spin spinning={loading}>
        <CsvTable
          dataSource={data}
          columns={columns}
          tableToRender={styledTable}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 5,
          }}
        />
        {!isEmpty(feedbackStudent) && (
          <FeedbackModal
            feedbackStudentId={feedbackStudent._id}
            feedbackStudent={feedbackStudent}
            isEditFlow={isEditFlow}
            onClose={handleClose}
            setData={setData}
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

export default enhance(FeedbacksTable)
