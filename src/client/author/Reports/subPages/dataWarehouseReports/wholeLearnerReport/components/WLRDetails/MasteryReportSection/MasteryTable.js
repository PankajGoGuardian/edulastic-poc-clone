import React, { useState, useMemo, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { Tooltip } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { EduIf, FlexContainer } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { IconCollapse2 } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import { segmentApi } from '@edulastic/api'

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
  getIsTutorMeEnabled,
  getUserFullNameSelector,
  getUserEmailSelector,
  getUserOrgId,
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
import useRowSelection from './hooks/useRowSelection'
import { StyledFilledButton } from '../../../../common/components/styledComponents'
import {
  getIsTutorMeVisibleToDistrictSelector,
  actions as tutorMeActions,
} from '../../../../../../../TutorMe/ducks'
import {
  invokeTutorMeSDKtoAssignTutor,
  openTutorMeBusinessPage,
} from '../../../../../../../TutorMe/helper'
import { getStudentName } from '../../../utils'

const allGrades = [
  { key: 'All', title: 'All Grades' },
  ...staticDropDownData.grades,
]
const allSubjects = [
  { key: 'All', title: 'All Subjects' },
  ...staticDropDownData.subjects,
]

const onAssignTutoring = async ({
  isTutorMeEnabled,
  settings,
  districtId,
  userEmail,
  userFullName,
  filteredStandards,
  selectedStandards,
  assignTutorRequest,
}) => {
  const {
    requestFilters: { termId },
    selectedStudent,
    selectedStudentInformation,
  } = settings
  const studentName = getStudentName(
    selectedStudentInformation,
    selectedStudent
  )

  // TODO: pass to the respective api or sdk
  // curate standards with mastery for checked standards
  const standardsMasteryData = filteredStandards
    .filter(({ standardId }) => selectedStandards.includes(standardId))
    .map(
      ({
        standardId,
        standard: standardIdentifier,
        standardName: standardDesc,
        domainId,
        domain: domainIdentifier,
        domainName: domainDesc,
        score: masteryScore,
        scale: { color: masteryColor },
      }) => ({
        domainId,
        standardId,
        masteryScore,
        masteryColor,
        standardIdentifier,
        standardDesc,
        domainIdentifier,
        domainDesc,
      })
    )

  // navigate to TutorMe page if not enabled for the user
  if (!isTutorMeEnabled) {
    return openTutorMeBusinessPage()
  }

  // segment api to track Assign Tutoring event
  segmentApi.genericEventTrack('Assign Tutor', {
    selectedStudentsKeys: [selectedStudent.key],
  })

  invokeTutorMeSDKtoAssignTutor({
    districtId,
    termId,
    standardsMasteryData,
    selectedStudentDetails: {
      firstName: selectedStudentInformation.firstName,
      lastName: selectedStudentInformation.lastName,
      studentId: selectedStudent.key,
      studentName,
      email: selectedStudentInformation.email,
    },
    assignedBy: {
      assignedByEmail: userEmail,
      assignedByName: userFullName,
    },
  }).then((tutorMeInterventionResponse) =>
    assignTutorRequest(tutorMeInterventionResponse)
  )
}

const MasteryTable = ({
  interestedCurriculums,
  userRole,
  studentMasteryProfile,
  settings,
  isCsvDownloading,
  selectedScale,
  isTutorMeEnabled,
  isTutorMeVisibleToDistrict,
  districtId,
  userEmail,
  userFullName,
  assignTutorRequest,
  t,
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
  const [clickedStandard, setClickedStandard] = useState(undefined)
  const [selectedStandards, setSelectedStandards] = useState([])
  const [selectedDomains, setSelectedDomains] = useState([])

  const onDomainSelect = (_, selected) => setSelectedDomain(selected)
  const onSubjectSelect = (_, selected) => setSelectedSubject(selected)
  const onGradeSelect = (_, selected) => setSelectedGrade(selected)
  const onCurriculumSelect = (_, selected) => setSelectedCurriculum(selected)

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
    selectedCurriculum.key,
    selectedDomains
  )
  const filteredDomains = useFilterRecords(
    studentDomains,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key,
    selectedDomains
  )
  const domainOptions = getDomainOptionsByGradeSubject(
    studentDomains,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )

  const isStudentOrParent = useMemo(
    () => [roleuser.STUDENT, roleuser.PARENT].includes(userRole),
    [userRole]
  )

  const curriculumsOptions = useMemo(() => {
    return getCurriculumsList(interestedCurriculums, false)
  }, [interestedCurriculums])

  useEffect(() => {
    if (curriculumsOptions?.length) {
      setSelectedCurriculum({
        key: curriculumsOptions[0].key,
        title: curriculumsOptions[0].title,
      })
    }
  }, [curriculumsOptions])

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

  useEffect(() => {
    setSelectedDomains([])
    setSelectedStandards([])
  }, [selectedCurriculum, selectedGrade, selectedSubject])

  const {
    domainRowSelection: _domainRowSelection,
    standardsRowSelection: _standardsRowSelection,
  } = useRowSelection(
    filteredDomains,
    filteredStandards,
    selectedDomains,
    setSelectedDomains,
    selectedStandards,
    setSelectedStandards
  )

  const domainRowSelection = isTutorMeVisibleToDistrict
    ? _domainRowSelection
    : null
  const standardsRowSelection = isTutorMeVisibleToDistrict
    ? _standardsRowSelection
    : null
  const assignTutorBtnTooltipText =
    selectedStandards.length === 0
      ? t('wholeLearnerReport.chooseStdOrDomain')
      : selectedStandards.length > 5
      ? t('wholeLearnerReport.selectMax5Stds')
      : null
  const disableTutorMeBtn =
    isTutorMeEnabled &&
    (!selectedStandards.length || selectedStandards.length > 5)
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
        <FlexContainer alignItems="center">
          <EduIf condition={isTutorMeVisibleToDistrict}>
            <Tooltip title={assignTutorBtnTooltipText}>
              <StyledFilledButton
                height="32px"
                disabled={disableTutorMeBtn}
                onClick={() =>
                  onAssignTutoring({
                    isTutorMeEnabled,
                    settings,
                    districtId,
                    userEmail,
                    userFullName,
                    filteredStandards,
                    selectedStandards,
                    assignTutorRequest,
                  })
                }
              >
                Assign Tutoring
              </StyledFilledButton>
            </Tooltip>
          </EduIf>

          <StyledButton
            onClick={() => setExpandRows(!expandRows)}
            data-cy="expand-row"
          >
            <IconCollapse2 color={themeColor} width={12} height={12} />
            <span className="button-label">
              {expandRows ? 'COLLAPSE' : 'EXPAND'} ROWS
            </span>
          </StyledButton>
        </FlexContainer>
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
          rowSelection: standardsRowSelection,
        }}
        expandAllRows={expandRows}
        setExpandAllRows={(flag) => setExpandRows(flag)}
        rowSelection={domainRowSelection}
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

const withConnect = connect(
  (state) => ({
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    districtId: getUserOrgId(state),
    userRole: getUserRole(state),
    userEmail: getUserEmailSelector(state),
    userFullName: getUserFullNameSelector(state),
    isTutorMeEnabled: getIsTutorMeEnabled(state),
    isTutorMeVisibleToDistrict: getIsTutorMeVisibleToDistrictSelector(state),
  }),
  {
    ...tutorMeActions,
  }
)

export default compose(withNamespaces('reports'), withConnect)(MasteryTable)
