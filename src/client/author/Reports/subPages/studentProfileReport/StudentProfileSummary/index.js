import React, { useEffect, useMemo, useState } from 'react'
import { backgrounds, labelGrey, secondaryTextColor } from '@edulastic/colors'
import { SpinLoader, FlexContainer } from '@edulastic/common'
import { Icon, Avatar, Tooltip } from 'antd'
import { get, isEmpty } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { withNamespaces } from '@edulastic/localization'
import BarTooltipRow from '../../../common/components/tooltip/BarTooltipRow'
import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { downloadCSV, getGrades, getSchools } from '../../../common/util'
import { getCsvDownloadingState } from '../../../ducks'
import AssessmentChart from '../common/components/charts/AssessmentChart'
import StudentPerformancePie from '../common/components/charts/StudentPerformancePie'
import { getReportsSPRFilterData } from '../common/filterDataDucks'
import { useGetStudentMasteryData } from '../common/hooks'
import {
  augementAssessmentChartData,
  getStudentName,
  getDomainOptionsByGradeSubject,
  getCurriculumsList,
} from '../common/utils/transformers'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import StandardMasteryDetailsTable from './common/components/table/StandardMasteryDetailsTable'
import {
  augmentDomainStandardMasteryData,
  filterData as filterStandards,
} from './common/utils/transformers'
import {
  getReportsStudentProfileSummary,
  getReportsStudentProfileSummaryLoader,
  getStudentProfileSummaryRequestAction,
  getReportsStudentProfileSummaryError,
  resetStudentProfileSummaryAction,
} from './ducks'
import { getInterestedCurriculumsSelector } from '../../../../src/selectors/user'
import staticDropDownData from '../../singleAssessmentReport/common/static/staticDropDownData.json'

