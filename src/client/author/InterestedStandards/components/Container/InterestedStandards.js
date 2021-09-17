import { CheckboxLabel, EduButton } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { Icon } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  ContentWrapper,
  SettingsWrapper,
  StyledCol,
  StyledContent,
  StyledLayout,
  StyledRow,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import {
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'
import { getDictCurriculumsAction } from '../../../src/actions/dictionaries'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import SaSchoolSelect from '../../../src/components/common/SaSchoolSelect'
import { getCurriculumsListSelector } from '../../../src/selectors/dictionaries'
import { getUserOrgId, getUserRole } from '../../../src/selectors/user'
// actions
import {
  deleteStandardAction,
  receiveInterestedStandardsAction,
  saveInterestedStandardsAction,
  updateInterestedStandardsAction,
  updateStandardsPreferencesAction,
} from '../../ducks'
import StandardSetModal from '../StandardSetsModal/StandardSetsModal'
import {
  StyledSubjectCloseButton,
  StyledSubjectContent,
  StyledSubjectLine,
  StyledSubjectTitle,
} from './styled'

const title = 'Manage District'
const menuActive = { mainMenu: 'Settings', subMenu: 'Interested Standards' }

class InterestedStandards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      standardSetsModalVisible: false,
    }
  }

  componentDidMount() {
    const {
      loadInterestedStandards,
      userOrgId,
      getCurriculums,
      role,
      schoolId,
    } = this.props
    const isSchoolLevel = role === roleuser.SCHOOL_ADMIN
    const orgId = isSchoolLevel ? schoolId : userOrgId
    const orgType = isSchoolLevel ? 'institution' : 'district'
    loadInterestedStandards({
      orgId,
      orgType,
    })
    getCurriculums()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.loading || prevState.saving || prevState.updating) return null
    return {
      dataSource: nextProps.courseList,
    }
  }

  updateInterestedStandards = (data) => {
    const { updateInterestedStandards } = this.props
    updateInterestedStandards({
      body: data,
    })
  }

  saveInterestedStandards = () => {
    const {
      updateInterestedStandards,
      interestedStaData,
      userOrgId,
      schoolId,
      role,
    } = this.props
    const {
      showAllStandards = false,
      includeOtherStandards = false,
    } = interestedStaData

    const isSchoolLevel = role === roleuser.SCHOOL_ADMIN
    const orgId = isSchoolLevel ? schoolId : userOrgId
    const orgType = isSchoolLevel ? 'institution' : 'district'
    const saveData = {
      orgId,
      orgType,
      showAllStandards,
      includeOtherStandards,
      curriculums: [],
    }
    if (interestedStaData.curriculums) {
      for (let i = 0; i < interestedStaData.curriculums.length; i++) {
        saveData.curriculums.push({
          _id: interestedStaData.curriculums[i]._id,
          name: interestedStaData.curriculums[i].name,
          subject: interestedStaData.curriculums[i].subject,
        })
      }
    }

    updateInterestedStandards(saveData)
  }

  showMyStandardSetsModal = () => {
    this.setState({ standardSetsModalVisible: true })
  }

  hideMyStandardSetsModal = () => {
    this.setState({ standardSetsModalVisible: false })
  }

  updateMyStandardSets = (updatedStandards) => {
    const {
      userOrgId,
      curriculums,
      updateInterestedStandards,
      role,
      schoolId,
    } = this.props
    const curriculumsData = []
    for (let i = 0; i < updatedStandards.length; i++) {
      const selStandards = curriculums.filter(
        (item) => item.curriculum === updatedStandards[i]
      )
      curriculumsData.push({
        _id: selStandards[0]._id,
        name: selStandards[0].curriculum,
        subject: selStandards[0].subject,
      })
    }
    const isSchoolLevel = role === roleuser.SCHOOL_ADMIN
    const orgId = isSchoolLevel ? schoolId : userOrgId
    const orgType = isSchoolLevel ? 'institution' : 'district'
    const standardsData = {
      orgId,
      orgType,
      curriculums: curriculumsData,
    }
    updateInterestedStandards(standardsData)
    this.hideMyStandardSetsModal()
  }

  closeCurriculum = (id, disableClose) => {
    const { deleteStandard } = this.props
    if (!disableClose) deleteStandard(id)
  }

  updatePreferences = (e) => {
    const { updateStandardsPreferences } = this.props
    const { checked, name } = e.target
    updateStandardsPreferences({ name, value: checked })
  }

  handleSchoolSelect = (schoolId) => {
    const { loadInterestedStandards } = this.props
    loadInterestedStandards({
      orgId: schoolId,
      orgType: 'institution',
    })
  }

  render() {
    const {
      loading,
      updating,
      saving,
      history,
      curriculums,
      interestedStaData,
      role,
    } = this.props
    const readOnly = role === roleuser.SCHOOL_ADMIN
    const showSpin = loading || updating || saving
    const { standardSetsModalVisible } = this.state
    const {
      showAllStandards,
      includeOtherStandards = false,
    } = interestedStaData
    const subjectArray = [
      'Mathematics',
      'ELA',
      'Science',
      'Social Studies',
      'Other Subjects',
    ]
    const selectedStandards = []
    const standardsList = []
    if (
      interestedStaData != null &&
      interestedStaData.hasOwnProperty('curriculums')
    ) {
      for (let i = 0; i < subjectArray.length; i++) {
        const filtedSubject = interestedStaData.curriculums.filter(
          (item) => item.subject === subjectArray[i]
        )
        if (filtedSubject.length > 0) {
          selectedStandards.push(filtedSubject)
        }
      }
    }

    if (selectedStandards.length > 0) {
      for (let i = 0; i < selectedStandards.length; i++) {
        const subjectStandards = []
        for (let j = 0; j < selectedStandards[i].length; j++) {
          const disableClose =
            selectedStandards[i][j]?.orgType === 'district' && readOnly
          subjectStandards.push(
            <StyledSubjectLine>
              <StyledSubjectCloseButton
                disabled={disableClose}
                onClick={() =>
                  this.closeCurriculum(
                    selectedStandards[i][j]._id,
                    disableClose
                  )
                }
              >
                <Icon type="close" />
              </StyledSubjectCloseButton>
              <p>{selectedStandards[i][j].name}</p>
            </StyledSubjectLine>
          )
        }
        standardsList.push(
          <>
            <StyledSubjectTitle>
              {selectedStandards[i][0].subject}
            </StyledSubjectTitle>
            {subjectStandards}
          </>
        )
      }
    }
    // show list end

    return (
      <SettingsWrapper>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? 'true' : 'false'}>
            <AdminSubHeader active={menuActive} history={history} />
            {showSpin && (
              <SpinContainer loading={showSpin}>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <ContentWrapper>
              <SaSchoolSelect onChange={this.handleSchoolSelect} />
              <StyledRow gutter={40} type="flex">
                <StyledCol>
                  <CheckboxLabel
                    onChange={this.updatePreferences}
                    name="showAllStandards"
                    checked={showAllStandards}
                  >
                    Allow teachers to view and use other standards
                  </CheckboxLabel>
                </StyledCol>
                <StyledCol>
                  <CheckboxLabel
                    onChange={this.updatePreferences}
                    name="includeOtherStandards"
                    checked={includeOtherStandards}
                  >
                    Make the teacher-selected standards visible to all
                  </CheckboxLabel>
                </StyledCol>
              </StyledRow>

              <StyledRow gutter={15} type="flex">
                <StyledCol>
                  <EduButton
                    isGhost
                    type="primary"
                    onClick={this.showMyStandardSetsModal}
                    ml="0px"
                  >
                    Select your standard sets
                  </EduButton>
                </StyledCol>
                <StyledCol>
                  <EduButton
                    type="primary"
                    onClick={this.saveInterestedStandards}
                  >
                    Save
                  </EduButton>
                </StyledCol>
              </StyledRow>

              <StyledSubjectContent>
                <StyledCol span={24}>{standardsList}</StyledCol>
              </StyledSubjectContent>
              {standardSetsModalVisible && (
                <StandardSetModal
                  modalVisible={standardSetsModalVisible}
                  saveMyStandardsSet={this.updateMyStandardSets}
                  closeModal={this.hideMyStandardSetsModal}
                  standardList={curriculums}
                  interestedStaData={interestedStaData}
                />
              )}
            </ContentWrapper>
          </StyledLayout>
        </StyledContent>
      </SettingsWrapper>
    )
  }
}

const enhance = compose(
  connect(
    (state) => ({
      interestedStaData: get(state, ['interestedStandardsReducer', 'data'], []),
      loading: get(state, ['interestedStandardsReducer', 'loading'], false),
      saving: get(state, ['interestedStandardsReducer', 'saving'], false),
      updating: get(state, ['interestedStandardsReducer', 'updating'], false),
      schoolId: get(state, 'user.saSettingsSchool'),
      userOrgId: getUserOrgId(state),
      curriculums: getCurriculumsListSelector(state),
      role: getUserRole(state),
    }),
    {
      loadInterestedStandards: receiveInterestedStandardsAction,
      updateInterestedStandards: updateInterestedStandardsAction,
      saveInterestedStandards: saveInterestedStandardsAction,
      getCurriculums: getDictCurriculumsAction,
      deleteStandard: deleteStandardAction,
      updateStandardsPreferences: updateStandardsPreferencesAction,
    }
  )
)

export default enhance(InterestedStandards)

InterestedStandards.propTypes = {
  loadInterestedStandards: PropTypes.func.isRequired,
  updateInterestedStandards: PropTypes.func.isRequired,
  saveInterestedStandards: PropTypes.func.isRequired,
  interestedStaData: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired,
}
