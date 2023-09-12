import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { get, find } from 'lodash'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'

import { MainContentWrapper, FlexContainer } from '@edulastic/common'
import { IconGoogleClassroom, IconClever } from '@edulastic/icons'
import classlinkIcon from '../../../../student/assets/classlink-icon.png'
import schoologyIcon from '../../../../student/assets/schoology.png'
import ClassSelector from './ClassSelector'
import selectsData from '../../../TestPage/components/common/selectsData'
import ClassCreatePage from './ClassCreatePage'
import {
  TableWrapper,
  ClassListTable,
  Tags,
  SubHeader,
  IconWrapper,
} from './styled'
import {
  fetchClassListAction,
  setCreateClassTypeDetailsAction,
  setFilterClassAction,
} from '../../ducks'
import GoogleBanner from './GoogleBanner'
import { getUserDetails } from '../../../../student/Login/ducks'
import Header from './Header'
import {
  getGoogleAllowedInstitionPoliciesSelector,
  getCanvasAllowedInstitutionPoliciesSelector,
  getCleverLibraryUserSelector,
  getManualEnrollmentAllowedSelector,
} from '../../../src/selectors/user'
import { setShowClassCreationModalAction } from '../../../Dashboard/ducks'

const { allGrades, allSubjects } = selectsData

