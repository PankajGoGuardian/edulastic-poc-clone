import {
  secondaryTextColor,
  themeColor,
  themeColorLighter,
  themeColorBlue,
  white,
} from '@edulastic/colors'
import { SpinLoader, FlexContainer, EduIf } from '@edulastic/common'
import { IconCollapse2 } from '@edulastic/icons'
import { Avatar, Button } from 'antd'
import { filter, get, isEmpty } from 'lodash'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { roleuser } from '@edulastic/constants'
import StudentAssignmentModal from '../../../common/components/Popups/studentAssignmentModal'
import BarTooltipRow from '../../../common/components/tooltip/BarTooltipRow'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import { StyledCard, NoDataContainer } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import {
  downloadCSV,
  getStudentAssignments,
  toggleItem,
  getGrades,
} from '../../../common/util'
import { getCsvDownloadingState } from '../../../ducks'
import StudentPerformancePie from '../common/components/charts/StudentPerformancePie'
import { getReportsSPRFilterData } from '../common/filterDataDucks'
import { useGetStudentMasteryData } from '../common/hooks'
import {
  getStudentName,
  getDomainOptionsByGradeSubject,
  getCurriculumsList,
} from '../common/utils/transformers'
import StudentPerformanceSummary from './common/components/table/StudentPerformanceSummary'
import {
  getReportsStudentMasteryProfile,
  getReportsStudentMasteryProfileLoader,
  getStudentMasteryProfileRequestAction,
  getStudentStandardData,
  getStudentStandardLoader,
  getStudentStandardsAction,
  getReportsStudentMasteryProfileError,
  resetStudentMasteryProfileAction,
} from './ducks'

import staticDropDownData from '../../singleAssessmentReport/common/static/staticDropDownData.json'
import {
  getUserRole,
  getInterestedCurriculumsSelector,
} from '../../../../src/selectors/user'

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
const getTooltip = (payload) => {
  if (payload && payload.length) {
    const { masteryName = '', percentage = 0 } = payload[0].payload
    return (
      <div>
        <BarTooltipRow title={`${masteryName} : `} value={`${percentage}%`} />
      </div>
    )
  }
  return false
}

const allGrades = [
  { key: 'All', title: 'All Grades' },
  ...staticDropDownData.grades,
]
const allSubjects = [
  { key: 'All', title: 'All Subjects' },
  ...staticDropDownData.subjects,
]

