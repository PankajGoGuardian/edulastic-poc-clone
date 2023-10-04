import { Col } from 'antd'
import { EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { roleuser } from '@edulastic/constants'
import ClassAutoComplete from '../../../../../common/components/autocompletes/ClassAutoComplete'
import CourseAutoComplete from '../../../../../common/components/autocompletes/CourseAutoComplete'
import GroupsAutoComplete from '../../../../../common/components/autocompletes/GroupsAutoComplete'
import SchoolAutoComplete from '../../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../../common/components/autocompletes/TeacherAutoComplete'
import MultiSelectDropdown from '../../../../../common/components/widgets/MultiSelectDropdown'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { FilterLabel } from '../../../../../common/styled'
import { staticDropDownData } from '../../utils'

function FilterClassFields({
  userRole,
  filters,
  updateFilterDropdownCB,
  schoolYears,
}) {
  return (
    <>
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
      <EduIf condition={roleuser.DA_SA_ROLE_ARRAY.includes(userRole)}>
        <EduThen>
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
        </EduThen>
      </EduIf>
      <Col span={6}>
        <MultiSelectDropdown
          dataCy="classGrade"
          label="Class Grade"
          onChange={(e) => {
            const selected = staticDropDownData.grades.filter((a) =>
              e.includes(a.key)
            )
            updateFilterDropdownCB(selected, 'grades', true)
          }}
          value={
            filters.grades && filters.grades !== 'All'
              ? filters.grades.split(',')
              : []
          }
          options={staticDropDownData.grades}
        />
      </Col>
      <Col span={6}>
        <MultiSelectDropdown
          dataCy="classSubject"
          label="Class Subject"
          onChange={(e) => {
            const selected = staticDropDownData.subjects.filter((a) =>
              e.includes(a.key)
            )
            updateFilterDropdownCB(selected, 'subjects', true)
          }}
          value={
            filters.subjects && filters.subjects !== 'All'
              ? filters.subjects.split(',')
              : []
          }
          options={staticDropDownData.subjects}
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
    </>
  )
}
export default FilterClassFields