const ClassList = ({
  groups,
  archiveGroups,
  setShowDetails,
  syncClassLoading,
  showBanner,
  institutions,
  history,
  location,
  user,
  fetchClassList,
  isUserGoogleLoggedIn,
  googleAllowedInstitutions,
  setShowCleverSyncModal,
  canvasAllowedInstitution,
  handleCanvasBulkSync,
  syncClassWithAtlas,
  syncCleverClassList,
  refreshPage,
  isCleverUser,
  isCleverDistrict,
  studentsList,
  setFilterClass,
  filterClass,
  setShowClassCreationModal,
  setCreateClassTypeDetails,
  manualEnrollmentAllowed,
}) => {
  const recentInstitute = institutions[institutions.length - 1]
  const findGrade = (_grade = []) =>
    allGrades
      .filter((item) => _grade.includes(item.value))
      .map((item) => ` ${item.text}`)
  // eslint-disable-next-line max-len
  const findSubject = (_subject) =>
    find(allSubjects, (item) => item.value === _subject) || { text: _subject }
  const findTags = (row) =>
    get(row, 'tags', [])
      .map((_o) => _o.tagName)
      .join(', ')

  const [classGroups, setClassGroups] = useState([])
  const [currentTab, setCurrentTab] = useState(
    location?.state?.currentTab || 'class'
  )

  const showClassGroups =
    filterClass === 'Active'
      ? groups
      : archiveGroups.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        })

  const getSyncedInfo = (classGroupObj) => {
    if (currentTab === 'class') {
      const classGroupObjWithSyncedInfo = classGroupObj.map((_group) => {
        const {
          cleverId,
          atlasId = '',
          atlasProviderName,
          googleCode,
          canvasCode,
        } = _group
        const syncIconList = []
        if (
          cleverId ||
          (atlasId &&
            (atlasProviderName || user?.openIdProvider)?.toLowerCase() ===
              'clever')
        ) {
          syncIconList.push(
            <Tooltip title="Clever" placement="bottom">
              <IconClever height={18} width={18} />
            </Tooltip>
          )
        }
        if (googleCode) {
          syncIconList.push(
            <Tooltip title="Google Classroom" placement="bottom">
              <IconGoogleClassroom height={18} width={18} />
            </Tooltip>
          )
        }
        if (
          canvasCode ||
          (atlasId &&
            (atlasProviderName || user?.openIdProvider)?.toLowerCase() ===
              'canvas')
        ) {
          syncIconList.push(
            <Tooltip title="Canvas" placement="bottom">
              <img
                src="https://cdn.edulastic.com/JS/webresources/images/as/canvas.png"
                alt="Canvas"
                height="18"
                width="18"
              />
            </Tooltip>
          )
        }
        if (
          atlasId &&
          (atlasProviderName || user?.openIdProvider)?.toLowerCase() ===
            'schoology'
        ) {
          syncIconList.push(
            <Tooltip title="Schoology" placement="bottom">
              <img src={schoologyIcon} alt="Schoology" width="18" height="18" />
            </Tooltip>
          )
        }
        if (
          atlasId &&
          (atlasProviderName || user?.openIdProvider)?.toLowerCase() ===
            'classlink'
        ) {
          syncIconList.push(
            <Tooltip title="Classlink" placement="bottom">
              <img src={classlinkIcon} alt="Classlink" height="18" width="18" />
            </Tooltip>
          )
        }
        return { ..._group, syncedWith: syncIconList }
      })
      return classGroupObjWithSyncedInfo
    }
    return classGroupObj
  }

  useEffect(() => {
    const classGroupsInfo = getSyncedInfo(showClassGroups)
    setClassGroups(classGroupsInfo)
  }, [showClassGroups])

  useEffect(() => {
    const classGroupsInfo = getSyncedInfo(showClassGroups)
    setClassGroups(classGroupsInfo)
  }, [currentTab])

  const columns = [
    {
      title: currentTab === 'class' ? 'Class Name' : 'Group Name',
      dataIndex: 'name',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_classname) => (
        <Tooltip title={_classname} placement="bottom">
          {_classname}
        </Tooltip>
      ),
      width: 350,
    },
    {
      title: 'Class Code',
      dataIndex: 'code',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.code.localeCompare(b.code),
      render: (classcode) => (
        <Tooltip title={classcode} placement="bottom">
          {classcode}
        </Tooltip>
      ),
      width: 180,
    },
    {
      title: 'Grades',
      dataIndex: 'grades',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prevGrades = findGrade(a.grades).join(' ')
        const nextGrades = findGrade(b.grades).join(' ')
        return prevGrades.localeCompare(nextGrades)
      },
      render: (_, row) => {
        const grades = findGrade(row.grades)
        return (
          <Tooltip title={` ${grades}`} placement="bottom">
            {` ${grades}`}
          </Tooltip>
        )
      },
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prevSubject = get(a, 'subject', '')
        const nextSubject = get(b, 'subject', '')
        return prevSubject.localeCompare(nextSubject)
      },
      render: (_, row) => {
        const subject = findSubject(row.subject)
        return (
          <Tooltip title={subject.text} placement="bottom">
            {subject.text}
          </Tooltip>
        )
      },
    },
    {
      title: 'Tag',
      dataIndex: 'tags',
      sortDirections: ['descend', 'ascend'],
      align: 'left',
      sorter: (a, b) => {
        const prevTags = findTags(a)
        const nextTags = findTags(b)
        return prevTags.localeCompare(nextTags)
      },
      render: (_, row) => {
        const tags = findTags(row)
        return (
          <Tooltip title={tags} placement="bottomLeft">
            <Tags>{tags || '--'}</Tags>
          </Tooltip>
        )
      },
    },
    {
      title: 'Synced with',
      dataIndex: 'syncedWith',
      render: (syncedIconList) => (
        <FlexContainer justify-content="space-between" align-items="center">
          <IconWrapper>
            {syncedIconList?.length ? (
              syncedIconList.map((icons) => icons)
            ) : (
              <p>-</p>
            )}
          </IconWrapper>
        </FlexContainer>
      ),
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => Number(a.studentCount) - Number(b.studentCount),
      render: (studentCount = 0) => (
        <Tooltip title={studentCount} placement="bottom">
          {studentCount}
        </Tooltip>
      ),
    },
  ]

  const rowKey = ({ _id }) => _id

  const onRow = (record) => ({
    onClick: () => {
      const { _id: classId } = record
      if (window.getSelection().toString() === '') {
        history.push(`/author/manageClass/${classId}`)
      }
    },
  })

  const onClickHandler = (value) => {
    setCurrentTab(value)
  }

  const isClassLink =
    studentsList && studentsList.filter((id) => id?.atlasId).length > 0

  return (
    <>
      <Header
        groups={groups}
        classGroups={classGroups}
        setShowDetails={setShowDetails}
        archiveGroups={archiveGroups}
        currentTab={currentTab}
        onClickHandler={onClickHandler}
        isUserGoogleLoggedIn={isUserGoogleLoggedIn}
        isCleverDistrict={isCleverDistrict}
        googleAllowedInstitutions={googleAllowedInstitutions}
        canvasAllowedInstitution={canvasAllowedInstitution}
        fetchGoogleClassList={fetchClassList}
        setShowCleverSyncModal={setShowCleverSyncModal}
        enableCleverSync={isCleverUser}
        syncClassWithAtlas={syncClassWithAtlas}
        syncCleverClassList={syncCleverClassList}
        refreshPage={refreshPage}
        user={user}
        handleCanvasBulkSync={handleCanvasBulkSync}
        isClassLink={isClassLink}
        filterClass={filterClass}
        setShowClassCreationModal={setShowClassCreationModal}
        setCreateClassTypeDetails={setCreateClassTypeDetails}
        manualEnrollmentAllowed={manualEnrollmentAllowed}
      />
      <MainContentWrapper>
        <SubHeader>
          <ClassSelector
            filterClass={filterClass}
            setFilterClass={setFilterClass}
            currentTab={currentTab}
          />
        </SubHeader>
        <TableWrapper>
          {currentTab === 'class' && (
            <>
              <GoogleBanner
                syncClassLoading={syncClassLoading}
                showBanner={showBanner}
                setShowDetails={setShowDetails}
              />
              {classGroups.length > 0 ? (
                <ClassListTable
                  columns={columns}
                  dataSource={classGroups.filter(
                    ({ type }) => type === 'class'
                  )}
                  rowKey={rowKey}
                  onRow={onRow}
                  pagination={classGroups.length > 10}
                />
              ) : (
                <ClassCreatePage
                  filterClass={filterClass}
                  recentInstitute={recentInstitute}
                  user={user}
                  fetchClassList={fetchClassList}
                  googleAllowedInstitutions={googleAllowedInstitutions}
                  isClassLink={isClassLink}
                  setShowClassCreationModal={setShowClassCreationModal}
                  setCreateClassTypeDetails={setCreateClassTypeDetails}
                  manualEnrollmentAllowed={manualEnrollmentAllowed}
                />
              )}
            </>
          )}

          {currentTab === 'group' && (
            <ClassListTable
              columns={columns.filter(({ dataIndex }) =>
                ['name', 'studentCount', 'assignmentCount'].includes(dataIndex)
              )}
              dataSource={classGroups.filter(({ type }) => type === 'custom')}
              rowKey={rowKey}
              onRow={onRow}
              pagination={classGroups.length > 10}
            />
          )}
        </TableWrapper>
      </MainContentWrapper>
    </>
  )
}

ClassList.propTypes = {
  groups: PropTypes.array.isRequired,
  archiveGroups: PropTypes.array.isRequired,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      institutions: get(state, 'user.user.orgData.schools'),
      isCleverDistrict: get(state, 'user.user.orgData.isCleverDistrict', false),
      user: getUserDetails(state),
      isUserGoogleLoggedIn: get(state, 'user.user.isUserGoogleLoggedIn'),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(
        state
      ),
      canvasAllowedInstitution: getCanvasAllowedInstitutionPoliciesSelector(
        state
      ),
      isCleverUser: getCleverLibraryUserSelector(state),
      studentsList: get(state, 'manageClass.studentsList', {}),
      filterClass: get(state, 'manageClass.filterClass', 'Active'),
      manualEnrollmentAllowed: getManualEnrollmentAllowedSelector(state),
    }),
    {
      fetchClassList: fetchClassListAction,
      setFilterClass: setFilterClassAction,
      setShowClassCreationModal: setShowClassCreationModalAction,
      setCreateClassTypeDetails: setCreateClassTypeDetailsAction,
    }
  )
)

export default enhance(ClassList)
