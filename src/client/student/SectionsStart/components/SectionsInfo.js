import React from 'react'
import { IconComment } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'
import {
  SectionTitle,
  SectionTotalItems,
  TestImage,
  TestInstruction,
  TestTitle,
} from '../styled-components'

const SectionsInfo = ({
  thumbnail = '',
  title = '',
  isRedirectedWithQuestionDelivery = false,
  totalItemsCountWithQuestionDelivery,
}) => {
  return (
    <>
      <TestImage>
        <img src={thumbnail} alt={title} />
      </TestImage>
      <TestTitle>{title}</TestTitle>
      <EduIf condition={isRedirectedWithQuestionDelivery}>
        <TestInstruction>
          <IconComment />
          <div style={{ marginLeft: 8 }}>
            <span>Teachers Instruction :</span> Reattempt few questions again.
            [es]
          </div>
        </TestInstruction>
      </EduIf>
      <EduIf
        condition={
          isRedirectedWithQuestionDelivery &&
          typeof totalItemsCountWithQuestionDelivery === 'number'
        }
      >
        <SectionTotalItems>
          Reattempt {totalItemsCountWithQuestionDelivery} questions [es]
        </SectionTotalItems>
      </EduIf>
      <SectionTitle>Your Test Sections [es]</SectionTitle>
    </>
  )
}

export default SectionsInfo
