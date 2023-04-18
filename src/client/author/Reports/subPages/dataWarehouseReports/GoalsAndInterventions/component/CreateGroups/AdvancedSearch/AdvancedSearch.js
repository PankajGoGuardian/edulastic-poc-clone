import React, { useEffect, useState } from 'react'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import connect from 'react-redux/es/connect/connect'
import { TitleWrapper } from '@edulastic/common/src/components/MainHeader'

import {
  getAdvanceSearchStudentsData,
  getAdvancedSearchAttendanceBandSelector,
  getAdvancedSearchClassesSelector,
  getAdvancedSearchCoursesSelector,
  getAdvancedSearchFilterSelector,
  getAdvancedSearchSchoolsSelector,
  setAdvancedSearchAttendanceAction,
  setAdvancedSearchClassesAction,
  setAdvancedSearchCoursesAction,
  setAdvancedSearchDataRequest,
  setAdvancedSearchQueryAction,
  setAdvancedSearchSchoolsAction,
} from '../../../ducks'
// import ValueEditor from './ValueEditor'
import {
  AddRule,
  AddRuleGroup,
  CombinatorSelector,
  FieldSelector,
  OperatorSelector,
  RemoveRuleAction,
} from './controls'
import { allowedFields, combinators, inNotInOp } from './config/qb-config'
import ValueEditor from './ValueEditor'
import { CancelButton, OkButton } from '../../../../../../../../common/styled'
import { ButtonsContainer } from './styled-components'
import SampleStudents from './SampleStudents'
import SaveGroup from '../SaveGroup/SaveGroup'

// The fields would be Grade, Subject, School, Course, Class, Tag, Attendance Band - <band name>, Performance Band -<band name>, Standards Band -<Band name>, Avg score, Test types

const AdvancedSearch = ({
  loadSchools,
  loadClasses,
  loadCourses,
  schoolData,
  classData,
  courseData,
  attendanceBandData,
  defaultQuery,
  setAdvancedSearchQuery,
  loadAdvanceSearch,
  loadAttendanceBands,
  studentsData,
}) => {
  // may require duplicate method
  const [query, setQuery] = useState(defaultQuery)
  const formattedQuery = formatQuery(query, 'json_without_ids')

  const fields = allowedFields({
    schoolData,
    classData,
    courseData,
    attendanceBandData,
  })

  useEffect(() => {
    const searchString = ''
    loadSchools({ searchString })
    loadClasses({ searchString })
    loadCourses({ searchString })
    loadAttendanceBands()
  }, [])

  const handleCancel = () => {
    console.log('Do something on cancel')
  }

  const handleQuickFilter = () => {
    const searchQuery = JSON.parse(formattedQuery)
    setAdvancedSearchQuery(searchQuery)
    loadAdvanceSearch({ query: searchQuery })
  }

  const footer = (
    <ButtonsContainer>
      <div style={{ display: 'flex', gap: '20px' }}>
        <CancelButton
          isGhost
          onClick={handleCancel}
          style={{ minWidth: '100px' }}
          data-cy="advancedSearchCancelButton"
        >
          Cancel
        </CancelButton>
        <OkButton
          onClick={() => {
            handleQuickFilter()
            // segmentApi.genericEventTrack('findClassesInAdvSearch', {})
          }}
          style={{ minWidth: '100px' }}
          data-cy="findClassButton"
        >
          Find Students
        </OkButton>
      </div>
    </ButtonsContainer>
  )
  return (
    <>
      <SaveGroup courseData={courseData} />
      <TitleWrapper>Select target students</TitleWrapper>
      <QueryBuilder
        fields={fields}
        query={query}
        controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
        enableDragAndDropProp={false}
        operators={inNotInOp}
        resetOnFieldChange
        listsAsArrays
        onQueryChange={(q) => setQuery(q)}
        combinators={combinators}
        // Reusable(s)
        controlElements={{
          valueEditor: ValueEditor,
          fieldSelector: FieldSelector,
          combinatorSelector: CombinatorSelector,
          operatorSelector: OperatorSelector,
          addRuleAction: AddRule,
          addGroupAction: AddRuleGroup,
          removeRuleAction: RemoveRuleAction,
          removeGroupAction: RemoveRuleAction,
        }}
      />
      {footer}
      <SampleStudents studentsData={studentsData} />
    </>
  )
}

export default connect(
  (state) => ({
    defaultQuery: getAdvancedSearchFilterSelector(state),
    schoolData: getAdvancedSearchSchoolsSelector(state),
    classData: getAdvancedSearchClassesSelector(state),
    courseData: getAdvancedSearchCoursesSelector(state),
    attendanceBandData: getAdvancedSearchAttendanceBandSelector(state),
    studentsData: getAdvanceSearchStudentsData(state),
  }),
  {
    setAdvancedSearchQuery: setAdvancedSearchQueryAction,
    loadSchools: setAdvancedSearchSchoolsAction,
    loadCourses: setAdvancedSearchCoursesAction,
    loadClasses: setAdvancedSearchClassesAction,
    loadAttendanceBands: setAdvancedSearchAttendanceAction,
    loadAdvanceSearch: setAdvancedSearchDataRequest,
  }
)(AdvancedSearch)
