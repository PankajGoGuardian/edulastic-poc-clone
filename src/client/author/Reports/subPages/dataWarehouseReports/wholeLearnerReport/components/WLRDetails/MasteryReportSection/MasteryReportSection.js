import React, { useMemo, useState, useEffect } from 'react'
import { Spin, Tooltip } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { IconInfo } from '@edulastic/icons'
import { get } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { EduIf, FlexContainer } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'

import MasteryTable from './MasteryTable'
import { Spacer } from '../../../../../../../../common/styled'
import SectionLabel from '../../../../../../common/components/SectionLabel'
import LabelledControlDropdown from '../../../../common/components/LabelledControlDropdown'
import { StyledFilledButton } from '../../../../common/components/styledComponents'

import {
  getIsTutorMeEnabled,
  getUserFullNameSelector,
  getUserEmailSelector,
  getUserOrgId,
  getInterestedCurriculumsSelector,
  getUserRole,
} from '../../../../../../../src/selectors/user'
import {
  getIsTutorMeVisibleToDistrictSelector,
  actions as tutorMeActions,
} from '../../../../../../../TutorMe/ducks'
import { useGetStudentMasteryData } from '../../../../../studentProfileReport/common/hooks'
import useFilterRecords from './hooks/useFilterRecords'
import {
  getDomainOptionsByGradeSubject,
  getCurriculumsList,
} from '../../../../../studentProfileReport/common/utils/transformers'
import useRowSelection from './hooks/useRowSelection'
import {
  ALL_GRADES,
  ALL_SUBJECTS,
  DEFAULT_CURRICULUM,
  DEFAULT_DOMAIN,
  onAssignTutoring,
} from './utils'

const MasteryReportSection = ({
  userRole,
  interestedCurriculums,
  studentMasteryProfile,
  settings,
  isCsvDownloading,
  selectedScale,
  isTutorMeVisibleToDistrict,
  SPRFFilterData,
  setSelectedScale,
  loading,
  isTutorMeEnabled,
  districtId,
  userEmail,
  userFullName,
  assignTutorRequest,
  t,
}) => {
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_DOMAIN)
  const [selectedSubject, setSelectedSubject] = useState(ALL_SUBJECTS[0])
  const [selectedGrade, setSelectedGrade] = useState(ALL_GRADES[0])
  const [selectedCurriculum, setSelectedCurriculum] = useState(
    DEFAULT_CURRICULUM
  )
  const [selectedDomains, setSelectedDomains] = useState([])
  const [selectedStandards, setSelectedStandards] = useState([])

  const { scaleInfo: scales } = get(SPRFFilterData, 'data.result', {})
  const { metricInfo = [], skillInfo = [] } = get(
    studentMasteryProfile,
    'data.result',
    {}
  )
  const scaleInfo = selectedScale.scale

  const onSelectScale = (_, selected) => {
    setSelectedScale((scales || []).find((s) => s._id === selected.key))
  }

  const scaleOptions = useMemo(
    () => (scales || []).map((s) => ({ key: s._id, title: s.name })),
    [scales]
  )

  const selectedScaleOption = useMemo(
    () => scaleOptions.find((s) => s.key === selectedScale._id),
    [scaleOptions, selectedScale]
  )

  const isStudentOrParent = useMemo(
    () => [roleuser.STUDENT, roleuser.PARENT].includes(userRole),
    [userRole]
  )

  const curriculumsOptions = useMemo(() => {
    return getCurriculumsList(interestedCurriculums, false)
  }, [interestedCurriculums])

  const [studentStandards, studentDomains] = useGetStudentMasteryData(
    metricInfo,
    skillInfo,
    scaleInfo
  )

  const domainOptions = getDomainOptionsByGradeSubject(
    studentDomains,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key
  )

  const filteredDomains = useFilterRecords(
    studentDomains,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key,
    selectedDomains
  )

  const filteredStandards = useFilterRecords(
    studentStandards,
    selectedDomain.key,
    selectedGrade.key,
    selectedSubject.key,
    selectedCurriculum.key,
    selectedDomains
  )

  const { domainRowSelection, standardsRowSelection } = useRowSelection(
    filteredDomains,
    filteredStandards,
    selectedDomains,
    setSelectedDomains,
    selectedStandards,
    setSelectedStandards
  )

  useEffect(() => {
    setSelectedDomains([])
    setSelectedStandards([])
  }, [selectedCurriculum, selectedGrade, selectedSubject])

  useEffect(() => {
    if (curriculumsOptions?.length) {
      setSelectedCurriculum({
        key: curriculumsOptions[0].key,
        title: curriculumsOptions[0].title,
      })
    }
  }, [curriculumsOptions])

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
    <>
      <SectionLabel
        $margin="32px 0 59px 0"
        style={{ fontSize: '18px' }}
        wrapperStyle={{ alignItems: 'flex-end' }}
        sectionLabelFilters={
          <FlexContainer alignItems="center" style={{ gap: '20px' }}>
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
            <LabelledControlDropdown
              dataCy="standardsProficiency"
              label="Standard Proficiency"
              by={selectedScaleOption}
              selectCB={onSelectScale}
              data={scaleOptions}
              showPrefix={false}
              containerProps={{ flex: '1 1 300px' }}
            />
          </FlexContainer>
        }
        separator={<Spacer />}
      >
        Understand how the student is performing across domains and standards
        for Edulastic Tests &nbsp;
        <Tooltip title="Standard mastery data is currently supported for Edulastic Tests only.">
          <IconInfo />
        </Tooltip>
      </SectionLabel>
      <Spin spinning={loading}>
        <MasteryTable
          filteredDomains={filteredDomains}
          filteredStandards={filteredStandards}
          settings={settings}
          isCsvDownloading={isCsvDownloading}
          selectedScale={selectedScale}
          domainRowSelection={
            isTutorMeVisibleToDistrict ? domainRowSelection : null
          }
          standardsRowSelection={
            isTutorMeVisibleToDistrict ? standardsRowSelection : null
          }
          selectedCurriculum={selectedCurriculum}
          setSelectedCurriculum={setSelectedCurriculum}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
          curriculumsOptions={curriculumsOptions}
          isStudentOrParent={isStudentOrParent}
          domainOptions={domainOptions}
        />
      </Spin>
    </>
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

export default compose(
  withNamespaces('reports'),
  withConnect
)(MasteryReportSection)
