import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { get, isEmpty, pullAt } from 'lodash'
import * as moment from 'moment'

// components
import { Spin, Tooltip } from 'antd'
import { GiDominoMask } from 'react-icons/gi'
import {
  IconClose,
  IconCorrect,
  IconExclamationMark,
  IconNote,
  IconPlusCircle,
} from '@edulastic/icons'
import { lightBlue3, themeColor } from '@edulastic/colors'
import { EduIf, EduSwitchStyled, FlexContainer } from '@edulastic/common'
import { GROUP_TYPE } from '@edulastic/constants/const/report'
import { roleuser } from '@edulastic/constants'
import {
  NoStudents,
  NoConentDesc,
  StyledIcon,
  StudentsTable,
  TableWrapper,
  SwitchBox,
  NotEnrolledMessage,
} from './styled'
import { isFeatureAccessible } from '../../../../features/components/FeaturesSwitch'

// ducks
import { proxyUser } from '../../../authUtils'
import { getSelectedClass, selectStudentAction } from '../../ducks'
import {
  getUserFeatures,
  isProxyUser as isProxyUserSelector,
} from '../../../../student/Login/ducks'
import {
  getUserId,
  getUserRole,
  getGroupList,
} from '../../../src/selectors/user'
import { getFormattedName } from '../../../Gradebook/transformers'
import FeedbackModal from '../../../Student/components/StudentTable/FeedbackModal'
import { fieldsMapping } from '../../constants'
import ObservationModal from './ObservationModal'

