import {
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
  SpinLoader,
  notification,
} from '@edulastic/common'
import { Divider, Spin } from 'antd'
import { flattenDeep, get, isArray, isEmpty } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import connect from 'react-redux/es/connect/connect'
import './queryBuilderStyles.scss'

import { lightRed2, lightGreen4, green } from '@edulastic/colors'
import { IconInfo } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import {
  getPerformanceBandProfilesSelector,
  isPerformanceBandLoadingSelector,
  receivePerformanceBandAction,
} from '../../../../../../../PerformanceBand/ducks'
import {
  addNewTagAction,
  getAllTagsAction,
  getAllTagsSelector,
} from '../../../../../../../TestPage/ducks'
import { fetchGroupsAction } from '../../../../../../../sharedDucks/groups'
import { SpinnerContainer } from '../../../../../../../src/MainStyle'
import {
  StyledButton,
  StyledFormButtonsContainer,
  StyledFormHeader,
  StyledFormTitle,
} from '../../../common/components/Form/styled-components'
import { parsedBandData } from '../../../common/utils'
import { actions } from '../../../ducks'
import {
  getAdvanceSearchStudentsData,
  getAdvancedSearchAttendanceBandSelector,
  getAdvancedSearchClassesSelector,
  getAdvancedSearchGroupsSelector,
  getAdvancedSearchCoursesSelector,
  getAdvancedSearchFilterSelector,
  getAdvancedSearchSchoolsSelector,
  groupStatusSelector,
  isAdvancedSearchLoading,
  isAttendanceBandLoadingSelector,
  isGroupSavingSelector,
  isLoadingOnGroupEdit,
} from '../../../ducks/selectors'
import {
  getUserOrgData,
  getUserRole,
} from '../../../../../../../src/selectors/user'
import SaveGroup from '../SaveGroup'
import StudentList from './StudentList'
import ValueEditor from './ValueEditor'
import {
  allowedFields,
  combinators,
  groupType,
  inNotInOp,
} from './config/qb-config'
import {
  AddRule,
  CombinatorSelector,
  FieldSelector,
  OperatorSelector,
  RemoveRuleAction,
} from './controls'
import { fieldKey } from '../../../ducks/constants'
import { getFormattedQueryData } from './utils'
import { InfoMessage } from '../../../../../../../../common/styled'

const { classes, groups } = fieldKey

const getAllRules = (rules = []) => {
  const allRulesByRecur = []
  rules.forEach((rule) => {
    if (rule.rules) {
      allRulesByRecur.push(getAllRules(rule.rules))
    } else {
      allRulesByRecur.push(rule)
    }
  })
  return flattenDeep(allRulesByRecur)
}

const getNotifyMessageCriteria = (role) => {
  switch (role) {
    case roleuser.DISTRICT_ADMIN:
      return 'district'
    case roleuser.SCHOOL_ADMIN:
      return 'school'
    case roleuser.TEACHER:
      return 'class'
    default:
      return ''
  }
}

// The fields would be Grade, Subject, School, Course, Class, Tag, Attendance Band - <band name>, Performance Band -<band name>, Standards Band -<Band name>, Avg score, Test types

