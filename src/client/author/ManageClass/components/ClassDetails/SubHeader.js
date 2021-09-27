import { Col, Tooltip } from 'antd'
import { get, compact } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import connect from 'react-redux/lib/connect/connect'
import withRouter from 'react-router-dom/withRouter'
import { compose } from 'redux'
import { setAssignmentFiltersAction } from '../../../src/actions/assignments'
import { getUserRole } from '../../../src/selectors/user'
import {
  ClassCode,
  CodeWrapper,
  ContainerHeader,
  CoTeacher,
  Studentscount,
  PopCoTeachers,
} from './styled'

const SubHeader = ({
  selectedClass,
  code,
  type,
  owners = [],
  studentsList,
  lastTeacher,
  userRole,
}) => {
  const primaryTeacherId =
    userRole === 'teacher'
      ? selectedClass?.primaryTeacherId || selectedClass?.parent?.id
      : selectedClass?._source?.primaryTeacherId ||
        selectedClass?._source?.parent?.id

  const studentCount = studentsList?.filter(
    (stu) => stu.enrollmentStatus === 1 && stu.status === 1
  )?.length
  const totalStudent = studentCount < 10 ? `0${studentCount}` : studentCount

  const primaryTeacher = owners
    ? compact(
        owners
          .filter((owner) => owner.id === primaryTeacherId)
          .map((owner) => owner.name || owner.email)
      )
    : []

  const formatPrimaryTeacher = primaryTeacher.map((teacher) => teacher)

  const coTeachers = owners
    ? compact(
        owners
          .filter((owner) => owner.id !== primaryTeacherId)
          .map((owner) => owner.name || owner.email)
      )
    : []

  const formatCoteacherNames = coTeachers.map((coteacher) => coteacher)

  const teacher = formatCoteacherNames.slice(0, 3).join(', ')
  const otherTeachers = formatCoteacherNames.slice(3, lastTeacher)
  const otherTeacherNames = otherTeachers.join(', ')

  return (
    <ContainerHeader>
      {type === 'class' && (
        <CodeWrapper type="flex" align="middle">
          <ClassCode lg={6} span={24}>
            Class Code <span>{code}</span>
          </ClassCode>
          <Studentscount lg={6} span={24}>
            TOTAL STUDENTS{' '}
            <span data-cy="totalStudents">{totalStudent || 0}</span>
          </Studentscount>
          {primaryTeacher && (
            <CoTeacher lg={12} span={24}>
              TEACHER <span data-cy="classTeacher">{formatPrimaryTeacher}</span>
            </CoTeacher>
          )}
          <Col lg={24} span={24}>
            {coTeachers && coTeachers.length ? (
              <CoTeacher>
                CO-TEACHER <span data-cy="coTeacher">{teacher}</span>
                {otherTeachers.length >= 1 ? (
                  <Tooltip title={otherTeacherNames} placement="right">
                    <PopCoTeachers>+ {otherTeachers.length}</PopCoTeachers>
                  </Tooltip>
                ) : null}
              </CoTeacher>
            ) : (
              ''
            )}
          </Col>
        </CodeWrapper>
      )}
    </ContainerHeader>
  )
}

SubHeader.propTypes = {
  code: PropTypes.string,
}

SubHeader.defaultProps = {
  code: '',
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      userRole: getUserRole(state),
      studentsList: get(state, 'manageClass.studentsList', []),
    }),
    {
      setAssignmentFilters: setAssignmentFiltersAction,
    }
  )
)

export default enhance(SubHeader)
