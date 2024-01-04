import React from 'react'
import {
  SectionTitle,
  TestImage,
  TestInstruction,
  TestTitle,
} from '../styled-components'

const SectionsInfo = ({ thumbnail = '', title = '' }) => {
  return (
    <>
      <TestImage>
        <img src={thumbnail} alt={title} />
      </TestImage>
      <TestTitle>{title}</TestTitle>
      <TestInstruction>
        {/* <IconParent>
          <IconMessage />
        </IconParent>
        <div>
          <span>Teachers Instruction :</span> You are required to submit the
          test section by section and once a section is submitted, you wouldn’t
          be able to change it.
        </div> */}
      </TestInstruction>
      <SectionTitle>Your Test Sections</SectionTitle>
    </>
  )
}

export default SectionsInfo