const AdvancedSearch = ({
  loadSchools,
  loadClasses,
  loadGroups,
  loadCourses,
  schoolData,
  classData,
  groupData,
  courseData,
  attendanceBandData,
  defaultQuery,
  setAdvancedSearchQuery,
  loadAdvanceSearch,
  loadAttendanceBands,
  studentsData,
  saveGroup,
  isGroupSaving,
  isStudentLoading,
  onCancel,
  groupStatus,
  _resetGroupStatus,
  getAllTags,
  addNewTag,
  allTagsData,
  _getGroupList,
  loadPerformanceBands,
  performanceBandData,
  isPerformanceLoading,
  isAttendanceBandLoading,
  _resetAdvancedSearchData,
  resetAdvancedSearchDetails,
  userOrgData,
  group,
  setOnGroupEditIsLoading,
  _isLoadingOnGroupEdit,
  userRole,
}) => {
  // may require duplicate method
  const isFilterDataAvailable = !!group?.filters
  const [query, setQuery] = useState(group?.filters || defaultQuery)
  const [intialTagsData, setInitialTagsData] = useState([])
  const [loadStudentsData, setLoadStudentsData] = useState(
    isFilterDataAvailable
  )
  const [notifyMessageCriteria] = useState(getNotifyMessageCriteria(userRole))

  const formattedQuery = parsedBandData(formatQuery(query, 'json_without_ids'))
  const groupFormRef = useRef()

  const onClearFilter = () => {
    setQuery({ combinator: 'and', rules: [] })
    setAdvancedSearchQuery()
  }

  const onCancelClick = () => {
    groupFormRef?.current?.resetForm()
    onClearFilter()
    _resetGroupStatus()
    onCancel()
  }

  useEffect(() => {
    if (groupStatus === 'finished') {
      _getGroupList()
      onCancelClick()
    }
  }, [groupStatus])

  useEffect(() => {
    _resetAdvancedSearchData()
  }, [query])

  const fields = allowedFields({
    schoolData,
    classData,
    groupData,
    courseData,
    attendanceBandData,
    performanceBandData,
  })

  useEffect(() => {
    const searchString = ''
    loadSchools({ searchString })
    loadClasses({ searchString, type: groupType[classes] })
    loadGroups({ searchString, type: groupType[groups] })
    loadCourses({ searchString })
    if ((attendanceBandData || []).length === 0) loadAttendanceBands()
    if ((performanceBandData || []).length === 0) loadPerformanceBands()
    getAllTags({ type: 'group' })
  }, [])

  useEffect(() => {
    if (!isEmpty(group) && allTagsData?.length) {
      const { tags = [] } = group
      setInitialTagsData(tags)
    }
  }, [allTagsData])

  useEffect(() => {
    if (
      loadStudentsData &&
      attendanceBandData?.length &&
      performanceBandData?.length
    ) {
      setLoadStudentsData(false)
      const formattedQueryData = getFormattedQueryData({
        filterQuery: { ...query },
        attendanceBandData,
        performanceBandData,
      })
      setQuery(formattedQueryData)
      setOnGroupEditIsLoading(true)
      const searchQuery = JSON.parse(
        parsedBandData(formatQuery(formattedQueryData, 'json_without_ids'))
      )
      setAdvancedSearchQuery(searchQuery)
      loadAdvanceSearch({ query: searchQuery, paginationDetails: {} })
    }
  }, [attendanceBandData, performanceBandData])

  // cleanup
  useEffect(
    () => () => {
      setAdvancedSearchQuery()
      _resetAdvancedSearchData()
      resetAdvancedSearchDetails()
    },
    []
  )

  const handleQuickFilter = (paginationDetails = {}) => {
    const searchQuery = JSON.parse(formattedQuery)

    const noCriteriaAdded = isEmpty(get(searchQuery, ['rules'], []))

    if (noCriteriaAdded) {
      return notification({
        msg: 'Please select and apply at least one criterion',
      })
    }

    const allRulesArr = getAllRules(searchQuery?.rules)

    const isAllowed =
      allRulesArr.length &&
      allRulesArr.every((rule) => {
        if (rule.value) {
          if (isArray(rule.value)) return rule.value.length
          return true
        }
        return rule.operator === 'null' || rule.operator === 'notNull'
      })

    if (!isAllowed) {
      return notification({
        msg: 'Please provide atleast one value per filter',
      })
    }

    setAdvancedSearchQuery(searchQuery)

    loadAdvanceSearch({ query: searchQuery, paginationDetails })
  }

  const tagProps = {
    tags: intialTagsData,
    addNewTag,
    allTagsData,
  }

  const pendingFields = (fields || [])
    .filter(({ name }) => {
      return !query?.rules?.some((rule) => rule.field === name)
    })
    .map((item) => item.name)

  return (
    <>
      <EduIf condition={isGroupSaving}>
        <SpinnerContainer>
          <SpinLoader />
        </SpinnerContainer>
      </EduIf>
      <EduIf condition={!!group}>
        <div
          style={{
            display: 'flex',
            'justify-content': 'center',
          }}
        >
          <InfoMessage color={lightGreen4}>
            <IconInfo fill={green} height={10} />{' '}
            {`To modify individual students please visit Manage ${notifyMessageCriteria} section`}
          </InfoMessage>
        </div>
      </EduIf>
      <SaveGroup
        formattedQuery={formattedQuery}
        wrappedComponentRef={groupFormRef}
        courseData={courseData}
        studentsData={studentsData}
        saveGroup={saveGroup}
        isGroupSaving={isGroupSaving}
        onCancel={onCancelClick}
        tagProps={tagProps}
        userOrgData={userOrgData}
        group={group}
      />
      <Divider />
      <StyledFormHeader>
        <StyledFormTitle>
          Select students for the Group{' '}
          <span style={{ color: lightRed2, marginLeft: 3 }}>*</span>
        </StyledFormTitle>
      </StyledFormHeader>
      <FlexContainer justifyContent="flex-start">
        <FlexContainer width="90%" justifyContent="flex-end">
          <StyledFormButtonsContainer>
            <StyledButton isGhost onClick={onClearFilter}>
              Clear All
            </StyledButton>
            <StyledButton
              onClick={handleQuickFilter}
              disabled={isStudentLoading}
            >
              <EduIf condition={isStudentLoading}>
                <EduThen>Searching...</EduThen>
                <EduElse>Apply Criteria</EduElse>
              </EduIf>
            </StyledButton>
          </StyledFormButtonsContainer>
        </FlexContainer>
      </FlexContainer>
      <Spin spinning={isPerformanceLoading || isAttendanceBandLoading}>
        <QueryBuilder
          fields={fields}
          query={query}
          enableDragAndDropProp={false}
          getDefaultField={pendingFields?.[0] || fields?.[0].name}
          operators={inNotInOp}
          resetOnFieldChange
          listsAsArrays
          onQueryChange={(q) => setQuery(q)}
          combinators={combinators}
          showCombinatorsBetweenRules
          // Reusable(s)
          controlElements={{
            valueEditor: ValueEditor,
            fieldSelector: (props) => (
              <FieldSelector {...props} pendingFields={pendingFields} />
            ),
            combinatorSelector: CombinatorSelector,
            operatorSelector: OperatorSelector,
            addRuleAction: (props) => (
              <AddRule {...props} pendingFields={pendingFields} />
            ),
            addGroupAction: () => null,
            removeRuleAction: RemoveRuleAction,
            removeGroupAction: RemoveRuleAction,
          }}
        />
      </Spin>
      <Divider />
      <Spin
        spinning={
          (_isLoadingOnGroupEdit || isStudentLoading) && isEmpty(studentsData)
        }
      >
        <StudentList
          studentsData={studentsData}
          isStudentLoading={isStudentLoading}
          handleQuickFilter={handleQuickFilter}
        />
      </Spin>
    </>
  )
}

