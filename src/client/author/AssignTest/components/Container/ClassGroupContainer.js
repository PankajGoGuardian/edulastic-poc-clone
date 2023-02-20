import React from 'react'
import { SelectInputStyled, FieldLabel, EduIf } from '@edulastic/common'
import { test as testConst } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import { Col, Select, Tooltip } from 'antd'
import ClassSelector from '../SimpleOptions/ClassSelector'
import StudentSelector from '../SimpleOptions/StudentSelector'
import AttemptWindowTypeSelector from '../SimpleOptions/AttemptWindowTypeSelector'
import DateSelector from '../SimpleOptions/DateSelector'
import QuestionPerStandardSelector from '../SimpleOptions/QuestionPerStandardSelector'
import { StyledRow } from '../SimpleOptions/styled'
import DetailsTooltip from './DetailsTooltip'
import SettingContainer from './SettingsContainer'
import TagFilter from '../../../src/components/common/TagFilter'
import AddResources from './AddResources'

const ClassGroupContainer = ({
  changeField,
  fetchStudents,
  classIds,
  group,
  studentOfSelectedClass,
  updateStudents,
  selectAllStudents,
  unselectAllStudents,
  handleRemoveStudents,
  assignment,
  isAssignRecommendations,
  changeDateSelection,
  selectedDateOption,
  showOpenDueAndCloseDate,
  openPolicy,
  closePolicy,
  testSettings,
  isRecommendingStandards,
  questionPerStandardOptions,
  tootltipWidth,
  recommendedResources,
  setEmbeddedVideoPreviewModal,
  resourceIds,
  isVideoResourcePreviewModal,
  showRecommendedResources,
  selectedResourcesAction,
  createClassHandler,
  t,
  isPremiumUser,
}) => {
  const { tags = testSettings.tags } = assignment
  return (
    <>
      {!isAssignRecommendations && (
        <>
          <SettingContainer id="class-group-setting">
            <DetailsTooltip
              width={tootltipWidth}
              title="Class/Group"
              content="Choose one or more classes or groups to receive the test. In the student field below, you can select individuals from these sections if not all students should receive the assignment."
              premium
            />
            <ClassSelector
              onChange={changeField('class')}
              fetchStudents={fetchStudents}
              selectedGroups={classIds}
              group={group}
              createClassHandler={createClassHandler}
            />
          </SettingContainer>

          <SettingContainer id="students-setting">
            <DetailsTooltip
              width={tootltipWidth}
              title="Students"
              content="If you don’t want to assign the test to all students in the class, select Specific Students here and enter individual names in the box below."
              premium
            />
            <StudentSelector
              selectedGroups={classIds}
              students={studentOfSelectedClass}
              groups={group}
              updateStudents={updateStudents}
              selectAllStudents={selectAllStudents}
              unselectAllStudents={unselectAllStudents}
              handleRemoveStudents={handleRemoveStudents}
            />
          </SettingContainer>
        </>
      )}
      <DateSelector
        startDate={assignment.startDate}
        endDate={assignment.endDate}
        dueDate={assignment.dueDate}
        hasStartDate={!isAssignRecommendations}
        changeField={changeField}
        passwordPolicy={assignment.passwordPolicy}
        changeRadioGrop={changeDateSelection}
        selectedOption={selectedDateOption}
        showOpenDueAndCloseDate={showOpenDueAndCloseDate}
        tootltipWidth={tootltipWidth}
        closePolicy={assignment.closePolicy}
      />

      <SettingContainer id="open-policy-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="OPEN POLICY"
          content="Choose Automatically on Open Date to allow students immediate access to the test on the open date/time. This is good for practice or other low stakes assignments. Choose Manually in Class when it is required for the teacher to control the open times, (e.g. a final exam that is assigned to multiple classes throughout the day)."
          premium
          placement="rightTop"
        />
        <StyledRow gutter={16}>
          <Col span={10}>
            <FieldLabel>OPEN POLICY</FieldLabel>
          </Col>
          <Col span={14}>
            <Tooltip
              placement="top"
              title={
                assignment.passwordPolicy ===
                testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
                  ? 'To modify set Dynamic Password as OFF'
                  : null
              }
            >
              <SelectInputStyled
                data-cy="selectOpenPolicy"
                placeholder="Please select"
                cache="false"
                value={assignment.openPolicy}
                onChange={changeField('openPolicy')}
                disabled={
                  assignment.passwordPolicy ===
                  testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
                }
                title="To modify set Dynamic Password as OFF"
              >
                {openPolicy.map(({ value, text }, index) => (
                  <Select.Option key={index} value={value} data-cy="open">
                    {text}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Tooltip>
          </Col>
        </StyledRow>
      </SettingContainer>

      <SettingContainer id="close-policy-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="CLOSE POLICY"
          content="Choose the Automatic option to automatically lock down access on the close date. This eliminates the need for teachers to remember to close and also useful for sending data to Insight reports as soon as all students have submitted. Choose Manually in Class when it is required for the teacher to control the close times, (e.g. a final exam that is assigned to multiple classes throughout the day)."
          premium
          placement="rightTop"
        />
        <StyledRow gutter={16}>
          <Col span={10}>
            <FieldLabel>CLOSE POLICY</FieldLabel>
          </Col>
          <Col span={14}>
            <SelectInputStyled
              data-cy="selectClosePolicy"
              placeholder="Please select"
              cache="false"
              value={assignment.closePolicy}
              onChange={changeField('closePolicy')}
            >
              {closePolicy.map(({ value, text }, index) => (
                <Select.Option data-cy="class" key={index} value={value}>
                  {text}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </Col>
        </StyledRow>
      </SettingContainer>
      <EduIf condition={isPremiumUser}>
        <SettingContainer id="student-attempt-window-setting">
          <DetailsTooltip
            width={tootltipWidth}
            title={t('studentAttemptTimeWindow.title')}
            content={t('studentAttemptTimeWindow.toolTipMsg')}
            premium
            placement="rightTop"
          />
          <StyledRow gutter={16}>
            <AttemptWindowTypeSelector changeField={changeField} />
          </StyledRow>
        </SettingContainer>
      </EduIf>
      <SettingContainer id="tags-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="TAGS"
          content="Tags are keywords you can use to search for your tests in the Assignments or Insights sections.  Entering a tag makes it easier to locate an assigned test or quickly access test data."
          premium
          placement="rightTop"
        />
        <StyledRow gutter={16}>
          <Col span={10}>
            <FieldLabel>Tags</FieldLabel>
          </Col>
          <Col span={14}>
            <TagFilter
              selectedTags={tags}
              canCreate
              onChangeField={(type, value) => changeField(type)(value)}
            />
          </Col>
        </StyledRow>
      </SettingContainer>

      {isAssignRecommendations && isRecommendingStandards && (
        <StyledRow gutter={16}>
          <QuestionPerStandardSelector
            onChange={changeField('questionPerStandard')}
            questionPerStandard={
              assignment.questionPerStandard || testSettings.questionPerStandard
            }
            options={questionPerStandardOptions}
          />
        </StyledRow>
      )}
      {showRecommendedResources && (
        <SettingContainer id="add-resources">
          {recommendedResources.length === 0 && (
            <DetailsTooltip
              width={tootltipWidth}
              title="Resources"
              content="Recommended resources are not available"
              premium
              placement="rightTop"
            />
          )}
          <StyledRow gutter={16}>
            <Col span={10}>
              <FieldLabel marginBottom="0px">Resources</FieldLabel>
            </Col>
            <Col span={14}>
              <AddResources
                recommendedResources={recommendedResources}
                setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
                resourceIds={resourceIds}
                isVideoResourcePreviewModal={isVideoResourcePreviewModal}
                selectedResourcesAction={selectedResourcesAction}
              />
            </Col>
          </StyledRow>
        </SettingContainer>
      )}
    </>
  )
}

export default withNamespaces('author')(ClassGroupContainer)
