import React from 'react'
import { QLabelSpan, StyledHeadDiv } from '../styled'
import Tags from '../../../../../../src/components/common/Tags'

const ColumnTitle = ({ question }) => {
  const { questionLabel, standards = [], points } = question
  const tags = standards.filter((item) => item !== '-')
  return (
    <>
      <StyledHeadDiv>
        <QLabelSpan>{questionLabel}</QLabelSpan>
        <Tags placement="topRight" tags={tags} show={1} />
        <span>points {points}</span>
      </StyledHeadDiv>
    </>
  )
}

export default ColumnTitle