const StudentMasteryProfile = ({
  settings,
  loading,
  error,
  SPRFilterData,
  isCsvDownloading,
  studentMasteryProfile,
  getStudentMasteryProfileRequest,
  resetStudentMasteryProfile,
  getStudentStandards,
  studentStandardData,
  loadingStudentStandard,
  sharedReport,
  t,
  toggleFilter,
  userRole,
  interestedCurriculums,
}) => {
  const sharedReportFilters = useMemo(
    () =>
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
    [sharedReport]
  )

  const isStudentOrParent = useMemo(
    () => [roleuser.STUDENT, roleuser.PARENT].includes(userRole),
    [userRole]
  )

  const { scaleInfo: scales = [], studentClassData = [] } = get(
    SPRFilterData,
    'data.result',
    {}
  )

  const scaleInfo = (
    scales.find(
      (x) =>
        x._id === (sharedReportFilters || settings.requestFilters).profileId
    ) || scales[0]
  )?.scale

  const { metricInfo = [], studInfo = [], skillInfo = [] } = get(
    studentMasteryProfile,
    'data.result',
    {}
  )

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
    title: 'All Subjects',
  })
  const [selectedCurriculum, setSelectedCurriculum] = useState({
    key: 'All',
    title: 'All Standard Sets',
  })
  const [selectedMastery, setSelectedMastery] = useState([])
  const [expandRows, setExpandRows] = useState(false)

  const studentAssignmentsData = useMemo(
    () => getStudentAssignments(scaleInfo, studentStandardData),
    [scaleInfo, studentStandardData]
  )

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
    selectedSubject.key
  )

  const [showStudentAssignmentModal, setStudentAssignmentModal] = useState(
    false
  )
  const [clickedStandard, setClickedStandard] = useState(undefined)

  const curriculumsOptions = useMemo(() => {
    return getCurriculumsList(interestedCurriculums)
  }, [interestedCurriculums])

  useEffect(() => () => resetStudentMasteryProfile(), [])

  useEffect(() => {
    if (settings.selectedStudent.key && settings.requestFilters.termId) {
      getStudentMasteryProfileRequest({
        ...settings.requestFilters,
        studentId: settings.selectedStudent.key,
      })
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedStudent, settings.requestFilters])

  useEffect(() => {
    setSelectedMastery([])
  }, [selectedDomain.key])

  useEffect(() => {
    setSelectedDomain({ key: 'All', title: 'All' })
  }, [selectedGrade, selectedSubject])

  useEffect(() => {
    const metrics = get(studentMasteryProfile, 'data.result.metricInfo', [])
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(studentMasteryProfile) &&
      !metrics.length
    ) {
      toggleFilter(null, true)
    }
  }, [studentMasteryProfile])

  useEffect(() => {
    if (curriculumsOptions?.length) {
      setSelectedCurriculum({
        key: curriculumsOptions[0].key,
        title: curriculumsOptions[0].title,
      })
    }
  }, [curriculumsOptions])

  const onDomainSelect = (_, selected) => setSelectedDomain(selected)
  const onSubjectSelect = (_, selected) => setSelectedSubject(selected)
  const onGradeSelect = (_, selected) => setSelectedGrade(selected)
  const onCurriculumSelect = (_, selected) => setSelectedCurriculum(selected)
  const onSectionClick = (item) =>
    setSelectedMastery(toggleItem(selectedMastery, item.masteryLabel))

  if (loading) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  const studentInformation = studInfo[0] || {}
  const studentName = getStudentName(
    settings.selectedStudent,
    studentInformation
  )

  const anonymousString = t('common.anonymous')

  const onCsvConvert = (data) =>
    downloadCSV(
      `Standard Performance Details-${studentName || anonymousString}-${
        studentInformation.subject
      }.csv`,
      data
    )

  const handleOnClickStandard = (params, standard) => {
    getStudentStandards(params)
    setClickedStandard(standard)
    setStudentAssignmentModal(true)
  }

  const closeStudentAssignmentModal = () => {
    setStudentAssignmentModal(false)
    setClickedStandard(undefined)
  }

  if (isEmpty(metricInfo) || !settings.selectedStudent?.key) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <>
      <FlexContainer alignItems="stretch" marginBottom="20px">
        <ReStyledCard flex={1}>
          <FlexContainer justifyContent="flex-start">
            <FlexContainer justifyContent="center" mt="20px" width="180px">
              {studentInformation.thumbnail ? (
                <StyledAatar size={150} src={studentInformation.thumbnail} />
              ) : (
                <StyledAatar size={150} icon="user" />
              )}
            </FlexContainer>
            <FlexContainer
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <StyledP marginTop="30px">
                <StyledName>{studentName || anonymousString}</StyledName>
              </StyledP>
              <StyledP marginTop="12px">
                <StyledText weight="Bold"> Grade: </StyledText>
                <StyledText>{getGrades(studentClassData)}</StyledText>
              </StyledP>
            </FlexContainer>
          </FlexContainer>
        </ReStyledCard>
        <ReStyledCard maxW="50%" ml="20px">
          <StudentPerformancePie
            selectedMastery={selectedMastery}
            data={filteredStandards}
            scaleInfo={scaleInfo}
            onSectionClick={onSectionClick}
            getTooltip={getTooltip}
            showAsRow
          />
        </ReStyledCard>
      </FlexContainer>

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
            filters: sharedReportFilters || settings.requestFilters,
          }}
          expandAllRows={expandRows}
          setExpandAllRows={(flag) => setExpandRows(flag)}
        />
      </ReStyledCard>

      {showStudentAssignmentModal && (
        <StudentAssignmentModal
          showModal={showStudentAssignmentModal}
          closeModal={closeStudentAssignmentModal}
          studentAssignmentsData={studentAssignmentsData}
          studentName={studentName || anonymousString}
          standardName={clickedStandard}
          loadingStudentStandard={loadingStudentStandard}
        />
      )}
    </>
  )
}

const withConnect = connect(
  (state) => ({
    studentMasteryProfile: getReportsStudentMasteryProfile(state),
    SPRFilterData: getReportsSPRFilterData(state),
    loading: getReportsStudentMasteryProfileLoader(state),
    error: getReportsStudentMasteryProfileError(state),
    isCsvDownloading: getCsvDownloadingState(state),
    studentStandardData: getStudentStandardData(state),
    loadingStudentStandard: getStudentStandardLoader(state),
    userRole: getUserRole(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
  }),
  {
    getStudentMasteryProfileRequest: getStudentMasteryProfileRequestAction,
    getStudentStandards: getStudentStandardsAction,
    resetStudentMasteryProfile: resetStudentMasteryProfileAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(StudentMasteryProfile)

const StyledAatar = styled(Avatar)`
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`

const FilterRow = styled(FlexContainer)`
  @media print {
    display: none;
  }
`

const ReStyledCard = styled(StyledCard)`
  margin: 0px;
  padding: 20px;
  border: 1px solid #dadae4;
  max-width: ${({ maxW }) => maxW};
  flex: ${({ flex }) => flex};
  margin-left: ${({ ml }) => ml};
`

const StyledP = styled.p`
  margin-top: ${(props) => props.marginTop || '10px'};
  margin-left: 20px;
  margin-right: 20px;
`

const StyledText = styled.span`
  text-align: left;
  letter-spacing: 0.24px;
  font: 13px/18px Open Sans;
  font-weight: ${(props) => props.weight || 600};
  color: ${secondaryTextColor};
`

const StyledName = styled.span`
  padding-top: 20px;
  color: ${themeColorLighter};
  text-align: left;
  letter-spacing: 0.33px;
  font: Bold 18px/24px Open Sans;
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