export default connect(
  (state) => ({
    defaultQuery: getAdvancedSearchFilterSelector(state),
    schoolData: getAdvancedSearchSchoolsSelector(state),
    classData: getAdvancedSearchClassesSelector(state),
    groupData: getAdvancedSearchGroupsSelector(state),
    courseData: getAdvancedSearchCoursesSelector(state),
    performanceBandData: getPerformanceBandProfilesSelector(state),
    attendanceBandData: getAdvancedSearchAttendanceBandSelector(state),
    studentsData: getAdvanceSearchStudentsData(state),
    isGroupSaving: isGroupSavingSelector(state),
    isStudentLoading: isAdvancedSearchLoading(state),
    groupStatus: groupStatusSelector(state),
    allTagsData: getAllTagsSelector(state, 'group'),
    isPerformanceLoading: isPerformanceBandLoadingSelector(state),
    isAttendanceBandLoading: isAttendanceBandLoadingSelector(state),
    userOrgData: getUserOrgData(state),
    _isLoadingOnGroupEdit: isLoadingOnGroupEdit(state),
    userRole: getUserRole(state),
  }),
  {
    setAdvancedSearchQuery: actions.setAdvancedSearchQuery,
    loadSchools: actions.getAdvancedSearchSchools,
    loadCourses: actions.getAdvancedSearchCourses,
    loadClasses: actions.getAdvancedSearchClasses,
    loadGroups: actions.getAdvancedSearchGroups,
    loadPerformanceBands: receivePerformanceBandAction,
    loadAttendanceBands: actions.getAdvancedSearchAttendanceBands,
    loadAdvanceSearch: actions.getAdvancedSearchData,
    saveGroup: actions.saveGroup,
    _resetGroupStatus: actions.resetGroupStatus,
    _resetAdvancedSearchData: actions.resetAdvancedSearchData,
    getAllTags: getAllTagsAction,
    addNewTag: addNewTagAction,
    _getGroupList: fetchGroupsAction,
    resetAdvancedSearchDetails: actions.resetAdvancedSearchDetails,
    setOnGroupEditIsLoading: actions.setOnGroupEditIsLoading,
  }
)(AdvancedSearch)
