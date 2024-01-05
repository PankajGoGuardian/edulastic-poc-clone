import React from 'react'
import PropTypes from 'prop-types'
import { test as testConstants } from '@edulastic/constants'
import { SECTION_STATUS } from '@edulastic/constants/const/testActivityStatus'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import {
  TestSections,
  FlexBox,
  Section,
  SectionProgress,
  SectionContent,
  IconLockStyled,
} from '../styled-components'
import SectionActionButtons from './SectionActionButtons'

const {
  SKIPPED,
  SKIPPED_AND_WRONG,
  SKIPPED_PARTIAL_AND_WRONG,
} = testConstants.redirectPolicy.QuestionDelivery

const TestSectionsContainer = ({
  itemsToDeliverInGroup,
  preventSectionNavigation,
  handleReviewSection,
  handleStartSection,
  isTestPreviewModal,
  questionsDelivery,
}) => {
  const isRedirectedWithQuestionDelivery = [
    SKIPPED,
    SKIPPED_AND_WRONG,
    SKIPPED_PARTIAL_AND_WRONG,
  ].includes(questionsDelivery)
  /**
   * ref: EV-41340
   * In case of redirected test with question delivery setting, some sections items can be empty.
   * Such sections cannot be the nextSection.
   */
  // Find first non submitted section
  const nextSection =
    itemsToDeliverInGroup.find((item) =>
      isRedirectedWithQuestionDelivery
        ? item.status !== SECTION_STATUS.SUBMITTED && !!item?.items?.length
        : item.status !== SECTION_STATUS.SUBMITTED
    ) || {}
  return (
    <TestSections>
      {itemsToDeliverInGroup.map((section, index) => {
        const { items, attempted, skipped, status, groupName } = section
        const isLast = itemsToDeliverInGroup.length == index + 1
        const showLockIcon =
          nextSection.groupId !== section.groupId &&
          section.status !== SECTION_STATUS.SUBMITTED &&
          preventSectionNavigation
        if (!items.length) {
          return null
        }
        return (
          <Section noBorder={isLast} disabled={showLockIcon}>
            <FlexBox>
              {showLockIcon && <IconLockStyled />}
              <SectionContent>
                <h4 data-cy={`sectionName-${index}`}>{groupName}</h4>
                <EduIf condition={!showLockIcon}>
                  <EduThen>
                    <p data-cy={`questionsCompleted-${index}`}>
                      {attempted}/{items.length} questions completed
                    </p>
                  </EduThen>
                  <EduElse>
                    <p>
                      Opens after completing{' '}
                      <b>{itemsToDeliverInGroup[index - 1]?.groupName}</b>
                    </p>
                  </EduElse>
                </EduIf>
              </SectionContent>
            </FlexBox>
            <SectionProgress>
              <SectionActionButtons
                attempted={attempted}
                skipped={skipped}
                preventSectionNavigation={preventSectionNavigation}
                handleReviewSection={handleReviewSection}
                handleStartSection={handleStartSection}
                showLockIcon={showLockIcon}
                index={index}
                status={status}
                isTestPreviewModal={isTestPreviewModal}
              />
            </SectionProgress>
          </Section>
        )
      })}
    </TestSections>
  )
}

TestSectionsContainer.propTypes = {
  itemsToDeliverInGroup: PropTypes.array.isRequired,
  preventSectionNavigation: PropTypes.bool.isRequired,
  handleStartSection: PropTypes.func.isRequired,
  handleReviewSection: PropTypes.func,
  isTestPreviewModal: PropTypes.bool,
}

TestSectionsContainer.defaultProps = {
  handleReviewSection: () => {},
  isTestPreviewModal: false,
}

export default TestSectionsContainer
