import React from 'react'
import { Row, Col } from 'antd'
import { roleuser } from '@edulastic/constants'
import { withNamespaces } from 'react-i18next'
import ClassAutoComplete from './autocompletes/ClassAutoComplete'
import CourseAutoComplete from './autocompletes/CourseAutoComplete'
import GroupsAutoComplete from './autocompletes/GroupsAutoComplete'
import SchoolAutoComplete from './autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from './autocompletes/TeacherAutoComplete'
import MultiSelectDropdown from './widgets/MultiSelectDropdown'
import { FilterLabel, SubText } from '../styled'
import { ControlDropDown } from './widgets/controlDropDown'

function FilterClassFields(props) {
  const {
    userRole,
    filters,
    updateFilterDropdownCB,
    // TODO dropDownData hardly changes. Better provide a default
    dropDownData,
    schoolYears,
    t,
  } = props
  return (
    <Row type="flex" gutter={[5, 10]}>
      <Col span={24}>
        <SubText>{t('common.studentFilterSubText')}</SubText>
      </Col>
      <Col span={6}>
        <FilterLabel data-cy="schoolYear">School Year</FilterLabel>
        <ControlDropDown
          by={filters.termId}
          selectCB={(e, selected) => updateFilterDropdownCB(selected, 'termId')}
          data={schoolYears}
          prefix="School Year"
          showPrefixOnSelected={false}
        />
      </Col>
      {roleuser.DA_SA_ROLE_ARRAY.includes(userRole) && (
        <>
          <Col span={6}>
            <SchoolAutoComplete
              dataCy="schools"
              selectedSchoolIds={
                filters.schoolIds ? filters.schoolIds.split(',') : []
              }
              selectCB={(e) => updateFilterDropdownCB(e, 'schoolIds', true)}
            />
          </Col>
          <Col span={6}>
            <TeacherAutoComplete
              dataCy="teachers"
              termId={filters.termId}
              school={filters.schoolIds}
              selectedTeacherIds={
                filters.teacherIds ? filters.teacherIds.split(',') : []
              }
              selectCB={(e) => updateFilterDropdownCB(e, 'teacherIds', true)}
            />
          </Col>
        </>
      )}
      <Col span={6}>
        <MultiSelectDropdown
          dataCy="classGrade"
          label="Class Grade"
          onChange={(e) => {
            const selected = dropDownData.grades.filter((a) =>
              e.includes(a.key)
            )
            updateFilterDropdownCB(selected, 'grades', true)
          }}
          value={
            filters.grades && filters.grades !== 'All'
              ? filters.grades.split(',')
              : []
          }
          options={dropDownData.grades}
        />
      </Col>
      <Col span={6}>
        <MultiSelectDropdown
          dataCy="classSubject"
          label="Class Subject"
          onChange={(e) => {
            const selected = dropDownData.subjects.filter((a) =>
              e.includes(a.key)
            )
            updateFilterDropdownCB(selected, 'subjects', true)
          }}
          value={
            filters.subjects && filters.subjects !== 'All'
              ? filters.subjects.split(',')
              : []
          }
          options={dropDownData.subjects}
        />
      </Col>
      <Col span={6}>
        <FilterLabel data-cy="course">Course</FilterLabel>
        <CourseAutoComplete
          selectedCourseId={filters.courseId}
          selectCB={(e) => updateFilterDropdownCB(e, 'courseId')}
        />
      </Col>
      <Col span={6}>
        <ClassAutoComplete
          dataCy="classes"
          termId={filters.termId}
          schoolIds={filters.schoolIds}
          teacherIds={filters.teacherIds}
          grades={filters.grades}
          subjects={filters.subjects}
          courseId={filters.courseId !== 'All' && filters.courseId}
          selectedClassIds={filters.classIds ? filters.classIds.split(',') : []}
          selectCB={(e) => updateFilterDropdownCB(e, 'classIds', true)}
        />
      </Col>
      <Col span={6}>
        <GroupsAutoComplete
          dataCy="groups"
          termId={filters.termId}
          schoolIds={filters.schoolIds}
          teacherIds={filters.teacherIds}
          grades={filters.grades}
          subjects={filters.subjects}
          courseId={filters.courseId !== 'All' && filters.courseId}
          selectedGroupIds={filters.groupIds ? filters.groupIds.split(',') : []}
          selectCB={(e) => updateFilterDropdownCB(e, 'groupIds', true)}
        />
      </Col>
    </Row>
  )
}
export default withNamespaces('reports')(FilterClassFields)
