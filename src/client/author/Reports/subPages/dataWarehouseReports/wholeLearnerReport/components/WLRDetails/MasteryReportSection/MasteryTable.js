import React, { useState, useMemo, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { EduIf } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { IconCollapse2 } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import { get } from 'lodash'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import StudentPerformanceSummary from '../../../../../studentProfileReport/StudentMasteryProfile/common/components/table/StudentPerformanceSummary'
import {
  getCurriculumsList,
  getDomainOptionsByGradeSubject,
  getFullName,
} from '../../../../../studentProfileReport/common/utils/transformers'
import { useGetStudentMasteryData } from '../../../../../studentProfileReport/common/hooks'
import {
  getInterestedCurriculumsSelector,
  getUserRole,
} from '../../../../../../../src/selectors/user'
import staticDropDownData from '../../../../../singleAssessmentReport/common/static/staticDropDownData.json'
import { downloadCSV } from '../../../../../../common/util'
import useFilterRecords from './hooks/useFilterRecords'
import StandardsAssignmentModal from './StandardsAssignmentModal'
import {
  ReStyledCard,
  FilterRow,
  DropdownContainer,
  StyledButton,
} from './styled'

const allGrades = [
  { key: 'All', title: 'All Grades' },
  ...staticDropDownData.grades,
]
const allSubjects = [
  { key: 'All', title: 'All Subjects' },
  ...staticDropDownData.subjects,
]

const MasteryTable = ({
  interestedCurriculums,
  userRole,
  studentMasteryProfile,
  settings,
  isCsvDownloading,
  selectedScale,
}) => {
  const [expandRows, setExpandRows] = useState(false)
  const [selectedMastery, setSelectedMastery] = useState([])
  const [selectedDomain, setSelectedDomain] = useState({
    key: 'All',
    title: 'All',
  })
  const [selectedSubject, setSelectedSubject] = useState({
    key: 'All',
    title: 'All Subjects',
  })
  const [selectedGrade, setSelectedGrade] = useState({
    key: 'All',
    title: 'All Grades',
  })
  const [selectedCurriculum, setSelectedCurriculum] = useState({
    key: 'All',
    title: 'All Standard Sets',
  })
  const onDomainSelect = (_, selected) => setSelectedDomain(selected)
  const onSubjectSelect = (_, selected) => setSelectedSubject(selected)
  const onGradeSelect = (_, selected) => setSelectedGrade(selected)
  const onCurriculumSelect = (_, selected) => setSelectedCurriculum(selected)

  const [clickedStandard, setClickedStandard] = useState(undefined)

  const { metricInfo = [], skillInfo = [] } = get(
    studentMasteryProfile,
    'data.result',
    {}
  )
  const scaleInfo = selectedScale.scale

  const [studentStandards, studentDomains] = useGetStudentMasteryData(
    metricInfo,
    skillInfo,
    scaleInfo
  )

  const filteredStandards = useFilterRecords(
    studentStandards,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )
  const filteredDomains = useFilterRecords(
    studentDomains,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )
  const domainOptions = getDomainOptionsByGradeSubject(
    studentDomains,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )

  const curriculumsOptions = useMemo(() => {
    return getCurriculumsList(interestedCurriculums)
  }, [interestedCurriculums])

  useEffect(() => {
    if (curriculumsOptions?.length) {
      setSelectedCurriculum({
        key: curriculumsOptions[0].key,
        title: curriculumsOptions[0].title,
      })
    }
  }, [curriculumsOptions])
  const isStudentOrParent = useMemo(
    () => [roleuser.STUDENT, roleuser.PARENT].includes(userRole),
    [userRole]
  )
  useEffect(() => {
    setSelectedMastery([])
  }, [selectedDomain.key])

  const onCsvConvert = (data) =>
    downloadCSV(`Standard Performance Details-inside Whole Learner.csv`, data)

  const closeStudentAssignmentModal = () => {
    setClickedStandard(undefined)
  }
  const handleOnClickStandard = (params, standardName) => {
    setClickedStandard({ standardId: params.standardId, standardName })
  }

  const standardPopupFilters = useMemo(() => {
    return {
      termId: settings.requestFilters.termId,
      profileId: selectedScale._id,
      studentId: settings.selectedStudentInformation.studentId,
      standardId: clickedStandard?.standardId,
    }
  }, [
    settings.requestFilters.termId,
    settings.selectedStudentInformation.studentId,
    selectedScale._id,
    clickedStandard?.standardId,
  ])

  return (
    <ReStyledCard>
      <FilterRow justifyContent="space-between">
        <DropdownContainer>
          <ControlDropDown
            by={selectedCurriculum}
            selectCB={onCurriculumSelect}
            data={curriculumsOptions}
            prefix="Standard Set"
            showPrefixOnSelected={false}
          />
          <EduIf condition={!isStudentOrParent}>
            <ControlDropDown
              by={selectedGrade}
              selectCB={onGradeSelect}
              data={allGrades}
              prefix="Standard Grade"
              showPrefixOnSelected={false}
            />
          </EduIf>
          <ControlDropDown
            by={selectedSubject}
            selectCB={onSubjectSelect}
            data={allSubjects}
            prefix="Standard Subject"
            showPrefixOnSelected={false}
          />
          <ControlDropDown
            showPrefixOnSelected={false}
            by={selectedDomain}
            selectCB={onDomainSelect}
            data={domainOptions}
            prefix="Domain(s)"
          />
        </DropdownContainer>
        <StyledButton
          onClick={() => setExpandRows(!expandRows)}
          data-cy="expand-row"
        >
          <IconCollapse2 color={themeColor} width={12} height={12} />
          <span className="button-label">
            {expandRows ? 'COLLAPSE' : 'EXPAND'} ROWS
          </span>
        </StyledButton>
      </FilterRow>
      <StudentPerformanceSummary
        data={filteredDomains}
        selectedMastery={selectedMastery}
        expandedRowProps={{
          onCsvConvert,
          isCsvDownloading,
          data: filteredStandards,
          selectedMastery,
          handleOnClickStandard,
          filters: settings.requestFilters,
        }}
        expandAllRows={expandRows}
        setExpandAllRows={(flag) => setExpandRows(flag)}
      />
      <StandardsAssignmentModal
        visible={!!clickedStandard}
        standard={clickedStandard}
        scaleInfo={scaleInfo}
        onCancel={closeStudentAssignmentModal}
        studentName={getFullName(settings.selectedStudentInformation)}
        filters={standardPopupFilters}
      />
    </ReStyledCard>
  )
}

const withConnect = connect((state) => ({
  interestedCurriculums: getInterestedCurriculumsSelector(state),
  userRole: getUserRole(state),
}))

export default compose(withConnect)(MasteryTable)