const getTooltip = (payload) => {
  if (payload && payload.length) {
    const {
      masteryName = '',
      percentage = 0,
      count = 0,
      totalCount = 0,
    } = payload[0].payload
    return (
      <div>
        <BarTooltipRow title={`${masteryName} : `} value={`${percentage}%`} />
        <p>
          {count} out of {totalCount} standards are in {masteryName} State
        </p>
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

const StudentProfileSummary = ({
  loading,
  error,
  settings,
  isCsvDownloading,
  SPRFilterData,
  studentProfileSummary,
  getStudentProfileSummaryRequest,
  resetStudentProfileSummary,
  location,
  pageTitle,
  history,
  sharedReport,
  t,
  toggleFilter,
  interestedCurriculums = [],
}) => {
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

  const curriculumsOptions = useMemo(() => {
    return getCurriculumsList(interestedCurriculums)
  }, [interestedCurriculums])

  const [sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport?._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )

  const {
    studentClassData = [],
    bandInfo: bands = [],
    scaleInfo: scales = [],
  } = get(SPRFilterData, 'data.result', {})

  const bandInfo = (
    bands.find(
      (x) =>
        x._id ===
        (sharedReportFilters || settings.requestFilters)
          .performanceBandProfileId
    ) || bands[0]
  )?.performanceBand

  const scaleInfo = (
    scales.find(
      (x) =>
        x._id === (sharedReportFilters || settings.requestFilters).profileId
    ) || scales[0]
  )?.scale

  const studentClassInfo = studentClassData[0] || {}

  const studentProfileSummaryData = get(
    studentProfileSummary,
    'data.result',
    {}
  )
  const {
    asessmentMetricInfo = [],
    studInfo = [],
    skillInfo = [],
    metricInfo = [],
  } = studentProfileSummaryData

  const data = useMemo(
    () => augementAssessmentChartData(asessmentMetricInfo, bandInfo),
    [asessmentMetricInfo, bandInfo]
  )
  const [standards, domains] = useGetStudentMasteryData(
    metricInfo,
    skillInfo,
    scaleInfo,
    studentClassInfo,
    asessmentMetricInfo
  )
  const domainOptions = getDomainOptionsByGradeSubject(
    domains,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )
  const domainsWithMastery = augmentDomainStandardMasteryData(
    domains,
    scaleInfo,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )
  const filteredStandards = filterStandards(
    standards,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )

  const onDomainSelect = (_, selected) => setSelectedDomain(selected)
  const onSubjectSelect = (_, selected) => setSelectedSubject(selected)
  const onGradeSelect = (_, selected) => setSelectedGrade(selected)
  const onCurriculumSelect = (_, selected) => setSelectedCurriculum(selected)

  useEffect(() => () => resetStudentProfileSummary(), [])

  useEffect(() => {
    if (settings.selectedStudent.key && settings.requestFilters.termId) {
      getStudentProfileSummaryRequest({
        ...settings.requestFilters,
        studentId: settings.selectedStudent.key,
      })
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedStudent, settings.requestFilters])

  useEffect(() => {
    setSelectedDomain({ key: 'All', title: 'All' })
  }, [selectedGrade, selectedSubject])

  useEffect(() => {
    const metrics = get(studentProfileSummary, 'data.result.metricInfo', [])
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(studentProfileSummary) &&
      !metrics.length
    ) {
      toggleFilter(null, true)
    }
  }, [studentProfileSummary])

  useEffect(() => {
    if (curriculumsOptions?.length) {
      setSelectedCurriculum({
        key: curriculumsOptions[0].key,
        title: curriculumsOptions[0].title,
      })
    }
  }, [curriculumsOptions])

  const _onBarClickCB = (key, args) => {
    !isSharedReport &&
      history.push({
        pathname: `/author/classboard/${args.assignmentId}/${args.groupId}/test-activity/${args.testActivityId}`,
        state: {
          // this will be consumed in /src/client/author/Shared/Components/ClassBreadCrumb.js
          breadCrumb: [
            {
              title: 'INSIGHTS',
              to: '/author/reports',
            },
            {
              title: pageTitle,
              to: `${location.pathname}${location.search}`,
            },
          ],
        },
      })
  }
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

  if (
    isEmpty(studentProfileSummaryData) ||
    !studentProfileSummaryData ||
    isEmpty(asessmentMetricInfo) ||
    isEmpty(metricInfo) ||
    isEmpty(skillInfo) ||
    isEmpty(studInfo) ||
    !settings.selectedStudent?.key
  ) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  const studentInformation = studInfo[0] || {}
  const studentName = getStudentName(
    settings.selectedStudent,
    studentInformation
  )
  const anonymousString = t('common.anonymous')

  const onCsvConvert = (_data) =>
    downloadCSV(
      `Student Profile Report-${studentName || anonymousString}-${
        studentInformation.subject
      }.csv`,
      _data
    )

  const schoolName = getSchools(studentClassData)

  return (
    <>
      <FlexContainer marginBottom="20px" alignItems="stretch">
        <StudentDetailsCard width="280px" mr="20px">
          <IconContainer>
            <UserIconWrapper>
              {studentInformation.thumbnail ? (
                <StyledAatar size={150} src={studentInformation.thumbnail} />
              ) : (
                <StyledIcon type="user" />
              )}
            </UserIconWrapper>
          </IconContainer>
          <StudentDetailsContainer>
            <span>NAME</span>
            <p>{studentName || anonymousString}</p>
            <span>GRADE</span>
            <p>{getGrades(studentClassData)}</p>
            <span>SCHOOL</span>
            <Tooltip title={schoolName}>
              <p className="school-name">{schoolName}</p>
            </Tooltip>
          </StudentDetailsContainer>
        </StudentDetailsCard>
        <Card width="calc(100% - 300px)">
          <AssessmentChart
            data={data}
            studentInformation={studentClassInfo}
            xTickTooltipPosition={400}
            onBarClickCB={_onBarClickCB}
            isBarClickable={!isSharedReport}
            printWidth={700}
          />
        </Card>
      </FlexContainer>
      <div>
        <StyledH3>Standard Mastery Detail by Student</StyledH3>
        <FlexContainer alignItems="stretch">
          <Card width="280px" mr="20px">
            <StudentPerformancePie
              data={filteredStandards}
              scaleInfo={scaleInfo}
              getTooltip={getTooltip}
              title=""
            />
          </Card>
          <Card width="calc(100% - 300px)">
            <FilterRow justifyContent="space-between">
              <DropdownContainer>
                <ControlDropDown
                  by={selectedCurriculum}
                  selectCB={onCurriculumSelect}
                  data={curriculumsOptions}
                  prefix="Standard Set"
                  showPrefixOnSelected={false}
                />
                <ControlDropDown
                  by={selectedGrade}
                  selectCB={onGradeSelect}
                  data={allGrades}
                  prefix="Standard Grade"
                  showPrefixOnSelected={false}
                />
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
            </FilterRow>
            <StandardMasteryDetailsTable
              onCsvConvert={onCsvConvert}
              isCsvDownloading={isCsvDownloading}
              data={domainsWithMastery}
            />
          </Card>
        </FlexContainer>
      </div>
    </>
  )
}

const withConnect = connect(
  (state) => ({
    studentProfileSummary: getReportsStudentProfileSummary(state),
    loading: getReportsStudentProfileSummaryLoader(state),
    error: getReportsStudentProfileSummaryError(state),
    SPRFilterData: getReportsSPRFilterData(state),
    isCsvDownloading: getCsvDownloadingState(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
  }),
  {
    getStudentProfileSummaryRequest: getStudentProfileSummaryRequestAction,
    resetStudentProfileSummary: resetStudentProfileSummaryAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(StudentProfileSummary)

const StyledAatar = styled(Avatar)`
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`

const Card = styled(StyledCard)`
  width: ${({ width }) => width};
  margin-right: ${({ mr }) => mr};
`

const StyledIcon = styled(Icon)`
  font-size: 80px;
`

const IconContainer = styled.div`
  width: 100%;
  height: 90px;
  background: white;
  position: relative;
  border-radius: 10px 10px 0px 0px;
`

const UserIconWrapper = styled.div`
  width: 138px;
  height: 138px;
  background: white;
  border-radius: 50%;
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
`

const StudentDetailsCard = styled(Card)`
  background: ${backgrounds.default};
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`

const StudentDetailsContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  margin-top: 50px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  span {
    color: ${labelGrey};
    font-weight: bold;
  }
  p {
    color: ${secondaryTextColor};
    margin-bottom: 15px;
  }
  .school-name {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
const FilterRow = styled(FlexContainer)`
  @media print {
    display: none;
  }
`
const DropdownContainer = styled.div`
  display: flex;
  margin-bottom: 10px;

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