const StudentsList = ({
  cuId,
  cuRole,
  loaded,
  students,
  selectStudents,
  selectedStudent,
  features,
  groupList,
  selectedClass,
  updating,
  allowCanvasLogin,
  isProxyUser,
  currentClass,
}) => {
  const [showCurrentStudents, setShowCurrentStudents] = useState(true)
  const [feedbackStudentId, setFeedbackStudentId] = useState(null)
  const [showObservationModal, setShowObservationModal] = useState(false)
  const { dataWarehouseReports } = features

  const { _id: groupId, type, active } = selectedClass
  const typeText = type !== 'class' ? 'group' : 'class'

  useEffect(() => {
    setShowCurrentStudents(!!active)
  }, [active])

  const rowSelection = {
    onChange: (_, selectedRows) => {
      selectStudents(selectedRows)
    },
    getCheckboxProps: () => ({
      disabled: !active,
    }),
    selectedRowKeys: selectedStudent.map(({ _id }) => _id),
  }

  const empty = isEmpty(students)
  // here only students without enrollmentStatus as "0" are shown
  const filteredStudents = showCurrentStudents
    ? students.filter(
        (student) => student.enrollmentStatus === 1 && student.status === 1
      )
    : students

  const isPremium = isFeatureAccessible({
    features,
    inputFeatures: 'searchAndAddStudent',
    groupId,
    groupList,
  })

  const showObservationColumn = [
    currentClass.type === GROUP_TYPE.CLASS,
    cuRole === roleuser.TEACHER,
    dataWarehouseReports,
  ].every((o) => !!o)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      defaultSortOrder: 'descend',
      align: 'left',
      sorter: (a, b) => (b.lastName || '').localeCompare(a.lastName || ''),
      render: (_, { firstName, lastName, middleName }) => {
        const fullName = getFormattedName(firstName, middleName, lastName)
        return (
          <span>
            {`${fullName === 'Anonymous' || fullName === '' ? '-' : fullName}`}
          </span>
        )
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.username > b.username,
      render: (username) => <span data-cy={username}>{username}</span>,
      width: isPremium ? '20%' : '25%',
      align: 'left',
    },
    {
      title: 'Accommodation Available',
      dataIndex: 'accommodations',
      align: 'center',
      render: (data) => <AccommodationRender data={data} />,
      width: '15%',
    },

    ...(allowCanvasLogin
      ? [
          {
            title: 'Canvas User',
            dataIndex: 'canvasId',
            align: 'center',
            defaultSortOrder: 'descend',
            render: (canvasId, { openIdProvider }) => (
              <span>
                {openIdProvider === 'canvas' && canvasId ? (
                  <IconCorrect />
                ) : (
                  <IconClose color="#ff99bb" width="10px" height="10px" />
                )}
              </span>
            ),
            width: '20%',
          },
        ]
      : []),
    {
      title: 'Status',
      dataIndex: 'enrollmentStatus',
      align: 'center',
      defaultSortOrder: 'descend',
      width: isPremium ? '15%' : '20%',
      sorter: (a, b) => a.enrollmentStatus > b.enrollmentStatus,
      render: (enrollmentStatus, { enrollmentUpdatedAt, status }) => (
        <span>
          {enrollmentStatus && enrollmentStatus === 1 && status === 1 ? (
            'Active'
          ) : (
            <NotEnrolledMessage>
              <IconExclamationMark />
              <div>
                {`Student not enrolled${
                  enrollmentUpdatedAt
                    ? ` after ${moment(enrollmentUpdatedAt).format(
                        'MMM DD, YYYY'
                      )}`
                    : ''
                }`}
              </div>
            </NotEnrolledMessage>
          )}
        </span>
      ),
    },
    ...(showObservationColumn
      ? [
          {
            title: 'Observations',
            dataIndex: '_id',
            align: 'center',
            render: (studentId, record) => {
              return (
                <FlexContainer
                  style={{ gap: '30px', margin: 'auto' }}
                  alignItems="center"
                  justifyContent="flex-end"
                  width="63px"
                >
                  <EduIf condition={record.observationCount > 0}>
                    <Tooltip
                      placement="bottom"
                      title="View Observation History"
                    >
                      <IconNote
                        onClick={() => {
                          setFeedbackStudentId(studentId)
                          setShowObservationModal(true)
                        }}
                        color={themeColor}
                      />
                    </Tooltip>
                  </EduIf>
                  <Tooltip placement="bottom" title="Add Observation">
                    <IconPlusCircle
                      color={themeColor}
                      onClick={() => setFeedbackStudentId(studentId)}
                    />
                  </Tooltip>
                </FlexContainer>
              )
            },
          },
        ]
      : []),
    {
      render: (_, { _id, enrollmentStatus, status }) => (
        <div>
          {!isProxyUser && enrollmentStatus === 1 && status === 1 ? (
            <Tooltip placement="topRight" title="View as Student">
              <GiDominoMask
                onClick={() =>
                  proxyUser({
                    userId: _id,
                    groupId,
                    currentUser: { _id: cuId, role: cuRole },
                  })
                }
              />
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ]

  if (!isPremium) {
    pullAt(columns, 2)
  }

  const rowKey = (record) => record._id
  const showStudentsHandler = () => {
    setShowCurrentStudents((show) => !show)
  }

  const feedbackStudent =
    students.find(({ _id: studentId }) => studentId === feedbackStudentId) || {}

  return (
    <div>
      {!loaded || updating ? (
        <Spin />
      ) : empty ? (
        <NoStudents>
          <StyledIcon type="user-add" fill={lightBlue3} size={45} />
          <NoConentDesc>
            <div> There are no students in your {typeText}.</div>
            <p>Add students to your {typeText} and begin assigning work</p>
          </NoConentDesc>
        </NoStudents>
      ) : (
        <TableWrapper>
          <>
            <SwitchBox>
              <span>SHOW ACTIVE STUDENTS</span>
              <EduSwitchStyled
                checked={showCurrentStudents}
                onClick={showStudentsHandler}
              />
            </SwitchBox>
            <StudentsTable
              columns={columns}
              rowSelection={rowSelection}
              dataSource={filteredStudents}
              rowKey={rowKey}
              pagination={false}
            />
          </>
        </TableWrapper>
      )}
      <FeedbackModal
        feedbackStudentId={showObservationModal ? null : feedbackStudentId}
        feedbackStudent={{
          ...feedbackStudent,
          classId: currentClass._id,
        }}
        onClose={() => setFeedbackStudentId(null)}
        termId={currentClass.termId}
      />
      <ObservationModal
        visible={showObservationModal}
        selectedStudent={feedbackStudent}
        onClose={() => {
          setFeedbackStudentId(null)
          setShowObservationModal(false)
        }}
        termId={currentClass.termId}
      />
    </div>
  )
}

const AccommodationRender = ({ data }) => {
  if (data) {
    const result = Object.keys(data).reduce((res, key) => {
      const label = fieldsMapping.accommodations.find(
        (field) => field.fieldName === key
      )?.label
      if (key === 'preferredLanguage') {
        res.push({ label, value: data[key]?.toUpperCase() })
      } else if (key === 'extraTimeOnTest') {
        const value = data[key]
        let extraTime = 'UNLIMITED'
        if (value > 0) {
          extraTime = value === 1 ? 'Not Applicable' : `${value}x`
        }
        res.push({ label, value: extraTime })
      } else if (data[key] === 'yes') {
        res.push({ label, value: key.toUpperCase() })
      }
      return res
    }, [])
    const tooltip = `${result
      .map((e) => e.label)
      .slice(0, -1)
      .join(', ')} & ${result.map((e) => e.label).slice(-1)}`

    const value = result.map((e) => e.value).join()
    return (
      <Tooltip title={tooltip}>
        <span>{value}</span>
      </Tooltip>
    )
  }
  return '-'
}
StudentsList.propTypes = {
  loaded: PropTypes.bool.isRequired,
  students: PropTypes.array.isRequired,
  selectStudents: PropTypes.func.isRequired,
  selectedStudent: PropTypes.array.isRequired,
}

export default connect(
  (state) => ({
    cuId: getUserId(state),
    cuRole: getUserRole(state),
    loaded: get(state, 'manageClass.loaded'),
    students: get(state, 'manageClass.studentsList', []),
    selectedStudent: get(state, 'manageClass.selectedStudent', []),
    features: getUserFeatures(state),
    groupList: getGroupList(state),
    updating: state.manageClass.updating,
    isProxyUser: isProxyUserSelector(state),
    currentClass: getSelectedClass(state),
  }),
  {
    selectStudents: selectStudentAction,
  }
)(StudentsList)
