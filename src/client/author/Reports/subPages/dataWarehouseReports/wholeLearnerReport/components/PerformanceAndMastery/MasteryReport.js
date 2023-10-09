import React, { useState, useMemo, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FlexContainer, EduIf } from '@edulastic/common'
import styled from 'styled-components'
import { themeColor, themeColorBlue, white } from '@edulastic/colors'
import { Button } from 'antd'
import { IconCollapse2 } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import { filter, get } from 'lodash'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { StyledCard } from '../../../../../common/styled'
import StudentPerformanceSummary from '../../../../studentProfileReport/StudentMasteryProfile/common/components/table/StudentPerformanceSummary'
import {
  getCurriculumsList,
  getDomainOptionsByGradeSubject,
} from '../../../../studentProfileReport/common/utils/transformers'
import { useGetStudentMasteryData } from '../../../../studentProfileReport/common/hooks'
import {
  getInterestedCurriculumsSelector,
  getUserRole,
} from '../../../../../../src/selectors/user'
import staticDropDownData from '../../../../singleAssessmentReport/common/static/staticDropDownData.json'
import { downloadCSV } from '../../../../../common/util'

const usefilterRecords = (records, domain, grade, subject, curriculumId) =>
  // Note: record.domainId could be integer or string
  useMemo(
    () =>
      filter(
        records,
        (record) =>
          (domain === 'All' || String(record.domainId) === String(domain)) &&
          (grade === 'All' || record.grades.includes(grade)) &&
          (subject === 'All' || record.subject === subject) &&
          (curriculumId === 'All' || `${record.curriculumId}` === curriculumId)
      ),
    [records, domain, grade, subject, curriculumId]
  )
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
  SPRFFilterData,
  settings,
  isCsvDownloading,
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

  const { metricInfo = [], skillInfo = [] } = get(
    studentMasteryProfile,
    'data.result',
    {}
  )
  const { scaleInfo: scales = [] } = get(SPRFFilterData, 'data.result', {})
  const scaleInfo = (
    scales.find((x) => x._id === settings.requestFilters.profileId) || scales[0]
  )?.scale

  const [studentStandards, studentDomains] = useGetStudentMasteryData(
    metricInfo,
    skillInfo,
    scaleInfo
  )

  const filteredStandards = usefilterRecords(
    studentStandards,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )
  const filteredDomains = usefilterRecords(
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
    downloadCSV(
      `Standard Performance Details-inside Whole Learner
      }.csv`,
      data
    )

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
          // handleOnClickStandard,
          filters: settings.requestFilters,
        }}
        expandAllRows={expandRows}
        setExpandAllRows={(flag) => setExpandRows(flag)}
      />
    </ReStyledCard>
  )
}

const withConnect = connect((state) => ({
  interestedCurriculums: getInterestedCurriculumsSelector(state),
  userRole: getUserRole(state),
}))

export default compose(withConnect)(MasteryTable)

const ReStyledCard = styled(StyledCard)`
  margin: 0px;
  padding: 20px;
  border: 1px solid #dadae4;
  max-width: ${({ maxW }) => maxW};
  flex: ${({ flex }) => flex};
  margin-left: ${({ ml }) => ml};
`

const FilterRow = styled(FlexContainer)`
  @media print {
    display: none;
  }
`

const DropdownContainer = styled.div`
  display: flex;

  .control-dropdown {
    .ant-btn {
      width: 100%;
    }
  }
  .control-dropdown {
    margin-left: 10px;
  }
  .control-dropown:first-child {
    margin-left: 0px;
  }
`

const StyledButton = styled(Button)`
  float: right;
  margin: 5px;
  padding-left: 8px;
  padding-right: 0px;
  text-align: center;
  font: 11px/15px Open Sans;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${themeColor};
  border-color: ${themeColor};
  &:hover {
    background: ${themeColorBlue};
    color: ${white};
    border-color: ${themeColorBlue};
    svg > * {
      fill: ${white};
    }
  }
  &:focus {
    color: ${themeColor};
  }
  .button-label {
    padding: 0px 20px;
  }
`
