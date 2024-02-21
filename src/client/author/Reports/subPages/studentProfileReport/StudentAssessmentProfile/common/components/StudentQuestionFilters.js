import React from 'react'
import {
  IconCollapse,
  IconExpand,
  IconFeedback,
  IconFolder,
} from '@edulastic/icons'
import { white } from '@edulastic/colors'
import { EduButton, FlexContainer } from '@edulastic/common'
import { Tooltip } from 'antd'

import { questionStatusOptions } from '@edulastic/constants/const/questionActivity'
import {
  FilterSelect,
  FilterSpan,
} from '../../../../../../ClassBoard/components/Container/styled'

import {
  StudentButtonDiv,
  StudentButtonWrapper,
  StyledStudentTabButton,
} from '../../../../../../StudentView/styled'
import StudentResponse from '../../../../../../QuestionView/component/studentResponses/studentResponse'
import { getQuestionStatusCounts } from '../utils/utils'

const StudentQuestionFilters = ({
  questionActivities,
  initFeedbackValue,
  filter,
  setFilter,
  showStudentWorkButton,
  setShowTestletPlayer,
  attachments,
  toggleAttachmentsModal,
  checkUserLCBAccess,
  toggleShowCorrectAnswers,
  setShowFeedbackPopup,
  hideCorrectAnswer,
  i18Translate,
}) => {
  const questionStatusCounts = getQuestionStatusCounts(questionActivities)
  const feedbackButtonToolTip = (
    <div>
      <p>
        <b>Overall feedback</b>
      </p>
      <p>
        {' '}
        {`${initFeedbackValue.slice(0, 250)}${
          initFeedbackValue.length > 250 ? '.....' : ''
        }`}
      </p>
    </div>
  )
  return (
    <StudentResponse>
      <StudentButtonWrapper>
        <StudentButtonDiv>
          <FilterSpan>FILTER BY STATUS</FilterSpan>
          <FilterSelect
            data-cy="filterByAttemptType"
            className="student-status-filter"
            value={filter}
            dropdownMenuStyle={{ fontSize: 29 }}
            getPopupContainer={(trigger) => trigger.parentElement}
            onChange={setFilter}
            width="170px"
            height="24px"
          >
            {questionStatusOptions.map(({ title, value, countValue }, i) => (
              <FilterSelect.Option
                className="student-status-filter-item"
                key={i}
                value={value}
                style={{ fontSize: 11 }}
              >
                {title} ({questionStatusCounts[countValue]})
              </FilterSelect.Option>
            ))}
          </FilterSelect>
          {showStudentWorkButton && (
            <StyledStudentTabButton onClick={() => setShowTestletPlayer(true)}>
              SHOW STUDENT WORK
            </StyledStudentTabButton>
          )}
        </StudentButtonDiv>

        <FlexContainer alignItems="center">
          {attachments.length > 0 && (
            <EduButton
              isGhost
              data-cy="viewAllAttachmentsButton"
              height="24px"
              fontSize="9px"
              mr="10px"
              ml="0px"
              onClick={toggleAttachmentsModal}
              title="View all attachments"
            >
              <IconFolder height="11.3px" width="11.3px" />
              <span>Attachments</span>
            </EduButton>
          )}
          <EduButton
            isGhost
            height="24px"
            fontSize="9px"
            mr="10px"
            ml="0px"
            onClick={toggleShowCorrectAnswers}
            title="Minimizing view hides correct answers, maximize to view them"
          >
            {hideCorrectAnswer ? (
              <IconExpand height="11.3px" width="11.3px" />
            ) : (
              <IconCollapse height="11.3px" width="11.3px" />
            )}
            <span data-cy="showCorrectAnswer" data-test={!hideCorrectAnswer}>
              {hideCorrectAnswer ? 'Maximize view' : 'Minimize view'}
            </span>
          </EduButton>
          <Tooltip
            title={
              checkUserLCBAccess()
                ? initFeedbackValue.length
                  ? feedbackButtonToolTip
                  : null
                : i18Translate('common.teacherAssignmentRestricted')
            }
            placement="bottom"
          >
            <div>
              <EduButton
                data-cy="overallFeedback"
                onClick={() => setShowFeedbackPopup(true)}
                height="24px"
                fontSize="9px"
                isGhost
                disabled={!checkUserLCBAccess()}
              >
                <IconFeedback color={white} height="13px" width="14px" />
                {initFeedbackValue.length ? (
                  <span>
                    {`${initFeedbackValue.slice(0, 30)}
                      ${initFeedbackValue.length > 30 ? '.....' : ''}`}
                  </span>
                ) : (
                  'GIVE OVERALL FEEDBACK'
                )}
              </EduButton>
            </div>
          </Tooltip>
        </FlexContainer>
      </StudentButtonWrapper>
    </StudentResponse>
  )
}

export default StudentQuestionFilters
